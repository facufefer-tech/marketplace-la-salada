import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "@/lib/types";

export function cartLineId(productoId: string, talle: string, color: string) {
  return `${productoId}::${talle}::${color}`;
}

export type CartLine = {
  lineId: string;
  producto: Producto;
  cantidad: number;
  talle: string;
  color: string;
};

type AddOpts = { cantidad?: number; talle?: string; color?: string };

type CartState = {
  lines: CartLine[];
  add: (producto: Producto, opts?: AddOpts) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, cantidad: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

function defaultTalle(p: Producto) {
  const t = (p.talle || "").split(/[,\s]+/)[0]?.trim();
  return t || "Único";
}

function defaultColor(p: Producto) {
  const t = (p.color || "").split(/[,\s]+/)[0]?.trim();
  return t || "Único";
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (producto, opts) => {
        const cantidad = Math.max(1, opts?.cantidad ?? 1);
        const talle = (opts?.talle ?? defaultTalle(producto)).trim() || "Único";
        const color = (opts?.color ?? defaultColor(producto)).trim() || "Único";
        const lineId = cartLineId(producto.id, talle, color);
        const cap = Math.max(1, producto.stock);
        set((s) => {
          const idx = s.lines.findIndex((l) => l.lineId === lineId);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = {
              ...next[idx],
              cantidad: Math.min(next[idx].cantidad + cantidad, cap),
            };
            return { lines: next };
          }
          return {
            lines: [...s.lines, { lineId, producto, talle, color, cantidad: Math.min(cantidad, cap) }],
          };
        });
      },
      remove: (lineId) => set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),
      setQty: (lineId, cantidad) =>
        set((s) => ({
          lines: s.lines.map((l) => {
            if (l.lineId !== lineId) return l;
            return {
              ...l,
              cantidad: Math.max(1, Math.min(cantidad, Math.max(1, l.producto.stock))),
            };
          }),
        })),
      clear: () => set({ lines: [] }),
      total: () =>
        get().lines.reduce((acc, l) => acc + Number(l.producto.precio) * l.cantidad, 0),
      count: () => get().lines.reduce((acc, l) => acc + l.cantidad, 0),
    }),
    { name: "la-salada-cart-v2" },
  ),
);
