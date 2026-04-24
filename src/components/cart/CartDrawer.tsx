"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

type Props = { open: boolean; onClose: () => void };

export function CartDrawer({ open, onClose }: Props) {
  const { lines, remove, setQty, clear, total } = useCartStore();
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
            nombre: l.producto.nombre,
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal>
      <button type="button" className="h-full flex-1 cursor-default" aria-label="Cerrar" onClick={onClose} />
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-zinc-200 bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Carrito</h2>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-900">
            Cerrar
          </button>
        </div>
        {!lines.length ? (
          <p className="text-sm text-zinc-600">Todavía no agregaste productos.</p>
        ) : (
          <ul className="space-y-4">
            {lines.map(({ producto, cantidad }) => {
              const img = producto.fotos?.[0];
              return (
                <li key={producto.id} className="flex gap-3 border-b border-zinc-200 pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    {img ? (
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">Sin foto</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{producto.nombre}</p>
                    {producto.tiendas?.slug && (
                      <Link
                        href={`/${producto.tiendas.slug}`}
                        className="text-xs text-accent hover:underline"
                        onClick={onClose}
                      >
                        {producto.tiendas.nombre}
                      </Link>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={producto.stock}
                        value={cantidad}
                        onChange={(e) => setQty(producto.id, parseInt(e.target.value, 10) || 1)}
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(producto.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-zinc-900">
                    ${(Number(producto.precio) * cantidad).toLocaleString("es-AR")}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="mt-6 space-y-3 border-t border-zinc-200 pt-4">
            <label className="block text-xs text-zinc-600">
              Email (opcional, para el comprobante)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </label>
            <p className="text-sm text-zinc-700">
              Total: <span className="font-semibold text-zinc-900">${total().toLocaleString("es-AR")}</span>
            </p>
            <p className="text-xs text-zinc-500">
              Comisión marketplace ~5% (split Mercado Pago). Una tienda por compra.
            </p>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={checkout}
                disabled={loading}
                className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-black hover:bg-orange-400 disabled:opacity-50"
              >
                {loading ? "Procesando…" : "Pagar con Mercado Pago"}
              </button>
              <button
                type="button"
                onClick={() => clear()}
                className="rounded-lg border border-zinc-700 px-3 text-sm text-zinc-400 hover:bg-zinc-900"
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
