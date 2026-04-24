import Image from "next/image";
import Link from "next/link";
import { demoProducts, demoStores } from "@/lib/demo-data";

const templates = [
  { href: "/templates/productos-general.csv", label: "Plantilla general CSV" },
  { href: "/templates/productos-remeras.csv", label: "Plantilla remeras CSV" },
  { href: "/templates/productos-calzado.csv", label: "Plantilla calzado CSV" },
  { href: "/templates/tutorial-carga-productos.md", label: "Tutorial de carga (Markdown)" },
];

export default function FeriantesPage() {
  return (
    <main className="container-shell space-y-8 py-10">
      <header className="rounded-3xl border border-zinc-700 bg-[#111111] p-6">
        <h1 className="text-4xl font-black text-white">Sección Feriantes</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Demo comercial para mostrar cómo cada puesto puede tener su tienda online en minutos, cargar productos, usar fotos y vender con checkout integrado.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {templates.map((t) => (
            <a key={t.href} href={t.href} download className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white hover:bg-orange-600">
              Descargar {t.label}
            </a>
          ))}
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-3xl font-black text-white">15 feriantes ficticios (demo vinculada)</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demoStores.map((store) => {
            const prods = demoProducts.filter((p) => p.tienda_id === store.id);
            return (
              <article key={store.id} className="overflow-hidden rounded-2xl border border-zinc-700 bg-[#111111]">
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${store.bannerUrl})` }} />
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-zinc-700">
                      <Image src={store.avatarUrl} alt={store.owner} fill className="object-cover" sizes="44px" />
                    </div>
                    <div>
                      <p className="font-black text-white">{store.nombre}</p>
                      <p className="text-xs text-zinc-400">Feriante: {store.owner} · ⭐ {store.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300">{store.descripcion}</p>
                  <p className="text-xs text-zinc-500">{prods.length} productos demo · {store.ventasMes} ventas/mes</p>
                  <div className="grid grid-cols-3 gap-2">
                    {prods.slice(0, 3).map((p) => (
                      <div key={p.id} className="relative h-16 w-full overflow-hidden rounded-lg">
                        <Image src={p.fotos[0]} alt={p.nombre} fill className="object-cover" sizes="96px" />
                      </div>
                    ))}
                  </div>
                  <Link href={`/${store.slug}`} className="inline-block rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-bold text-white hover:border-orange-500">
                    Ver tienda demo
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
