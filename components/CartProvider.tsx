"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "marangoz-sepet";
const LAST_ORDER = "marangoz-son-siparis";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  lastOrderId: string;
  addItem: (productId: string, quantity: number, stock: number) => void;
  setQuantity: (productId: string, quantity: number, stock: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  rememberOrder: (orderId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item &&
                typeof item.productId === "string" &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0,
            ),
          );
        }
      }
      setLastOrderId(sessionStorage.getItem(LAST_ORDER) || "");
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      lastOrderId,
      addItem: (productId, quantity, stock) => {
        setItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          const nextQty = Math.min(stock, (existing?.quantity || 0) + quantity);
          if (nextQty < 1) return current;
          const next = existing
            ? current.map((item) => (item.productId === productId ? { ...item, quantity: nextQty } : item))
            : [...current, { productId, quantity: nextQty }];
          write(next);
          return next;
        });
      },
      setQuantity: (productId, quantity, stock) => {
        setItems((current) => {
          const nextQty = Math.min(stock, Math.max(0, quantity));
          const next =
            nextQty < 1
              ? current.filter((item) => item.productId !== productId)
              : current.map((item) => (item.productId === productId ? { ...item, quantity: nextQty } : item));
          write(next);
          return next;
        });
      },
      removeItem: (productId) => {
        setItems((current) => {
          const next = current.filter((item) => item.productId !== productId);
          write(next);
          return next;
        });
      },
      clear: () => {
        setItems([]);
        write([]);
      },
      rememberOrder: (orderId) => {
        sessionStorage.setItem(LAST_ORDER, orderId);
        setLastOrderId(orderId);
      },
    }),
    [items, lastOrderId, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Sepet sağlayıcısı yok");
  return value;
}
