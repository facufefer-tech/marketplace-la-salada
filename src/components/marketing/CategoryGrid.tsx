"use client";

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
      <h2 className="mb-4 text-2xl font-extrabold text-zinc-900">Categorías populares</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(([emoji, label]) => (
          <button key={label} className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm hover:border-orange-300 hover:shadow-md">
            <p className="text-3xl">{emoji}</p>
            <p className="mt-2 text-sm font-bold text-zinc-800">{label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
