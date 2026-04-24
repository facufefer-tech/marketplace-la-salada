"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Producto } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

type UIProduct = Producto & { precioOriginal?: number; descuentoPct?: number; nuevo?: boolean };

export function ProductCard({ producto }: { producto: UIProduct }) {
  const add = useCartStore((s) => s.add);
  const [fav, setFav] = useState(false);
  const slug = producto.tiendas?.slug ?? "tienda";
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-700 bg-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-lg">
      <Link href={`/${slug}/producto/${producto.id}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <Image
          src={producto.fotos?.[0] ?? "https://picsum.photos/400/500?random=98"}
          alt={producto.nombre}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {producto.descuentoPct && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{producto.descuentoPct}%
          </span>
        )}
        {producto.nuevo && <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">NUEVO</span>}
        {producto.destacado && <span className="absolute bottom-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">DESTACADO</span>}
      </Link>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-bold text-white">{producto.nombre}</p>
            <p className="text-xs text-zinc-400">{producto.tiendas?.nombre ?? "Tienda La Salada"}</p>
          </div>
          <button type="button" onClick={() => setFav((v) => !v)} className="text-lg leading-none text-zinc-300">
            {fav ? "♥" : "♡"}
          </button>
        </div>
        <div>
          {producto.precioOriginal && <p className="text-xs text-zinc-500 line-through">${producto.precioOriginal.toLocaleString("es-AR")}</p>}
          <p className="text-lg font-black text-white">${Number(producto.precio).toLocaleString("es-AR")}</p>
        </div>
        <button
          type="button"
          onClick={() => add(producto)}
          className="w-full rounded-xl bg-orange-500 px-3 py-2 text-sm font-black text-white hover:bg-orange-600"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
