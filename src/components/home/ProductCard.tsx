"use client";

import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

type Row = Producto & {
  tiendas?: { slug: string; nombre: string; logo_url: string | null } | null;
};

export function ProductCard({ producto }: { producto: Row }) {
  const add = useCartStore((s) => s.add);
  const slug = producto.tiendas?.slug ?? "tienda";
  const href = `/${slug}/producto/${producto.id}`;
  const img = producto.fotos?.[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-surface shadow-sm transition hover:border-accent/40">
      <Link href={href} className="relative aspect-[4/3] bg-zinc-900">
        {img ? (
          <Image
            src={img}
            alt={producto.nombre}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">Sin imagen</div>
        )}
        {producto.destacado && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-black">
            Destacado
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={href} className="line-clamp-2 text-sm font-medium text-white hover:text-accent">
          {producto.nombre}
        </Link>
        {producto.tiendas && (
          <Link href={`/${producto.tiendas.slug}`} className="text-xs text-zinc-500 hover:text-accent">
            {producto.tiendas.nombre}
          </Link>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-white">${Number(producto.precio).toLocaleString("es-AR")}</p>
          <button
            type="button"
            onClick={() => add({ ...producto, tiendas: producto.tiendas ?? undefined })}
            disabled={producto.stock <= 0}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
