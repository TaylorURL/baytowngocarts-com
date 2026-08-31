import { createContext, useContext } from "react";

/*
 * The toast channel, kept apart from the components that render it so a file
 * of components stays a file of components and fast refresh keeps working.
 */
export const ToastContext = createContext(null);

/** Raises a toast: notify(text, "success" | "error"). */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast was called outside ToastProvider");
  }
  return ctx;
}
