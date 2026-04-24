"use client";

import Link from "next/link";

const categories = [
  ["👕", "Remeras"],
  ["👖", "Pantalones"],
  ["👗", "Vestidos"],
  ["👟", "Calzado"],
  ["🧢", "Accesorios"],
  ["🔥", "Ofertas"],
  ["🏪", "Feriantes"],
];

export function CategoryGrid() {
  return (
    <section>
      <h2 className="mb-4 text-3xl font-black text-[#1A1A1A]">Categorías populares</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(([emoji, label]) => (
          <Link
            key={label}
            href={label === "Ofertas" ? "/?descuento=1" : label === "Feriantes" ? "/feriantes" : `/?categoria=${encodeURIComponent(label)}`}
            className="rounded-2xl border border-[#E0E0E0] bg-white p-5 text-center shadow-sm hover:border-[#F97316] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <p className="text-4xl">{emoji}</p>
            <p className="mt-2 text-base font-extrabold text-[#1A1A1A]">{label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
