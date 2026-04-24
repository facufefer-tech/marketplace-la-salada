import { HeroBanner } from "@/components/marketing/HeroBanner";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { CountdownTimer } from "@/components/marketing/CountdownTimer";
import { StoreCard } from "@/components/marketing/StoreCard";
import { FeriantesSection } from "@/components/marketing/FeriantesSection";
import { CustomerProof } from "@/components/marketing/CustomerProof";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts, demoStores } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: { categoria?: string; descuento?: string; q?: string };
};

function normalizeCategoriaParam(raw: string | undefined) {
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw).trim() || undefined;
  } catch {
    return raw.trim() || undefined;
  }
}

export default function HomePage({ searchParams }: HomeProps) {
  const categoria = normalizeCategoriaParam(searchParams?.categoria);
  const qRaw = searchParams?.q?.trim() ?? "";
  const q = qRaw.toLowerCase();
  const soloOfertas = searchParams?.descuento === "1";

  const products = demoProducts.filter((p) => {
    if (categoria && p.categoria !== categoria) return false;
    if (soloOfertas && (!p.descuentoPct || p.descuentoPct < 25)) return false;
    if (q && !`${p.nombre} ${p.descripcion} ${p.marca ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });
  return (
    <main className="space-y-8 bg-[#0a0a0a] pb-10">
      <div className="container-shell pt-6">
        <HeroBanner />
      </div>
      <div className="container-shell">
        <CategoryGrid />
      </div>
      <div className="container-shell">
        <CountdownTimer />
      </div>
      <section className="container-shell">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Hot sale</p>
            <h2 className="text-3xl font-black text-white">
              {categoria ? `Productos: ${categoria}` : soloOfertas ? "Ofertas del día" : "Productos destacados"}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 50).map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
        {!products.length && <p className="mt-4 text-sm text-zinc-400">No encontramos productos para ese filtro.</p>}
      </section>
      <section className="container-shell">
        <h2 className="mb-4 text-3xl font-black text-white">Tiendas destacadas</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {demoStores.map((store) => (
            <StoreCard key={store.id} store={store} count={demoProducts.filter((p) => p.tienda_id === store.id).length} />
          ))}
        </div>
      </section>
      <FeriantesSection />
      <CustomerProof />
    </main>
  );
}
