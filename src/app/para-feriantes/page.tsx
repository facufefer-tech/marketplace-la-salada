"use client";

import Link from "next/link";
import { useState } from "react";

const pasos = [
  { t: "Registrate gratis", d: "Creá tu cuenta y tu vitrina con un solo paso." },
  { t: "Subí tu catálogo", d: "Fotos en Cloudinary, precios y stock desde el panel." },
  { t: "Conectá cobros", d: "Mercado Pago para que el dinero entre a tu cuenta." },
  { t: "Vendé sin alquiler web", d: "Compartís tu link y cobrás como en feria, pero online." },
];

const features = [
  "Tu propia URL /tu-tienda",
  "Panel con productos, pedidos y estadísticas",
  "Comisión solo cuando vendés (5% orientativo)",
  "Carrito unificado para tus clientes",
  "Soporte por WhatsApp",
];

const faq = [
  {
    q: "¿Pago algo por adelantado?",
    a: "No. El modelo demo es comisión sobre venta: no hay suscripción ni costo fijo de vitrina.",
  },
  {
    q: "¿Necesito local físico?",
    a: "Podés coordinar retiro en puesto o solo envíos, según cómo trabajes hoy.",
  },
  {
    q: "¿Cómo cobro?",
    a: "Conectando Mercado Pago en el panel; La Salada aplica la comisión acordada en cada venta.",
  },
];

const testimonials = [
  {
    n: "Mariela T.",
    l: "Kids Trend, Lomas",
    x: "En una semana cargué remeras y pantalones; compartí el link por Instagram y cerré ventas sin depender solo del puesto.",
  },
  {
    n: "Kevin B.",
    l: "UrbanStyle BA",
    x: "El panel es simple: subo foto, precio y listo. Los clientes filtran solos y me escriben por WhatsApp.",
  },
  {
    n: "Lucía P.",
    l: "BaseLab",
    x: "Probé la demo con clientes reales: el carrito suma todo y el total se entiende al toque.",
  },
];

const wa = "https://wa.me/5491155559876";

export default function ParaFeriantesPage() {
  const [ventas, setVentas] = useState(300000);
  const comision = 0.05;
  const neto = Math.round(ventas * (1 - comision));

  return (
    <main className="relative overflow-hidden bg-[#0a0a0a] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.15),transparent_50%)]" />

      <section className="container-shell relative py-16 md:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Marketplace La Salada</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
          Vendé tu ropa online <span className="text-orange-500">sin pagar nada hasta vender</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Tienda propia, carrito profesional y cobros con Mercado Pago. Solo participás con una comisión cuando
          concretás la venta.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/ser-socio"
            className="rounded-2xl bg-orange-500 px-8 py-4 text-center text-base font-black text-black shadow-lg shadow-orange-500/30 transition hover:scale-[1.02] hover:bg-orange-400"
          >
            Quiero mi tienda gratis
          </Link>
          <Link
            href="/auth"
            className="rounded-2xl border border-zinc-600 px-8 py-4 text-center text-base font-bold text-white hover:border-orange-500/50 hover:bg-zinc-900"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <section className="container-shell border-t border-zinc-800 py-16">
        <h2 className="text-center text-3xl font-black text-white md:text-4xl">Cómo funciona</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((p, i) => (
            <div
              key={p.t}
              className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-[#0d0d0d] p-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black text-black">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{p.t}</h3>
              <p className="mt-2 text-sm text-zinc-400">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell border-t border-zinc-800 py-16">
        <h2 className="text-center text-3xl font-black text-white md:text-4xl">Cuánto ganás</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-zinc-400">
          Ajustá un monto de ventas mensuales estimado. Mostramos cuánto te queda después del 5% de comisión
          (referencia demo).
        </p>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-zinc-800 bg-[#111] p-6 shadow-xl">
          <label className="block text-sm font-semibold text-zinc-300">
            Ventas mensuales estimadas (ARS)
            <input
              type="range"
              min={50000}
              max={5000000}
              step={50000}
              value={ventas}
              onChange={(e) => setVentas(Number(e.target.value))}
              className="mt-3 w-full accent-orange-500"
            />
          </label>
          <p className="mt-4 text-center text-3xl font-black text-white">${ventas.toLocaleString("es-AR")}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl bg-zinc-900/80 p-4">
              <p className="text-xs uppercase text-zinc-500">Comisión 5%</p>
              <p className="text-lg font-bold text-rose-400">-${Math.round(ventas * comision).toLocaleString("es-AR")}</p>
            </div>
            <div className="rounded-xl bg-orange-500/10 p-4">
              <p className="text-xs uppercase text-zinc-500">Te queda</p>
              <p className="text-lg font-black text-orange-400">${neto.toLocaleString("es-AR")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell border-t border-zinc-800 py-16">
        <h2 className="text-center text-3xl font-black text-white">Lo que incluye tu tienda</h2>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-zinc-200">
              <span className="text-orange-400">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-shell border-t border-zinc-800 py-16">
        <h2 className="text-center text-3xl font-black text-white">Feriantes que ya prueban La Salada</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.n}
              className="rounded-2xl border border-zinc-800 bg-[#111] p-6 transition hover:border-orange-500/40"
            >
              <p className="text-sm leading-relaxed text-zinc-300">&ldquo;{t.x}&rdquo;</p>
              <footer className="mt-4 text-sm font-bold text-white">{t.n}</footer>
              <cite className="text-xs not-italic text-zinc-500">{t.l}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container-shell border-t border-zinc-800 py-16">
        <h2 className="text-center text-3xl font-black text-white">Preguntas frecuentes</h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-zinc-800 bg-[#111] open:border-orange-500/30"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="float-right text-orange-400 group-open:rotate-180">▼</span>
              </summary>
              <p className="border-t border-zinc-800 px-5 pb-4 pt-0 text-sm leading-relaxed text-zinc-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 text-center">
        <h2 className="text-3xl font-black text-white md:text-4xl">¿Listo para tu vitrina?</h2>
        <Link
          href="/ser-socio"
          className="mt-8 inline-block rounded-2xl bg-orange-500 px-10 py-5 text-lg font-black text-black transition hover:bg-orange-400"
        >
          Quiero mi tienda gratis
        </Link>
      </section>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-black text-black shadow-lg shadow-emerald-500/30 transition hover:scale-105 md:bottom-8 md:right-8"
      >
        <span className="text-lg">💬</span> +54 9 11 5555-9876
      </a>
    </main>
  );
}
