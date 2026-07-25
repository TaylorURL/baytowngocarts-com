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
      (total, item) => total + parsePriceString(item.product.price) * item.quantity,
      0,
    ),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
