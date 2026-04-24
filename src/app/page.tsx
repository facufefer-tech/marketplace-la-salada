import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import { demoProducts, demoStores } from "@/lib/demo-data";

export default function HomePage() {
  const bestSellers = [...demoProducts].sort((a, b) => b.stock - a.stock).slice(0, 4);
  const nuevos = demoProducts.filter((p) => p.nuevo).slice(0, 4);
  const ofertas = [...demoProducts].sort((a, b) => b.descuentoPct - a.descuentoPct).slice(0, 4);

  return (
    <main className="space-y-10 bg-[#0a0a0a] pb-10">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=80"
          alt="Moda argentina"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
        <div className="container-shell relative z-10 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-400">Marketplace oficial</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
            Moda mayorista y minorista con estilo profesional.
          </h1>
          <p className="mt-4 max-w-xl text-zinc-200 md:text-lg">
            Descubrí tiendas reales de La Salada, comprá en segundos y vendé en todo el país.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/?focus=search" className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400">
              Comprar ahora
            </Link>
            <Link href="/para-feriantes" className="rounded-xl border border-zinc-300/40 px-6 py-3 font-bold text-white hover:border-white">
              Quiero vender
            </Link>
          </div>
        </div>
      </section>

      <div className="container-shell">
        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">Marcas destacadas</p>
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin">
            {[...demoStores, ...demoStores].map((s, i) => (
              <Link
                key={`${s.id}-${i}`}
                href={`/${s.slug}`}
                className="fade-in inline-flex min-w-max items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:border-orange-500"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-black text-orange-400">
                  {s.nombre.slice(0, 1)}
                </span>
                {s.nombre}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="container-shell grid gap-5 md:grid-cols-3">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Lo más vendido esta semana</h2>
            <Link href="/" className="text-sm text-orange-400 hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {bestSellers.map((p) => (
              <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-zinc-800 p-3 hover:border-orange-500/60">
                <p className="line-clamp-1 text-sm font-bold text-white">{p.nombre}</p>
                <p className="text-xs text-zinc-500">{p.marca}</p>
                <p className="mt-2 text-lg font-black text-orange-400">${p.precio.toLocaleString("es-AR")}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-rose-500/20 to-zinc-950 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">Ofertas que terminan hoy</p>
          <p className="mt-3 text-3xl font-black text-white">23:59:59</p>
          <p className="mt-2 text-sm text-zinc-300">Aprovechá descuentos de hasta 60% en tiendas seleccionadas.</p>
          <Link href="/?descuento=1" className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-black text-black">
            Ver ofertas
          </Link>
        </section>
      </div>

      <div className="container-shell grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-xl font-black text-white">Nuevos ingresos</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {nuevos.map((p) => (
              <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-zinc-800 p-3 hover:border-emerald-500/60">
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">NUEVO</span>
                <p className="mt-2 line-clamp-1 text-sm font-bold text-zinc-100">{p.nombre}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-xl font-black text-white">Cómo funciona el marketplace</h3>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            {[
              "1. Explorás tiendas y comparás precios",
              "2. Elegís talle, color y método de envío",
              "3. Pagás en checkout seguro",
              "4. Recibís seguimiento y soporte",
            ].map((step) => (
              <div key={step} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Suspense
        fallback={
          <div className="container-shell py-12 text-center text-zinc-500">Cargando catálogo…</div>
        }
      >
        <HomeCatalog />
      </Suspense>
      <section className="container-shell">
        <h2 className="mb-4 text-2xl font-black text-white">Ofertas fuertes del día</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {ofertas.map((p) => (
            <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 hover:border-orange-500">
              <p className="line-clamp-1 text-sm font-bold text-white">{p.nombre}</p>
              <p className="mt-1 text-xs text-zinc-500">-{p.descuentoPct}% OFF</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
