import { useEffect, useState } from "react";

export type CartItem = { id: string; qty: number };

const KEY = "udia.cart";
const EVT = "udia.cart.changed";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const cart = {
  get: read,
  add(id: string, qty = 1) {
    const items = read();
    const existing = items.find((i) => i.id === id);
    if (existing) existing.qty += qty;
    else items.push({ id, qty });
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return items;
}
