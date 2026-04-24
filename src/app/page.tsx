import { Suspense } from "react";
import { HeroBanner } from "@/components/marketing/HeroBanner";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { CountdownTimer } from "@/components/marketing/CountdownTimer";
import { StoreCard } from "@/components/marketing/StoreCard";
import { FeriantesSection } from "@/components/marketing/FeriantesSection";
import { CustomerProof } from "@/components/marketing/CustomerProof";
import { ComoComprarHome } from "@/components/home/ComoComprarHome";
import { PorQueHome } from "@/components/home/PorQueHome";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import { demoProducts, demoStores } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="space-y-0 bg-[#0a0a0a] pb-10">
      <div className="container-shell pt-6">
        <HeroBanner />
      </div>
      <div className="container-shell">
        <CategoryGrid />
      </div>
      <div className="container-shell">
        <CountdownTimer />
      </div>
      <ComoComprarHome />
      <PorQueHome />
      <Suspense
        fallback={
          <div className="container-shell py-12 text-center text-zinc-500">Cargando catálogo…</div>
        }
      >
        <HomeCatalog />
      </Suspense>
      <section className="container-shell pt-8">
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
