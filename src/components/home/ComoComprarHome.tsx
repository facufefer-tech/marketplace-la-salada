const pasos = [
  { t: "Buscá y filtrá", d: "Encontrá categoría, precio, talle y color en segundos." },
  { t: "Entrá al producto", d: "Mirá fotos, medidas y elegí variantes." },
  { t: "Agregá al carrito", d: "Sumá unidades y revisá el total." },
  { t: "Pagá con Mercado Pago", d: "Checkout seguro; el feriante prepara el envío." },
];

export function ComoComprarHome() {
  return (
    <section className="container-shell py-10">
      <h2 className="text-center text-2xl font-black text-white md:text-3xl">Cómo comprar</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map((p, i) => (
          <div
            key={p.t}
            className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 text-center transition hover:border-orange-500/50"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-black">
              {i + 1}
            </div>
            <h3 className="mt-3 font-bold text-white">{p.t}</h3>
            <p className="mt-2 text-sm text-zinc-400">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
