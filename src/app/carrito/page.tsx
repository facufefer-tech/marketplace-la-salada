"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CarritoPage() {
  const { lines, remove, setQty, total, clear } = useCartStore();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <main className="container-shell min-h-[70vh] py-8">
      <h1 className="text-3xl font-black text-white">Carrito</h1>
      <p className="mt-1 text-sm text-zinc-500">Revisá productos, talles y totales.</p>

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

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#111] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg text-zinc-300">
              Total: <span className="text-2xl font-black text-white">${total().toLocaleString("es-AR")}</span>
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
          {msg && <p className="text-center text-sm text-amber-300">{msg}</p>}
        </div>
      )}
    </main>
  );
}
