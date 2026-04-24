const buyers = [
  "Sofía de Rosario", "Emiliano de Salta", "Marina de CABA", "Paula de Córdoba", "Ariel de Mendoza",
  "Carla de Neuquén", "Romina de La Plata", "Nico de Tucumán", "Majo de Mar del Plata", "Juan Cruz de San Juan",
  "Cami de Resistencia", "Pablo de Posadas", "Flor de Bahía Blanca", "Agus de Paraná", "Bruno de Ushuaia",
];

export function CustomerProof() {
  return (
    <section className="container-shell">
      <h2 className="mb-4 text-3xl font-black text-white">Clientes que ya compraron en demo</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {buyers.map((b, i) => (
          <article key={b} className="rounded-xl border border-zinc-700 bg-[#111111] p-4">
            <p className="text-sm font-bold text-white">{b}</p>
            <p className="mt-1 text-xs text-zinc-400">Compró {["remeras", "calzado", "vestidos", "abrigos", "accesorios"][i % 5]} y dejó 5 estrellas.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
