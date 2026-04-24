"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const METODOS: { id: string; label: string }[] = [
  { id: "retiro", label: "Retiro en puesto" },
  { id: "propio_feriante", label: "Envío propio" },
  { id: "correo_argentino", label: "Correo Argentino" },
  { id: "oca", label: "OCA" },
  { id: "andreani", label: "Andreani" },
  { id: "mercadoenvios", label: "MercadoEnvíos" },
];

export default function CarritoPage() {
  const { lines, remove, setQty, total, grandTotal, metodoEnvio, costoEnvio, setEnvio, descuento, cuponCodigo, setCupon, clearCupon, clear } =
    useCartStore();
  const [msg, setMsg] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [envList, setEnvList] = useState<{ metodo: string; precio: number; activo: boolean; tiempo_entrega: string | null }[]>([]);
  const tiendaId = lines[0]?.producto.tienda_id;
  const sub = total();

  useEffect(() => {
    if (!tiendaId) {
      setEnvList([]);
      return;
    }
    void (async () => {
      const res = await fetch(`/api/public/envios?tienda_id=${encodeURIComponent(tiendaId)}`);
      const j = (await res.json()) as { data: typeof envList };
      setEnvList(j.data ?? []);
    })();
  }, [tiendaId]);

  const envOptions = useMemo(() => {
    if (envList.length) {
      return envList.filter((e) => e.activo);
    }
    return METODOS.map((m) => ({ metodo: m.id, precio: 0, activo: true, tiempo_entrega: null as string | null }));
  }, [envList]);

  useEffect(() => {
    if (!envList.length) return;
    const cur = envList.find((e) => e.metodo === metodoEnvio) || envList.find((e) => e.activo) || envList[0];
    if (cur) setEnvio(cur.metodo, cur.precio);
  }, [envList, metodoEnvio, setEnvio]);

  async function applyCoupon() {
    if (!code.trim() || !tiendaId) return;
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: code, tienda_id: tiendaId, subtotal: sub }),
    });
    const j = (await res.json()) as { ok?: boolean; descuento?: number; mensaje?: string };
    if (j.ok && j.descuento != null) {
      setCupon(code.trim().toLowerCase(), j.descuento);
    } else {
      setMsg(j.mensaje ?? "Código no válido");
    }
  }

  return (
    <main className="container-shell min-h-[70vh] py-8">
      <h1 className="text-3xl font-black text-white">Carrito</h1>
      <p className="mt-1 text-sm text-zinc-500">Revisá productos, envío y cupones.</p>

      {lines.length === 0 ? (
        <p className="mt-8 text-zinc-500">
          No hay productos.{" "}
          <Link href="/" className="text-orange-400 hover:underline">
            Ir a comprar
          </Link>
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          <ul className="space-y-4">
            {lines.map((line) => {
              const img = line.producto.fotos?.[0];
              return (
                <li
                  key={line.lineId}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#111] p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:h-24 sm:w-24">
                    {img ? (
                      <Image src={img} alt="" fill className="object-cover" sizes="120px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-600">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">{line.producto.nombre}</p>
                    {(line.talle !== "Único" || line.color !== "Único") && (
                      <p className="text-sm text-zinc-500">
                        {line.talle !== "Único" && <span>Talle {line.talle}</span>}
                        {line.talle !== "Único" && line.color !== "Único" && " · "}
                        {line.color !== "Único" && <span>{line.color}</span>}
                      </p>
                    )}
                    {line.producto.tiendas?.slug && (
                      <Link href={`/${line.producto.tiendas.slug}`} className="text-sm text-orange-400 hover:underline">
                        {line.producto.tiendas.nombre}
                      </Link>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={line.producto.stock}
                        value={line.cantidad}
                        onChange={(e) => setQty(line.lineId, parseInt(e.target.value, 10) || 1)}
                        className="w-20 rounded-lg border border-zinc-700 bg-black px-2 py-1 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => remove(line.lineId)}
                        className="text-sm text-rose-400 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-black text-white sm:text-right">
                    ${(Number(line.producto.precio) * line.cantidad).toLocaleString("es-AR")}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
            <p className="text-sm font-bold text-white">Método de envío (misma tienda)</p>
            <div className="mt-2 space-y-1">
              {envOptions.map((e) => (
                <label key={e.metodo} className="flex cursor-pointer items-center justify-between gap-2 rounded border border-zinc-800 px-2 py-1.5 text-sm text-zinc-200">
                  <input
                    type="radio"
                    name="env"
                    checked={metodoEnvio === e.metodo}
                    onChange={() => setEnvio(e.metodo, e.precio)}
                    className="mr-1"
                  />
                  <span className="flex-1">
                    {METODOS.find((m) => m.id === e.metodo)?.label ?? e.metodo}
                    {e.tiempo_entrega ? <span className="text-zinc-500"> — {e.tiempo_entrega}</span> : null}
                  </span>
                  <span className="font-mono text-orange-300">
                    {e.precio <= 0 ? "Gratis" : `+$${e.precio.toLocaleString("es-AR")}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
            <p className="text-sm font-bold text-white">Código de descuento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-w-[180px] flex-1 rounded border border-zinc-700 bg-black px-2 py-1.5 text-sm"
                placeholder="Código"
              />
              <button
                type="button"
                onClick={() => void applyCoupon()}
                className="rounded bg-zinc-700 px-3 py-1.5 text-sm text-white"
              >
                Aplicar
              </button>
              {cuponCodigo && (
                <button type="button" onClick={() => clearCupon()} className="text-xs text-zinc-500 underline">
                  Quitar cupón
                </button>
              )}
            </div>
            {msg && <p className="mt-1 text-xs text-amber-300">{msg}</p>}
            {descuento > 0 && <p className="mt-1 text-sm text-emerald-400">Descuento: -${descuento.toLocaleString("es-AR")}</p>}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-400">
              <p>Subtotal: ${sub.toLocaleString("es-AR")}</p>
              <p>Envío: {costoEnvio <= 0 ? "Gratis" : `$${costoEnvio.toLocaleString("es-AR")}`}</p>
            </div>
            <p className="text-lg text-zinc-300">
              Total: <span className="text-2xl font-black text-white">${grandTotal().toLocaleString("es-AR")}</span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setMsg("Próximamente: conectá tu Mercado Pago en el panel para recibir pagos reales en la demo.");
                }}
                className="rounded-2xl bg-orange-500 px-6 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400"
              >
                Ir a pagar
              </button>
              <button
                type="button"
                onClick={() => clear()}
                className="rounded-2xl border border-zinc-600 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-800"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
