import { create } from "zustand";
import { parsePriceString } from "../lib/pricing.js";

export const useCart = create((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);
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
   * Adds a whole selection in one write. Calling addItem in a loop re-renders
   * every subscriber once per line, so the paint that ends the click's measured
   * delay waits for all of them.
   */
  addItems: (entries) => {
    const items = [...get().items];
    entries.forEach(({ product, quantity }) => {
      if (!(quantity > 0)) return;
      const index = items.findIndex((item) => item.product.id === product.id);
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
  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.product.id !== productId) });
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
  clearCart: () => set({ items: [] }),
  getTotal: () =>
    get().items.reduce(
      (total, item) =>
        total + parsePriceString(item.product.price) * item.quantity,
      0,
    ),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
