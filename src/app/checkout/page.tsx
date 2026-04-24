"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const { lines, grandTotal, costoEnvio, descuento } = useCartStore();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pagar() {
    if (!lines.length) return;
    setMsg(null);
    setLoading(true);
    try {
      const items = lines.map((l) => ({
        producto_id: l.producto.id,
        nombre: l.producto.nombre,
        cantidad: l.cantidad,
        precio_unit: Number(l.producto.precio),
        tienda_id: l.producto.tienda_id,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, comprador_email: email || null }),
      });
      const j = (await res.json()) as { init_point?: string; error?: string };
      if (!res.ok) {
        setMsg(j.error ?? "No pudimos iniciar el pago");
        return;
      }
      if (!j.init_point) {
        setMsg("No se recibió URL de pago");
        return;
      }
      window.location.href = j.init_point;
    } catch (e) {
      const m = e instanceof Error ? e.message : "Error de red";
      setMsg(m);
    } finally {
      setLoading(false);
    }
  }

  if (!lines.length) {
    return (
      <main className="container-shell py-10">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Tu checkout está vacío</h1>
          <p className="mt-2 text-[#555555]">Agregá productos para continuar con el pago seguro por Mercado Pago.</p>
          <Link href="/" className="mt-5 inline-block rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white">
            Ver productos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container-shell py-8">
      <h1 className="text-3xl font-black text-[#1A1A1A]">Checkout</h1>
      <p className="mt-1 text-[#555555]">Confirmá tus datos y continuá al pago.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-4">
          <p className="text-sm font-bold text-[#1A1A1A]">Resumen de compra</p>
          <ul className="mt-3 space-y-2">
            {lines.map((l) => (
              <li key={l.lineId} className="flex items-center justify-between text-sm">
                <span className="text-[#555555]">
                  {l.producto.nombre} x{l.cantidad}
                </span>
                <span className="font-semibold text-[#1A1A1A]">
                  ${(Number(l.producto.precio) * l.cantidad).toLocaleString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#E0E0E0] pt-3 text-sm text-[#555555]">
            <p>Envío: ${costoEnvio.toLocaleString("es-AR")}</p>
            <p>Descuento: -${descuento.toLocaleString("es-AR")}</p>
            <p className="mt-1 text-lg font-black text-[#1A1A1A]">Total: ${grandTotal().toLocaleString("es-AR")}</p>
          </div>
        </section>
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-4">
          <label className="block text-sm font-medium text-[#1A1A1A]">
            Email para el comprobante (opcional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1 w-full rounded-lg border border-[#E0E0E0] px-3 py-2"
            />
          </label>
          {msg && <p className="mt-3 text-sm text-amber-700">{msg}</p>}
          <button
            type="button"
            onClick={() => void pagar()}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#F97316] px-4 py-3 font-bold text-white hover:bg-[#EA6C0A] disabled:opacity-60"
          >
            {loading ? "Iniciando pago..." : "Pagar con Mercado Pago"}
          </button>
          <p className="mt-2 text-xs text-[#555555]">
            Si Mercado Pago no está configurado, vas a ver un mensaje claro con el motivo.
          </p>
        </section>
      </div>
    </main>
  );
}

