import { HeroBanner } from "@/components/marketing/HeroBanner";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { CountdownTimer } from "@/components/marketing/CountdownTimer";
import { StoreCard } from "@/components/marketing/StoreCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts, demoStores } from "@/lib/demo-data";

export default function HomePage() {
  const products = demoProducts;
  return (
    <main className="space-y-8 bg-[#FAFAFA] pb-10">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Hot sale</p>
            <h2 className="text-2xl font-extrabold text-zinc-900">Ofertas del día</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 16).map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>
      <section className="container-shell">
        <h2 className="mb-4 text-2xl font-extrabold text-zinc-900">Tiendas destacadas</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {demoStores.map((store) => (
            <StoreCard key={store.id} store={store} count={demoProducts.filter((p) => p.tienda_id === store.id).length} />
          ))}
        </div>
      </section>
    </main>
  );
}
