import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart, useCartHydrated } from "./useCart";
import { useToast } from "./useToast.js";

/** `add=prod_single_kart_15:2,prod_party_bounce_upgrade:1`, as the emails write it. */
const parseCartParam = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => {
      const [id, quantity] = entry.split(":");
      return { id, quantity: Number(quantity) };
    });

/*
 * What a Speedway 146 email's button carries, taken off the address on
 * whichever page it lands: `add` rebuilds the cart the reminder was about, and
 * `code` puts the offer's code on the cart, so tapping the button is the whole
 * of claiming it. The code is priced again at checkout either way.
 *
 * It waits for the saved cart to be read back, so the saved one cannot land on
 * top of what the link brought, and then takes both off the address so a
 * refresh does not undo whatever the visitor changes next.
 */
export function useEmailLink() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cartReady = useCartHydrated();
  const { notify } = useToast();

  useEffect(() => {
    if (!cartReady) return;
    const add = searchParams.get("add");
    const code = searchParams.get("code");
    if (!add && !code) return;
    const { restoreItems, setPromoCode } = useCart.getState();
    if (add) restoreItems(parseCartParam(add));
    if (code) {
      setPromoCode(code);
      notify(
        `Code ${code.trim().toUpperCase()} is on your cart. The discount comes off at checkout.`,
      );
    }
    const rest = new URLSearchParams(searchParams);
    rest.delete("add");
    rest.delete("code");
    setSearchParams(rest, { replace: true });
  }, [cartReady, searchParams, setSearchParams, notify]);
}
