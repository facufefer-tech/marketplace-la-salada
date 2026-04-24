import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "@/lib/types";

export type CartLine = {
  producto: Producto;
  cantidad: number;
};

type CartState = {
  lines: CartLine[];
  add: (producto: Producto, cantidad?: number) => void;
  remove: (productoId: string) => void;
  setQty: (productoId: string, cantidad: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (producto, cantidad = 1) => {
        set((s) => {
          const idx = s.lines.findIndex((l) => l.producto.id === producto.id);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = {
              ...next[idx],
              cantidad: Math.min(
                next[idx].cantidad + cantidad,
                Math.max(1, producto.stock),
              ),
            };
            return { lines: next };
          }
          return {
            lines: [...s.lines, { producto, cantidad: Math.min(cantidad, Math.max(1, producto.stock)) }],
          };
        });
      },
      remove: (productoId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.producto.id !== productoId) })),
      setQty: (productoId, cantidad) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.producto.id === productoId
              ? { ...l, cantidad: Math.max(1, Math.min(cantidad, l.producto.stock)) }
              : l,
          ),
        })),
      clear: () => set({ lines: [] }),
      total: () =>
        get().lines.reduce((acc, l) => acc + Number(l.producto.precio) * l.cantidad, 0),
      count: () => get().lines.reduce((acc, l) => acc + l.cantidad, 0),
    }),
    { name: "la-salada-cart" },
  ),
);
