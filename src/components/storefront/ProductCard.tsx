"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Producto } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

type UIProduct = Producto & { precioOriginal?: number; descuentoPct?: number; nuevo?: boolean };

function pct(p: UIProduct) {
  if (p.descuentoPct != null) return p.descuentoPct;
  const lista = p.precio_lista != null ? Number(p.precio_lista) : p.precioOriginal;
  if (lista && lista > p.precio) return Math.round((1 - p.precio / lista) * 100);
  return null;
}

export function ProductCard({ producto }: { producto: UIProduct }) {
  const add = useCartStore((s) => s.add);
  const [fav, setFav] = useState(false);
  const slug = producto.tiendas?.slug ?? "tienda";
  const href = `/${slug}/producto/${producto.id}`;
  const desc = pct(producto);
  const lista = producto.precio_lista ?? producto.precioOriginal;
  const talleChips = (producto.talle || "")
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-700 bg-[#111111] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-500/80 hover:shadow-lg">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <Image
          src={producto.fotos?.[0] ?? "https://picsum.photos/400/500?random=98"}
          alt={producto.nombre}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {desc != null && desc > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow">
            -{desc}%
          </span>
        )}
        {producto.nuevo && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">NUEVO</span>
        )}
        {producto.destacado && (
          <span className="absolute bottom-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">DESTACADO</span>
        )}
      </Link>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-bold text-white">{producto.nombre}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-400/90">
              {producto.marca ?? "Marca propia"}
            </p>
            <Link
              href={`/${slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-zinc-400 transition hover:text-orange-400 hover:underline"
            >
              {producto.tiendas?.nombre ?? "Tienda La Salada"}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            className="shrink-0 rounded-lg p-1 text-xl leading-none text-zinc-500 transition hover:scale-110 hover:text-rose-400"
            aria-label="Favoritos"
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>
        <div>
          {lista != null && Number(lista) > Number(producto.precio) && (
            <p className="text-xs text-zinc-500 line-through">
              ${Number(lista).toLocaleString("es-AR")}
            </p>
          )}
          <p className="text-lg font-black text-white">${Number(producto.precio).toLocaleString("es-AR")}</p>
        </div>
        {talleChips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {talleChips.map((s) => (
              <span
                key={s}
                className="rounded border border-zinc-600 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 pt-0.5">
          <Link
            href={href}
            className="block w-full rounded-xl border border-zinc-600 py-2 text-center text-sm font-bold text-zinc-100 transition hover:border-orange-500 hover:bg-zinc-800"
          >
            Ver producto
          </Link>
          <button
            type="button"
            onClick={() => add(producto)}
            className="w-full rounded-xl bg-orange-500 px-3 py-2 text-sm font-black text-white shadow transition hover:bg-orange-600"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
