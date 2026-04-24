import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demoProducts, demoStores } from "@/lib/demo-data";
import { ProductCard } from "@/components/storefront/ProductCard";

type Props = { params: { slug: string } };

export default function FerianteProfilePage({ params }: Props) {
  const feriante = demoStores.find((s) => s.slug === params.slug);
  if (!feriante) notFound();
  const products = demoProducts.filter((p) => p.tienda_id === feriante.id);

  return (
    <main className="space-y-8 pb-10">
      <section className="relative h-56 border-b border-zinc-800 bg-zinc-900">
        <Image src={feriante.bannerUrl} alt={feriante.nombre} fill className="object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/40" />
        <div className="container-shell relative z-10 flex h-full items-end gap-4 pb-6">
          <Image src={feriante.avatarUrl} alt={feriante.owner} width={84} height={84} className="rounded-full border-2 border-white/30" />
          <div>
            <p className="text-3xl font-black text-white">{feriante.nombre}</p>
            <p className="text-sm text-zinc-200">Marca: {feriante.nombre} · Responsable: {feriante.owner} · ⭐ {feriante.rating.toFixed(1)} · {feriante.ventasMes} ventas/mes</p>
            <p className="text-sm text-zinc-300">{feriante.descripcion}</p>
          </div>
        </div>
      </section>

      <section className="container-shell rounded-2xl border border-zinc-800 bg-[#111111] p-5">
        <h2 className="text-2xl font-black text-white">Kit de carga para {feriante.nombre}</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Este perfil demo muestra cómo quedaría la página real del feriante con sus marcas, catálogo y materiales de trabajo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/templates/productos-general.csv" download className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-black text-white">
            Descargar plantilla productos
          </a>
          <a href="/templates/tutorial-carga-productos.pdf" download className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-black text-zinc-200">
            Descargar tutorial paso a paso
          </a>
          <Link href="/dashboard/productos" className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-black text-zinc-200">
            Ir al panel demo
          </Link>
        </div>
      </section>

      <section className="container-shell">
        <h2 className="mb-4 text-3xl font-black text-white">Catálogo del feriante</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
