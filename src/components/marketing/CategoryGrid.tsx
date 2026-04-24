"use client";

import Link from "next/link";

const categories = [
  ["👕", "Remeras"],
  ["👖", "Pantalones"],
  ["👗", "Vestidos"],
  ["👟", "Calzado"],
  ["👜", "Accesorios"],
  ["🔥", "Ofertas"],
];

export function CategoryGrid() {
  return (
    <section>
      <h2 className="mb-4 text-3xl font-black text-white">Categorías populares</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(([emoji, label]) => (
          <Link
            key={label}
            href={label === "Ofertas" ? "/?descuento=1" : `/?categoria=${encodeURIComponent(label)}`}
            className="rounded-2xl border border-zinc-700 bg-[#111111] p-5 text-center shadow-sm hover:border-orange-500 hover:shadow-[0_0_0_1px_#f97316]"
          >
            <p className="text-4xl">{emoji}</p>
            <p className="mt-2 text-base font-extrabold text-zinc-100">{label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
