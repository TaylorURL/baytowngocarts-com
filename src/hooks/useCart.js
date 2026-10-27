import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { parsePriceString } from "../lib/pricing.js";
import {
  STRIPE_PARTY_PACKAGES,
  STRIPE_PRODUCTS,
} from "../lib/stripe-config.js";

const CATALOG = new Map(
  [...STRIPE_PRODUCTS, ...STRIPE_PARTY_PACKAGES].map((product) => [
    product.id,
    product,
  ]),
);

const MAX_QUANTITY = 100;

/** Today's product for an id, or null for one the site no longer sells. */
export const productById = (id) => CATALOG.get(id) ?? null;

/*
 * A cart line is saved as an id and a count, and rebuilt from today's catalog
 * when it is read back, so a cart saved before a price change goes to checkout
 * at the new price rather than being refused by create-checkout as tampered.
 */
const rebuild = (lines) =>
  (Array.isArray(lines) ? lines : []).flatMap((line) => {
    const product = productById(line?.id);
    const quantity = Number(line?.quantity);
    if (!product || !Number.isInteger(quantity)) return [];
    if (quantity < 1 || quantity > MAX_QUANTITY) return [];
    return [{ product, quantity }];
  });

/*
 * The cart outlives the page. Checkout leaves for Stripe with a full
 * navigation, so a cart held only in memory was gone by the time a buyer who
 * backed out of Stripe landed back on /cart.
 *
 * `skipHydration` keeps the saved cart out of the render that attaches to a
 * prerendered page, whose header was built with an empty cart; App reads it
 * back once that render has committed.
 */
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id,
        );
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      /*
       * Adds a whole selection in one write. Calling addItem in a loop
       * re-renders every subscriber once per line, so the paint that ends the
       * click's measured delay waits for all of them.
       */
      addItems: (entries) => {
        const items = [...get().items];
        entries.forEach(({ product, quantity }) => {
          if (!(quantity > 0)) return;
          const index = items.findIndex(
            (item) => item.product.id === product.id,
          );
          if (index === -1) {
            items.push({ product, quantity });
          } else {
            items[index] = {
              ...items[index],
              quantity: items[index].quantity + quantity,
            };
          }
        });
        set({ items });
      },
      /** Replaces the cart with saved lines, as a reminder email's link does. */
      restoreItems: (lines) => {
        const items = rebuild(lines);
        if (items.length) set({ items });
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        });
      },
      setPromoCode: (promoCode) =>
        set({
          promoCode: String(promoCode || "")
            .trim()
            .toUpperCase(),
        }),
      clearCart: () => set({ items: [], promoCode: "" }),
      getTotal: () =>
        get().items.reduce(
          (total, item) =>
            total + parsePriceString(item.product.price) * item.quantity,
          0,
        ),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "speedway146-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        items: state.items.map(({ product, quantity }) => ({
          id: product.id,
          quantity,
        })),
        promoCode: state.promoCode,
      }),
      merge: (saved, current) => ({
        ...current,
        items: rebuild(saved?.items),
        promoCode: typeof saved?.promoCode === "string" ? saved.promoCode : "",
      }),
    },
  ),
);

const subscribeToHydration = (onChange) =>
  useCart.persist.onFinishHydration(onChange);

/** True once the saved cart has been read back into the store. */
export const useCartHydrated = () =>
  useSyncExternalStore(
    subscribeToHydration,
    () => useCart.persist.hasHydrated(),
    () => false,
  );
