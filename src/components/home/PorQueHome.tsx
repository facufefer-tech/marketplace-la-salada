const items = [
  { t: "Precios de feria", d: "Directo de puesteros y marcas, sin sobreprecios de retail tradicional." },
  { t: "Un solo carrito", d: "Comprás a varios feriantes con la misma experiencia de checkout." },
  { t: "Hecho para Argentina", d: "Envíos y coordinación pensados para el conurbano y todo el país." },
];

export function PorQueHome() {
  return (
    <section className="container-shell border-t border-zinc-800 py-10">
      <h2 className="text-center text-2xl font-black text-white md:text-3xl">Por qué La Salada</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((p) => (
          <div key={p.t} className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-[#0a0a0a] p-6">
            <h3 className="text-lg font-bold text-orange-400">{p.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
