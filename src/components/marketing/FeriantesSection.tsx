import Link from "next/link";
import { demoProducts, demoStores } from "@/lib/demo-data";

export function FeriantesSection() {
  return (
    <section className="container-shell">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Comunidad real</p>
          <h2 className="text-3xl font-black text-white">Feriantes que ya están vendiendo</h2>
        </div>
        <Link href="/feriantes" className="rounded-xl border border-zinc-700 bg-[#111111] px-4 py-2 text-sm font-bold text-white hover:border-orange-500">
          Ver los 15 feriantes
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoStores.slice(0, 6).map((s) => {
          const count = demoProducts.filter((p) => p.tienda_id === s.id).length;
          return (
            <article key={s.id} className="overflow-hidden rounded-2xl border border-zinc-700 bg-[#111111]">
              <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${s.bannerUrl})` }} />
              <div className="p-4">
                <p className="text-lg font-black text-white">{s.nombre}</p>
                <p className="text-xs text-zinc-300">Dueño: {s.owner} · ⭐ {s.rating.toFixed(1)}</p>
                <p className="mt-2 text-sm text-zinc-400">{s.descripcion}</p>
                <p className="mt-2 text-xs text-zinc-500">{count} productos · {s.ventasMes} ventas este mes</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
