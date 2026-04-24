import { Suspense } from "react";
import Link from "next/link";
import { CountdownClock } from "@/components/home/CountdownClock";
import { HeroRotator } from "@/components/home/HeroRotator";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import { demoProducts, demoStores } from "@/lib/demo-data";

export default function HomePage() {
  const bestSellers = [...demoProducts].sort((a, b) => b.stock - a.stock).slice(0, 4);
  const nuevos = demoProducts.filter((p) => p.nuevo).slice(0, 4);
  const ofertas = [...demoProducts].sort((a, b) => b.descuentoPct - a.descuentoPct).slice(0, 4);

  return (
    <main className="space-y-10 bg-white pb-10">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden">
        <HeroRotator />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/70 via-[#1A1A1A]/45 to-[#1A1A1A]/20" />
        <div className="container-shell relative z-10 py-16">
          <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#1A1A1A]">🧵 Miles de productos reales</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
            La moda de La Salada, ahora online.
          </h1>
          <p className="mt-4 max-w-xl text-zinc-200 md:text-lg">
            Comprá directo a los feriantes. Ropa mayorista y minorista con envío a todo el país.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/?focus=search" className="rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white hover:bg-[#E05A00]">
              Ver productos
            </Link>
            <Link href="/para-feriantes" className="rounded-xl border border-white/60 px-6 py-3 font-bold text-white hover:border-white">
              Quiero vender
            </Link>
          </div>
        </div>
      </section>

      <div className="container-shell">
        <section className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#555555]">Marcas destacadas</p>
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin">
            {[...demoStores, ...demoStores].map((s, i) => (
              <Link
                key={`${s.id}-${i}`}
                href={`/${s.slug}`}
                className="fade-in inline-flex min-w-max items-center gap-2 rounded-full border border-[#E0E0E0] bg-white px-4 py-2 text-sm text-[#1A1A1A] hover:border-[#FF6B00]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-black text-white">
                  {s.nombre.slice(0, 1)}
                </span>
                {s.nombre}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="container-shell grid gap-5 md:grid-cols-3">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-5 md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1A1A1A]">Lo más vendido esta semana</h2>
            <Link href="/" className="text-sm text-[#FF6B00] hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {bestSellers.map((p, idx) => (
              <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-[#E0E0E0] p-3 hover:border-[#FF6B00]/60">
                <p className="line-clamp-1 text-sm font-bold text-[#1A1A1A]">{p.nombre}</p>
                <p className="text-xs text-[#555555]">{p.marca}</p>
                <p className="mt-2 text-lg font-black text-[#FF6B00]">${p.precio.toLocaleString("es-AR")}</p>
                <p className="mt-1 text-xs text-[#555555]">👕 Precio mayorista desde ${Math.round(p.precio * 0.82).toLocaleString("es-AR")}</p>
                <p className="mt-1 text-xs text-[#555555]">{idx % 2 === 0 ? "Correo Argentino disponible" : "Retiro en feria y envío"}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E05A00]">Ofertas que terminan hoy</p>
          <p className="mt-3 text-3xl font-black text-[#1A1A1A]"><CountdownClock /></p>
          <p className="mt-2 text-sm text-[#555555]">Aprovechá descuentos de hasta 60% en tiendas seleccionadas.</p>
          <Link href="/?descuento=1" className="mt-6 inline-block rounded-xl bg-[#FF6B00] px-4 py-2 text-sm font-black text-white hover:bg-[#E05A00]">
            Ver ofertas
          </Link>
        </section>
      </div>

      <div className="container-shell grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
          <h3 className="text-xl font-black text-[#1A1A1A]">Nuevos ingresos</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {nuevos.map((p) => (
              <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-[#E0E0E0] p-3 hover:border-emerald-500/60">
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">NUEVO</span>
                <p className="mt-2 line-clamp-1 text-sm font-bold text-[#1A1A1A]">{p.nombre}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-5">
          <h3 className="text-xl font-black text-[#1A1A1A]">Cómo funciona</h3>
          <div className="mt-4 grid gap-2 text-sm text-[#1A1A1A]">
            {[
              "🏪 Explorá las tiendas — Navegá entre cientos de feriantes reales de La Salada",
              "👕 Elegí tu ropa — Precios de feria, calidad comprobada, fotos reales",
              "💳 Pagá con MercadoPago — Seguro, rápido, con todos los medios de pago",
              "📦 Recibís en tu casa — Envío a todo el país por correo o moto",
            ].map((step) => (
              <div key={step} className="rounded-xl border border-[#E0E0E0] bg-white p-3">
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Suspense
        fallback={
          <div className="container-shell py-12 text-center text-[#555555]">Cargando catálogo…</div>
        }
      >
        <HomeCatalog />
      </Suspense>
      <section className="container-shell">
        <h2 className="mb-4 text-2xl font-black text-[#1A1A1A]">Ofertas fuertes del día</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {ofertas.map((p) => (
            <Link key={p.id} href={`/${p.tiendas?.slug}/producto/${p.id}`} className="rounded-xl border border-[#E0E0E0] bg-white p-3 hover:border-[#FF6B00]">
              <p className="line-clamp-1 text-sm font-bold text-[#1A1A1A]">{p.nombre}</p>
              <p className="mt-1 text-xs text-[#555555]">-{p.descuentoPct}% OFF</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
