"use client";
import { useState } from "react";

const faqs = [
  ["¿Cuánto tarda el envío?", "Depende del correo y tu provincia. En general entre 2 y 7 días hábiles."],
  ["¿Puedo retirar en el puesto?", "Sí, muchos feriantes ofrecen retiro por puesto y coordinación por WhatsApp."],
  ["¿Qué medios de pago aceptan?", "Tarjetas, saldo en cuenta, débito y transferencias a través de Mercado Pago."],
];

export default function ComoComprarPage() {
  const [open, setOpen] = useState(0);
  const pasos = [
    "Explorá los productos y usá los filtros",
    "Elegí tu talle y color",
    "Agregá al carrito",
    "Pagá con MercadoPago de forma segura",
    "Recibí en tu domicilio o retirá en el puesto",
  ];
  return (
    <main className="container-shell space-y-10 py-10 text-zinc-100">
      <h1 className="text-5xl font-black">Cómo comprar</h1>
      <section className="grid gap-4 md:grid-cols-5">
        {pasos.map((p, i) => (
          <div key={p} className="rounded-2xl border border-zinc-700 bg-[#111111] p-4 shadow-sm">
            <p className="text-4xl">{"🛍️📏🛒💳📦"[i] ?? "✅"}</p>
            <p className="mt-2 text-sm font-black text-white">{i + 1}. {p}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-3xl font-black">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-2">
          {faqs.map(([q, a], i) => (
            <button key={q} onClick={() => setOpen(i)} className="block w-full rounded-xl border border-zinc-700 bg-[#111111] p-4 text-left">
              <p className="font-black">{q}</p>
              {open === i && <p className="mt-2 text-sm text-zinc-300">{a}</p>}
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-zinc-700 bg-[#111111] p-4">
        <h2 className="text-3xl font-black">Medios de pago aceptados</h2>
        <p className="mt-2 text-zinc-300">Mercado Pago: tarjetas de crédito y débito, saldo en cuenta, pago en efectivo y transferencias.</p>
      </section>
    </main>
  );
}
