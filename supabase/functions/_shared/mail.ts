import { ORDER_KIND, renderEmail, type EmailKind } from "./emails.ts";
import type { PurchaseItem } from "./orders.ts";

/*
 * Sending through Resend with email_log as the ledger, for email-sweep and
 * checkout-complete alike.
 *
 * Every send writes its log row first and is stamped once Resend has the
 * message. The unique (kind, ref) on email_log is what stops a second caller,
 * or a retry, sending the same email again; a failed send is retaken by a
 * later sweep, three times at most.
 */

// deno-lint-ignore no-explicit-any
type Db = any;

export type Claim = { id: string; attempts: number };

export type OrderDue = {
  purchase_id: string;
  user_id: string;
  email: string;
  order_number: string;
  items: PurchaseItem[];
  total_amount: number;
  placed_at: string;
};

export type MailConfig = {
  resendKey: string;
  from: string;
  replyTo: string;
  // Confirmations stay off until ORDER_CONFIRMATIONS is "on", so the order
  // saving can ship and be watched before anything emails a customer.
  confirmationsOn: boolean;
};

export const MAX_ATTEMPTS = 3;

export function mailer(db: Db, config: MailConfig) {
  /**
   * Writes the log row this send will be stamped on, or retakes one an earlier
   * send failed. Null when somebody else already holds it.
   */
  async function claim(
    kind: EmailKind,
    candidate: { user_id: string; ref: string },
    to: string,
  ): Promise<Claim | null> {
    const inserted = await db
      .from("email_log")
      .insert({
        user_id: candidate.user_id,
        email: to,
        kind,
        ref: candidate.ref,
      })
      .select("id, attempts")
      .single();
    if (!inserted.error) return inserted.data;
    if (inserted.error.code !== "23505") throw inserted.error;

    const held = await db
      .from("email_log")
      .select("id, attempts, status")
      .eq("kind", kind)
      .eq("ref", candidate.ref)
      .single();
    if (held.error) throw held.error;
    if (held.data.status !== "failed" || held.data.attempts >= MAX_ATTEMPTS) {
      return null;
    }
    const retaken = await db
      .from("email_log")
      .update({
        status: "claimed",
        attempts: held.data.attempts + 1,
        email: to,
        error: null,
      })
      .eq("id", held.data.id)
      .eq("status", "failed")
      .eq("attempts", held.data.attempts)
      .select("id, attempts")
      .maybeSingle();
    if (retaken.error) throw retaken.error;
    return retaken.data ?? null;
  }

  /**
   * Hands one message to Resend and returns its id. A confirmation has no
   * one-click link: it is about an order, and there is no list to leave.
   */
  async function deliver(
    to: string,
    kind: EmailKind,
    email: { subject: string; html: string; text: string },
    oneClick: string | null,
    idempotencyKey: string,
  ): Promise<string> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: [to],
        reply_to: config.replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: oneClick
          ? {
              "List-Unsubscribe": `<${oneClick}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
          : {},
        tags: [
          { name: "site", value: "speedway146" },
          { name: "kind", value: kind },
        ],
      }),
    });
    const answer = await response.json().catch(() => ({}));
    if (!response.ok || !answer.id) {
      throw new Error(
        `resend answered ${response.status}: ${answer.message ?? "no id"}`,
      );
    }
    return answer.id;
  }

  /** One confirmation, from its claim to its stamp. */
  async function sendConfirmation(
    order: OrderDue,
    deliverTo: string | null,
  ): Promise<"sent" | "held" | "failed"> {
    const to = deliverTo ?? order.email;
    const held = await claim(
      ORDER_KIND,
      { user_id: order.user_id, ref: order.purchase_id },
      to,
    );
    if (!held) return "held";
    try {
      const email = renderEmail({
        kind: ORDER_KIND,
        order: {
          number: order.order_number,
          items: order.items,
          total: order.total_amount,
          placedAt: new Date(order.placed_at),
        },
      });
      const providerId = await deliver(
        to,
        ORDER_KIND,
        email,
        null,
        `${held.id}-${held.attempts}`,
      );
      const stamped = await db
        .from("email_log")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_id: providerId,
        })
        .eq("id", held.id);
      if (stamped.error) throw stamped.error;
      return "sent";
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      console.error(
        "mail: %s %s failed: %s",
        ORDER_KIND,
        order.purchase_id,
        message,
      );
      await db
        .from("email_log")
        .update({ status: "failed", error: message.slice(0, 1000) })
        .eq("id", held.id);
      return "failed";
    }
  }

  /**
   * Confirms one order now, if confirmations are on and it hasn't been.
   * "done" is an order already confirmed, by this or by the sweep.
   */
  async function confirmPurchase(
    purchaseId: string,
  ): Promise<"sent" | "held" | "failed" | "done" | "off"> {
    if (!config.confirmationsOn) return "off";
    const { data, error } = await db.rpc("order_confirmations_due", {
      p_limit: 1,
      p_purchase_id: purchaseId,
    });
    if (error) throw error;
    const order = (data ?? [])[0] as OrderDue | undefined;
    return order ? await sendConfirmation(order, null) : "done";
  }

  return { claim, deliver, sendConfirmation, confirmPurchase };
}
