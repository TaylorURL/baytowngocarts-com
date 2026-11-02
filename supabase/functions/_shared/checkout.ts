import {
  isPaid,
  isSiteSession,
  orderNumber,
  paidAt,
  purchaseRow,
  type PurchaseRow,
  type StripeLineItem,
  type StripeSession,
} from "./orders.ts";

/*
 * Turning a paid Stripe checkout into an order, for the two callers that do
 * it. checkout-complete does it the moment the buyer lands back on the
 * success page; email-sweep does it within thirty seconds for the buyer who
 * never does. Stripe's own notice would be the third, but it never reaches
 * this project: its webhook listens to connected accounts, and these
 * checkouts belong to the platform.
 *
 * Everything here is safe to run twice. The order is keyed on the session,
 * the checkout attempt only closes once, and the code only spends once.
 */

// deno-lint-ignore no-explicit-any
type Db = any;

export type Recorded = {
  outcome: "recorded" | "exists" | "would record";
  row?: PurchaseRow;
};

export function checkouts(db: Db, stripeKey: string) {
  const stripeGet = (path: string) =>
    fetch(`https://api.stripe.com/v1/${path}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });

  /** A session with the payment intent beside it, which dates the sale. */
  const fetchSession = (id: string) =>
    stripeGet(
      `checkout/sessions/${encodeURIComponent(id)}?expand[]=payment_intent`,
    );

  /**
   * Writes the order a paid session is missing. "exists" is the other caller
   * having written it first.
   */
  async function recordPurchase(
    session: StripeSession,
    userId: string,
    dryRun: boolean,
  ): Promise<Recorded> {
    const existing = await db
      .from("purchases")
      .select("id")
      .eq("stripe_session_id", session.id)
      .limit(1);
    if (existing.error) throw existing.error;
    if (existing.data?.length) return { outcome: "exists" };

    const response = await stripeGet(
      `checkout/sessions/${encodeURIComponent(session.id)}/line_items?limit=100`,
    );
    if (!response.ok) {
      throw new Error(
        `Stripe answered ${response.status} for the lines of ${session.id}`,
      );
    }
    const lines = ((await response.json()).data ?? []) as StripeLineItem[];

    // The order number is six random digits, so a clash with an existing one
    // is a one-in-a-million draw; one more try covers it.
    for (let tries = 0; tries < 2; tries += 1) {
      const row = purchaseRow(
        session,
        lines,
        userId,
        orderNumber(paidAt(session)),
      );
      if (dryRun) return { outcome: "would record", row };
      const { error } = await db.from("purchases").insert(row);
      if (!error) return { outcome: "recorded", row };
      if (error.code !== "23505") throw error;
      // The session's own index: the other caller wrote it in the meantime.
      if (!String(error.message).includes("order_number")) {
        return { outcome: "exists" };
      }
    }
    throw new Error("could not draw an unused order number");
  }

  /**
   * Records the order, closes the checkout attempt and spends the code it was
   * paid with. The last two are written whether or not this call wrote the
   * order, and a failure there is logged rather than undoing the sale.
   */
  async function completeCheckout(
    session: StripeSession,
    userId: string,
    dryRun: boolean,
  ): Promise<Recorded> {
    const recorded = await recordPurchase(session, userId, dryRun);
    if (dryRun) return recorded;

    const closedAt = new Date().toISOString();
    const closed = await db
      .from("checkout_attempts")
      .update({ status: "completed", closed_at: closedAt })
      .eq("stripe_session_id", session.id)
      .in("status", ["open", "expired", "void"]);
    if (closed.error) {
      console.error(
        "checkout: could not close %s: %s",
        session.id,
        closed.error.message,
      );
    }

    const promoCodeId = session.metadata?.promo_code_id;
    if (promoCodeId) {
      const spent = await db
        .from("promo_codes")
        .update({ redeemed_at: closedAt, redeemed_session_id: session.id })
        .eq("id", promoCodeId)
        .is("redeemed_at", null);
      if (spent.error) {
        console.error(
          "checkout: could not spend %s: %s",
          promoCodeId,
          spent.error.message,
        );
      }
    }
    return recorded;
  }

  /**
   * Looks every open checkout up on Stripe: a paid one is completed, an
   * expired or missing one is closed as that, and one still open is left for
   * the next run. A dry run asks Stripe the same questions and writes nothing.
   */
  async function settleOpen(dryRun: boolean) {
    const settled = {
      recorded: 0,
      completed: 0,
      expired: 0,
      void: 0,
      open: 0,
      errors: 0,
    };
    const wouldRecord: ReturnType<typeof summarize>[] = [];
    const { data, error } = await db
      .from("checkout_attempts")
      .select("id, user_id, stripe_session_id")
      .eq("status", "open")
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw error;

    for (const attempt of data ?? []) {
      const response = await fetchSession(attempt.stripe_session_id);
      let status: "expired" | "void" | null = null;
      if (response.status === 404) {
        status = "void";
      } else if (response.ok) {
        const session = (await response.json()) as StripeSession;
        if (isPaid(session)) {
          try {
            const { outcome, row } = await completeCheckout(
              session,
              attempt.user_id,
              dryRun,
            );
            if (outcome === "recorded") settled.recorded += 1;
            if (outcome === "would record" && row)
              wouldRecord.push(summarize(row));
            settled.completed += 1;
          } catch (cause) {
            // Left open, so the next run tries the order again.
            settled.errors += 1;
            console.error(
              "checkout: could not record %s: %s",
              session.id,
              cause instanceof Error ? cause.message : cause,
            );
          }
          continue;
        }
        if (session.status === "expired") status = "expired";
      } else {
        settled.errors += 1;
        console.error(
          "checkout: Stripe answered %d for %s",
          response.status,
          attempt.stripe_session_id,
        );
        continue;
      }
      if (!status) {
        settled.open += 1;
        continue;
      }
      if (!dryRun) {
        const { error: updateError } = await db
          .from("checkout_attempts")
          .update({ status, closed_at: new Date().toISOString() })
          .eq("id", attempt.id)
          .eq("status", "open");
        if (updateError) throw updateError;
      }
      settled[status] += 1;
    }
    return dryRun ? { ...settled, wouldRecord } : settled;
  }

  /**
   * Writes the orders for paid sessions named one by one, for the sales made
   * before checkouts were tracked and so never seen by settleOpen. Each must
   * be this site's and carry the account it was bought on.
   */
  async function recover(ids: string[], dryRun: boolean) {
    const results: Record<string, unknown> = {};
    for (const id of ids) {
      const response = await fetchSession(id);
      if (!response.ok) {
        results[id] = { error: `Stripe answered ${response.status}` };
        continue;
      }
      const session = (await response.json()) as StripeSession;
      const userId = session.metadata?.user_id ?? "";
      if (!isSiteSession(session)) {
        results[id] = { error: "not a checkout from this site" };
      } else if (!isPaid(session)) {
        results[id] = { error: "not paid" };
      } else if (!userId) {
        results[id] = { error: "no account on the session" };
      } else {
        const { outcome, row } = await recordPurchase(session, userId, dryRun);
        results[id] = row ? { outcome, ...summarize(row) } : { outcome };
      }
    }
    return results;
  }

  return {
    fetchSession,
    recordPurchase,
    completeCheckout,
    settleOpen,
    recover,
  };
}

/** What a dry run shows of an order it would have written. */
export const summarize = (row: PurchaseRow) => ({
  session: row.stripe_session_id,
  paidAt: row.created_at,
  total: row.total_amount,
  items: row.items.map((item) => `${item.quantity} × ${item.product_name}`),
});
