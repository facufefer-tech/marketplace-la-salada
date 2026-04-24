"use client";

import { useEffect, useState } from "react";

const slides = [
  { title: "Hasta 60% OFF en moda", text: "Miles de prendas renovadas todas las semanas.", cta: "Ver ofertas" },
  { title: "Nuevas colecciones de verano", text: "Vestidos, shorts y looks frescos para esta temporada.", cta: "Explorar verano" },
  { title: "Envíos a todo el país", text: "Comprá seguro y recibí en tu casa o retirás en el puesto.", cta: "Cómo comprar" },
];

export function HeroBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);
  const slide = slides[idx];
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-orange-600 p-6 text-white sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Temporada La Salada</p>
      <h1 className="mt-2 max-w-xl text-3xl font-black leading-tight sm:text-5xl">{slide.title}</h1>
      <p className="mt-3 max-w-lg text-sm text-zinc-100 sm:text-base">{slide.text}</p>
      <button className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-900">{slide.cta}</button>
      <div className="mt-5 flex gap-2">
        {slides.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
