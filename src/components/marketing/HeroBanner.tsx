"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Hasta 60% OFF en moda",
    text: "Miles de prendas renovadas todas las semanas.",
    cta: "Ver ofertas",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Nuevas colecciones de verano",
    text: "Vestidos, shorts y looks frescos para esta temporada.",
    cta: "Explorar verano",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Envíos a todo el país",
    text: "Comprá seguro y recibí en tu casa o retirás en el puesto.",
    cta: "Cómo comprar",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HeroBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);
  const slide = slides[idx];
  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-r from-black via-zinc-900 to-orange-600 p-6 text-white sm:p-10">
      <div className="grid items-center gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Temporada La Salada</p>
          <h1 className="mt-2 max-w-xl text-4xl font-black leading-tight sm:text-6xl">{slide.title}</h1>
          <p className="mt-3 max-w-lg text-sm text-zinc-100 sm:text-base">{slide.text}</p>
          <button className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-black text-white hover:bg-orange-600">{slide.cta}</button>
          <div className="mt-5 flex gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/50"}`} />
            ))}
          </div>
        </div>
        <div className="relative h-64 overflow-hidden rounded-xl border border-white/20 bg-black/30 sm:h-72">
          <Image src={slide.image} alt={slide.title} fill className="object-contain" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
      </div>
    </section>
  );
}
