"use client";

import { useCartStore } from "@/store/useCartStore";
import type { Producto } from "@/lib/types";

type Row = Producto & {
  tiendas?: { slug: string; nombre: string; logo_url?: string | null };
};

export function AddToCartButton({ producto }: { producto: Row }) {
  const add = useCartStore((s) => s.add);
  const disabled = producto.stock <= 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => add(producto)}
      className="w-full rounded-xl bg-accent py-3 text-center text-sm font-bold text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[200px] sm:px-8"
    >
      {disabled ? "Sin stock" : "Agregar al carrito"}
    </button>
  );
}
