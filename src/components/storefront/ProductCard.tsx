"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import type { Producto } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

type UIProduct = Producto & {
  precioOriginal?: number;
  descuentoPct?: number;
  nuevo?: boolean;
  tienda_slug?: string | null;
};

function pct(p: UIProduct) {
  if (p.descuentoPct != null) return p.descuentoPct;
  const lista = p.precio_lista != null ? Number(p.precio_lista) : p.precioOriginal;
  if (lista && lista > p.precio) return Math.round((1 - p.precio / lista) * 100);
  return null;
}

export function ProductCard({ producto }: { producto: UIProduct }) {
  const add = useCartStore((s) => s.add);
  const [fav, setFav] = useState(false);
  const isDemo = String(producto.id).startsWith("demo-");
  const slug = producto.tienda_slug ?? producto.tiendas?.slug ?? (isDemo ? "moda-la-salada-demo" : "tienda");
  const href = `/${slug}/producto/${producto.id}`;
  const desc = pct(producto);
  const lista = producto.precio_lista ?? producto.precioOriginal;
  const precioMayorista = (producto as UIProduct & { precio_mayorista?: number }).precio_mayorista;
  const talleChips = (producto.talle || "")
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F97316]/80 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
        <Image
          src={producto.fotos?.[0] ?? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"}
          alt={producto.nombre}
          fill
          loading="lazy"
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {desc != null && desc > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-[#F97316] px-2 py-1 text-xs font-bold text-white shadow">
            OFERTA
          </span>
        )}
        {typeof precioMayorista === "number" && precioMayorista > 0 && (
          <span className="absolute left-2 top-10 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white shadow">
            MAYORISTA
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
            <p className="line-clamp-2 text-sm font-bold text-[#1A1A1A]">{producto.nombre}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
              {producto.marca ?? "Marca propia"}
            </p>
            <Link
              href={`/${slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[#555555] transition hover:text-[#F97316] hover:underline"
            >
              {producto.tiendas?.nombre ?? "Tienda La Salada"}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            className="shrink-0 rounded-lg p-1 text-xl leading-none text-[#555555] transition hover:scale-110 hover:text-rose-500"
            aria-label="Favoritos"
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>
        <div>
          {lista != null && Number(lista) > Number(producto.precio) && (
            <p className="text-xs text-[#555555] line-through">
              ${Number(lista).toLocaleString("es-AR")}
            </p>
          )}
          <p className="text-lg font-black text-[#1A1A1A]">${Number(producto.precio).toLocaleString("es-AR")}</p>
        </div>
        {talleChips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {talleChips.map((s) => (
              <span
                key={s}
                className="rounded border border-[#E0E0E0] px-1.5 py-0.5 text-[10px] font-bold text-[#555555]"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 pt-0.5">
          <Link
            href={href}
            className="block w-full rounded-xl border border-[#E0E0E0] py-2 text-center text-sm font-bold text-[#1A1A1A] transition hover:border-[#F97316] hover:bg-[#F5F5F5]"
          >
            Ver producto
          </Link>
          <button
            type="button"
            onClick={() => {
              add(producto);
              showToast("Agregado al carrito", "success");
            }}
            className="invisible w-full rounded-xl bg-[#F97316] px-3 py-2 text-sm font-black text-white shadow transition hover:bg-[#EA6C0A] group-hover:visible"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
