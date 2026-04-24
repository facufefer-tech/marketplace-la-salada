import { Suspense } from "react";
import { ProductFilters } from "@/components/home/ProductFilters";
import { HomeCatalog } from "@/components/home/HomeCatalog";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <section className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Marketplace <span className="text-accent">La Salada</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Encontrá productos de feriantes. Destacados primero, filtros por categoría, precio, talle, color y tienda.
        </p>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Suspense
          fallback={<div className="h-64 w-full animate-pulse rounded-xl bg-zinc-900 lg:w-64" />}
        >
          <div className="w-full shrink-0 lg:w-64">
            <ProductFilters />
          </div>
        </Suspense>
        <div className="min-w-0 flex-1">
          <Suspense
            fallback={<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-zinc-900" />
            ))}</div>}
          >
            <HomeCatalog />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
