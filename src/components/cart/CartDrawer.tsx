"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

type Props = { open: boolean; onClose: () => void };

function itemTitle(nombre: string, talle: string, color: string) {
  const parts = [nombre];
  if (talle && talle !== "Único") parts.push(`Talle ${talle}`);
  if (color && color !== "Único") parts.push(color);
  return parts.join(" · ");
}

export function CartDrawer({ open, onClose }: Props) {
  const { lines, remove, setQty, clear, total, grandTotal, costoEnvio, descuento, metodoEnvio } = useCartStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function checkout() {
    setErr(null);
    if (!lines.length) return;
    const tiendaId = lines[0].producto.tienda_id;
    if (!lines.every((l) => l.producto.tienda_id === tiendaId)) {
      setErr("Solo podés pagar una tienda por vez. Vacía el carrito o quitá otros locales.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador_email: email || undefined,
          items: lines.map((l) => ({
            producto_id: l.producto.id,
            nombre: itemTitle(l.producto.nombre, l.talle, l.color),
            cantidad: l.cantidad,
            precio_unit: l.producto.precio,
            tienda_id: l.producto.tienda_id,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "No se pudo iniciar el pago");
        return;
      }
      const url = data.init_point ?? data.sandbox_init_point;
      if (url) window.location.href = url;
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70" role="dialog" aria-modal>
      <button type="button" className="h-full flex-1 cursor-default" aria-label="Cerrar" onClick={onClose} />
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-zinc-800 bg-[#111] p-4 text-zinc-100 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Carrito</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Cerrar
          </button>
        </div>
        {!lines.length ? (
          <p className="text-sm text-zinc-500">Todavía no agregaste productos.</p>
        ) : (
          <ul className="space-y-4">
            {lines.map((line) => {
              const img = line.producto.fotos?.[0];
              return (
                <li key={line.lineId} className="flex gap-3 border-b border-zinc-800 pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                    {img ? (
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">Sin foto</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">{line.producto.nombre}</p>
                    {(line.talle !== "Único" || line.color !== "Único") && (
                      <p className="text-xs text-zinc-500">
                        {line.talle !== "Único" && <span>Talle {line.talle}</span>}
                        {line.talle !== "Único" && line.color !== "Único" && " · "}
                        {line.color !== "Único" && <span>{line.color}</span>}
                      </p>
                    )}
                    {line.producto.tiendas?.slug && (
                      <Link
                        href={`/${line.producto.tiendas.slug}`}
                        className="text-xs text-orange-400 hover:underline"
                        onClick={onClose}
                      >
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
                        className="w-16 rounded border border-zinc-700 bg-black px-2 py-1 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => remove(line.lineId)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-zinc-100">
                    ${(Number(line.producto.precio) * line.cantidad).toLocaleString("es-AR")}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
            <Link
              href="/carrito"
              onClick={onClose}
              className="mb-2 block w-full rounded-xl border border-orange-500/50 py-2.5 text-center text-sm font-bold text-orange-400 hover:bg-zinc-900"
            >
              Ir al carrito completo
            </Link>
            <label className="block text-xs text-zinc-500">
              Email (opcional, para el comprobante)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
              />
            </label>
            <p className="text-sm text-zinc-300">
              Subtotal: <span className="text-zinc-200">${total().toLocaleString("es-AR")}</span>
            </p>
            {descuento > 0 && (
              <p className="text-sm text-emerald-400">Descuento: -${descuento.toLocaleString("es-AR")}</p>
            )}
            <p className="text-xs text-zinc-500">
              Envío ({metodoEnvio}): {costoEnvio <= 0 ? "incl. gratis" : `$${costoEnvio.toLocaleString("es-AR")}`} — ajustá en /carrito
            </p>
            <p className="text-sm text-zinc-300">
              Total: <span className="font-bold text-white">${grandTotal().toLocaleString("es-AR")}</span>
            </p>
            <p className="text-xs text-zinc-500">Comisión marketplace ~5% (split Mercado Pago). Una tienda por compra.</p>
            {err && <p className="text-sm text-rose-400">{err}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={checkout}
                disabled={loading}
                className="min-w-0 flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-50"
              >
                {loading ? "Procesando…" : "Pagar con Mercado Pago"}
              </button>
              <button
                type="button"
                onClick={() => clear()}
                className="rounded-lg border border-zinc-600 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Vaciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
