"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { EnvioMetodos, Producto, ResenaRow, Tienda } from "@/lib/types";
import { showToast } from "@/lib/toast";
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

const envioLabels: Record<string, string> = {
  retiro: "Retiro en el puesto",
  propio_feriante: "Envío propio",
  correo_argentino: "Correo Argentino",
  oca: "OCA",
  andreani: "Andreani",
  mercadoenvios: "MercadoEnvíos",
};

export function ProductoDetalleClient({
  producto: initial,
  tienda: t,
  enviosConfig = [],
  resenas: resenasIn = [],
  productoId = initial.id,
  relacionadosMismaTienda = [],
  similares = [],
}: {
  producto: Producto;
  tienda: TiendaIn & Pick<Tienda, "direccion" | "whatsapp" | "instagram" | "envio_metodos">;
  enviosConfig?: { metodo: string; precio: number; activo: boolean; tiempo_entrega: string | null; descripcion: string | null }[];
  resenas?: ResenaRow[];
  productoId?: string;
  relacionadosMismaTienda?: Producto[];
  similares?: Producto[];
}) {
  const [tab, setTab] = useState<"desc" | "specs" | "resenas">("desc");
  const [showGuia, setShowGuia] = useState(false);
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const fotos = initial.fotos?.length
    ? initial.fotos
    : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"];
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
  const [rnombre, setRnombre] = useState("");
  const [rcom, setRcom] = useState("");
  const [rest, setRest] = useState(5);
  const [rmsg, setRmsg] = useState<string | null>(null);
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
    showToast("Producto agregado al carrito", "success");
  }
  function onBuy() {
    onAdd();
    router.push("/carrito");
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <Image
            src={fotos[idx]!}
            alt={initial.nombre}
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
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
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-zinc-300">Talle</p>
            <button type="button" className="text-xs text-orange-400 hover:underline" onClick={() => setShowGuia(true)}>
              Guía de talles
            </button>
          </div>
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
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  color === x
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-zinc-500 bg-zinc-400" />
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
        <p className="text-sm font-semibold text-amber-400">¡Solo {Math.max(0, initial.stock)} disponibles!</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onAdd}
            disabled={initial.stock <= 0}
            className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agregar al carrito
          </button>
          <button
            type="button"
            onClick={onBuy}
            disabled={initial.stock <= 0}
            className="flex-1 rounded-2xl border border-zinc-600 bg-zinc-900 py-3.5 text-sm font-black text-white transition hover:border-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comprar ahora
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-4">
          <div className="mb-3 flex gap-2 border-b border-zinc-800 pb-3 text-xs font-bold uppercase tracking-wide">
            <button type="button" onClick={() => setTab("desc")} className={tab === "desc" ? "text-orange-400" : "text-zinc-500"}>
              Descripción
            </button>
            <button type="button" onClick={() => setTab("specs")} className={tab === "specs" ? "text-orange-400" : "text-zinc-500"}>
              Especificaciones
            </button>
            <button type="button" onClick={() => setTab("resenas")} className={tab === "resenas" ? "text-orange-400" : "text-zinc-500"}>
              Reseñas
            </button>
          </div>
          {tab === "desc" ? (
            <p className="text-sm text-zinc-300">{initial.descripcion ?? "Sin descripción."}</p>
          ) : null}
          {tab === "specs" ? (
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>Marca: {initial.marca ?? "No informada"}</li>
              <li>Categoría: {initial.categoria ?? "General"}</li>
              <li>Material: {initial.material ?? "No informado"}</li>
              <li>SKU: {initial.sku ?? "No informado"}</li>
            </ul>
          ) : null}
          {tab === "resenas" ? (
            <p className="text-sm text-zinc-400">Promedio {resenasIn.length ? (resenasIn.reduce((a, r) => a + r.estrellas, 0) / resenasIn.length).toFixed(1) : "0"} ★</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-4">
          <p className="text-sm font-bold text-white">Envíos (esta tienda)</p>
          <p className="mt-1 text-xs text-zinc-500">Cada feriante configura precios y plazos en el panel.</p>
          {enviosConfig.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {enviosConfig
                .filter((e) => e.activo)
                .map((e) => (
                  <li key={e.metodo} className="flex flex-wrap items-baseline justify-between gap-2">
                    <span>
                      {envioLabels[e.metodo] ?? e.metodo}
                      {e.descripcion ? <span className="text-zinc-500"> — {e.descripcion}</span> : null}
                    </span>
                    <span className="font-bold text-white">
                      {e.precio <= 0 ? "Gratis" : `$${e.precio.toLocaleString("es-AR")}`}
                      {e.tiempo_entrega ? <span className="pl-1 text-xs font-normal text-zinc-500">({e.tiempo_entrega})</span> : null}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
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
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111] p-4">
          <p className="text-sm font-bold text-white">Reseñas</p>
          {resenasIn.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              {resenasIn.map((r) => (
                <li key={r.id} className="border-b border-zinc-800 pb-2">
                  <span className="text-amber-400">{"★".repeat(r.estrellas)}</span> <strong>{r.nombre}</strong>
                  {r.comentario && <p className="mt-1 text-zinc-400">{r.comentario}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-zinc-500">Todavía no hay reseñas aprobadas.</p>
          )}
          <p className="mb-1 mt-3 text-xs text-zinc-500">Dejá tu opinión (queda en moderación):</p>
          <form
            className="mt-1 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setRmsg(null);
              const res = await fetch("/api/resenas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  producto_id: productoId,
                  nombre: rnombre,
                  comentario: rcom,
                  estrellas: rest,
                }),
              });
              if (!res.ok) {
                setRmsg("No se pudo enviar. ¿Ejecutaste el SQL fase 2?");
                return;
              }
              setRmsg("Enviada. Un moderador la revisará pronto.");
              setRnombre("");
              setRcom("");
            }}
          >
            <input
              required
              value={rnombre}
              onChange={(e) => setRnombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            />
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <span>Estrellas</span>
              <input type="number" min={1} max={5} value={rest} onChange={(e) => setRest(parseInt(e.target.value, 10) || 5)} className="w-16 rounded border border-zinc-700 bg-black px-1" />
            </div>
            <textarea
              value={rcom}
              onChange={(e) => setRcom(e.target.value)}
              rows={2}
              placeholder="Comentario (opcional)"
              className="w-full rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            />
            <button type="submit" className="rounded bg-orange-500 px-3 py-1 text-sm font-bold text-black">
              Enviar
            </button>
            {rmsg && <p className="text-xs text-emerald-400">{rmsg}</p>}
          </form>
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
      {showGuia && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-lg font-bold text-white">Guía de talles</p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              <li>XS: contorno pecho 80-84 cm</li>
              <li>S: contorno pecho 85-89 cm</li>
              <li>M: contorno pecho 90-96 cm</li>
              <li>L: contorno pecho 97-103 cm</li>
              <li>XL: contorno pecho 104-112 cm</li>
            </ul>
            <button type="button" onClick={() => setShowGuia(false)} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-black">
              Cerrar
            </button>
          </div>
        </div>
      )}
      {(relacionadosMismaTienda?.length || similares?.length) ? (
        <div className="md:col-span-2 space-y-7 border-t border-zinc-800 pt-5">
          {relacionadosMismaTienda?.length ? (
            <section>
              <h3 className="text-xl font-black text-white">De la misma tienda</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {relacionadosMismaTienda.map((p) => (
                  <Link key={p.id} href={`/${p.tiendas?.slug ?? t.slug}/producto/${p.id}`} className="rounded-xl border border-zinc-800 p-3 hover:border-orange-500">
                    <p className="line-clamp-1 text-sm font-semibold text-white">{p.nombre}</p>
                    <p className="text-xs text-zinc-500">${Number(p.precio).toLocaleString("es-AR")}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {similares?.length ? (
            <section>
              <h3 className="text-xl font-black text-white">También te puede gustar</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {similares.map((p) => (
                  <Link key={p.id} href={`/${p.tiendas?.slug ?? t.slug}/producto/${p.id}`} className="rounded-xl border border-zinc-800 p-3 hover:border-orange-500">
                    <p className="line-clamp-1 text-sm font-semibold text-white">{p.nombre}</p>
                    <p className="text-xs text-zinc-500">${Number(p.precio).toLocaleString("es-AR")}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
