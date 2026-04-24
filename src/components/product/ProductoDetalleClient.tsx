"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { EnvioMetodos, Producto, Tienda } from "@/lib/types";
import { waMeHref } from "@/lib/whatsapp";
import { useCartStore } from "@/store/useCartStore";

type TiendaIn = NonNullable<Producto["tiendas"]> & { direccion?: string | null };

const labels: { k: keyof EnvioMetodos; t: string; d: string }[] = [
  { k: "retiro", t: "Retiro en el puesto", d: "Gratis, coordiná horario con el feriante." },
  { k: "correo", t: "Correo Argentino", d: "El feriante te coordina plazos y costo." },
  { k: "oca", t: "OCA", d: "El feriante te coordina el envío." },
  { k: "andreani", t: "Andreani", d: "El feriante te coordina el envío." },
];

function splitTokens(s: string | null) {
  if (!s) return [] as string[];
  return s
    .split(/[,\/|]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function ProductoDetalleClient({
  producto: initial,
  tienda: t,
}: {
  producto: Producto;
  tienda: TiendaIn & Pick<Tienda, "direccion" | "whatsapp" | "instagram" | "envio_metodos">;
}) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const fotos = initial.fotos?.length ? initial.fotos : ["https://picsum.photos/800/800?random=4"];
  const [idx, setIdx] = useState(0);
  const talles = useMemo(() => {
    const raw = splitTokens(initial.talle);
    return raw.length ? raw : ["Único"];
  }, [initial.talle]);
  const colores = useMemo(() => {
    const raw = splitTokens(initial.color);
    return raw.length ? raw : ["Único"];
  }, [initial.color]);
  const [talle, setTalle] = useState(talles[0] ?? "Único");
  const [color, setColor] = useState(colores[0] ?? "Único");
  const [qty, setQty] = useState(1);
  const slug = t.slug;
  const wa = waMeHref(t.whatsapp);
  const env = (t.envio_metodos as EnvioMetodos | null | undefined) ?? {
    retiro: true,
    correo: false,
    oca: false,
    andreani: false,
  };
  const lista = initial.precio_lista != null ? Number(initial.precio_lista) : null;
  const pctOff =
    lista && lista > Number(initial.precio) ? Math.round((1 - Number(initial.precio) / lista) * 100) : null;

  function onAdd() {
    add(initial, { cantidad: qty, talle, color });
  }
  function onBuy() {
    onAdd();
    router.push("/carrito");
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <Image
            src={fotos[idx]!}
            alt={initial.nombre}
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        {fotos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {fotos.map((f, i) => (
              <button
                key={f + i}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === idx ? "border-orange-500" : "border-zinc-800"
                }`}
              >
                <Image src={f} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white md:text-4xl">{initial.nombre}</h1>
        {initial.marca && (
          <p className="text-sm font-bold uppercase tracking-wide text-orange-400">{initial.marca}</p>
        )}
        <div className="flex flex-wrap items-baseline gap-2">
          {lista != null && lista > Number(initial.precio) && (
            <p className="text-lg text-zinc-500 line-through">${lista.toLocaleString("es-AR")}</p>
          )}
          <p className="text-3xl font-black text-white">${Number(initial.precio).toLocaleString("es-AR")}</p>
          {pctOff != null && pctOff > 0 && (
            <span className="rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-0.5 text-sm font-bold text-white">
              -{pctOff}%
            </span>
          )}
        </div>
        {initial.descripcion && (
          <p className="text-sm leading-relaxed text-zinc-400">{initial.descripcion}</p>
        )}

        <div>
          <p className="text-sm font-bold text-zinc-300">Talle</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {talles.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setTalle(x)}
                className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  talle === x
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-300">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colores.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setColor(x)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  color === x
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className="flex max-w-xs items-center gap-3">
          <p className="text-sm font-bold text-zinc-300">Cantidad</p>
          <input
            type="number"
            min={1}
            max={Math.max(1, initial.stock)}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(Math.max(1, initial.stock), parseInt(e.target.value, 10) || 1)))}
            className="w-20 rounded-xl border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>
        <p className="text-sm text-zinc-500">Stock disponible: {initial.stock}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onAdd}
            disabled={initial.stock <= 0}
            className="flex-1 rounded-2xl bg-zinc-800 py-3.5 text-sm font-black text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agregar al carrito
          </button>
          <button
            type="button"
            onClick={onBuy}
            disabled={initial.stock <= 0}
            className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comprar ahora
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-4">
          <p className="text-sm font-bold text-white">Envíos (esta tienda)</p>
          <p className="mt-1 text-xs text-zinc-500">Cada feriante configura qué ofrece en su puesto.</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {labels.map(({ k, t: title, d }) =>
              env[k] ? (
                <li key={k} className="flex gap-2">
                  <span className="text-orange-400">✓</span>
                  <span>
                    <strong className="text-zinc-100">{title}:</strong> {d}
                  </span>
                </li>
              ) : null,
            )}
            {!Object.values(env).some(Boolean) && <li className="text-zinc-500">Consultá opciones al feriante.</li>}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Vendido por</p>
            <Link href={`/${slug}`} className="text-lg font-bold text-orange-400 hover:underline">
              {t.nombre}
            </Link>
            {t.direccion && <p className="text-sm text-zinc-500">{t.direccion}</p>}
          </div>
          {wa && (
            <a
              href={wa + `?text=${encodeURIComponent("Hola! Consulto por: " + initial.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              WhatsApp al feriante
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
