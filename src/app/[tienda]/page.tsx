import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { demoProducts, demoStores } from "@/lib/demo-data";
import { getSiteUrl } from "@/lib/site-url";
import type { Producto } from "@/lib/types";

type Props = { params: { tienda: string }; searchParams?: { categoria?: string; q?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = getSiteUrl();
  return {
    title: `${params.tienda} | La Salada`,
    openGraph: { type: "website", url: `${u}/${params.tienda}` },
  };
}

export default async function TiendaPage({ params, searchParams }: Props) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) notFound();

  const supabase = createClient(url, key);
  const { data: tienda, error } = await supabase
    .from("tiendas")
    .select("*")
    .eq("slug", params.tienda)
    .eq("activa", true)
    .maybeSingle();

  const fallbackStore = demoStores.find((s) => s.slug === params.tienda);
  if ((error || !tienda) && !fallbackStore) notFound();

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tienda?.id ?? "__none__")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  const rawList = (productos ?? []) as (Producto & { estado_publicacion?: string })[];
  const filtered = rawList.length
    ? rawList.filter((p) => (p as { estado_publicacion?: string }).estado_publicacion !== "borrador")
    : [];
  const list = filtered.length
    ? filtered
    : demoProducts.filter((p) => p.tiendas?.slug === params.tienda);
  const categorias = Array.from(new Set(list.map((p) => p.categoria).filter(Boolean))) as string[];
  const fCat = searchParams?.categoria ?? "Todas";
  const fq = (searchParams?.q ?? "").toLowerCase();
  const listFiltered = list.filter((p) => {
    if (fCat !== "Todas" && p.categoria !== fCat) return false;
    if (fq && !`${p.nombre} ${p.descripcion ?? ""}`.toLowerCase().includes(fq)) return false;
    return true;
  });
  const viewStore =
    tienda ??
    (fallbackStore
      ? {
          slug: fallbackStore.slug,
          nombre: fallbackStore.nombre,
          descripcion: fallbackStore.descripcion,
          plan: "free",
          comision_pct: 5,
          banner_url: fallbackStore.bannerUrl,
          logo_url: fallbackStore.avatarUrl,
          owner: fallbackStore.owner,
        }
      : null);
  if (!viewStore) notFound();

  return (
    <main className="container-shell py-8">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {viewStore.banner_url ? (
          <div className="relative h-40 sm:h-52">
            <Image src={viewStore.banner_url} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-zinc-900 to-orange-600 sm:h-40" />
        )}
        <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-6 sm:p-6">
          <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 text-2xl font-bold text-zinc-700 sm:-mt-20 sm:h-28 sm:w-28">
            {viewStore.logo_url ? (
              <Image src={viewStore.logo_url} alt="" fill className="object-cover" />
            ) : (
              viewStore.nombre[0]
            )}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="text-3xl font-extrabold text-zinc-900">{viewStore.nombre}</h1>
            {viewStore.descripcion && <p className="mt-2 text-sm text-zinc-600">{viewStore.descripcion}</p>}
            <p className="mt-2 text-xs text-zinc-500">
              Plan {viewStore.plan} · Comisión plataforma {Number(viewStore.comision_pct)}%
            </p>
            {"owner" in viewStore && typeof viewStore.owner === "string" && (
              <p className="mt-1 text-xs text-zinc-500">Marca gestionada por: {viewStore.owner}</p>
            )}
          </div>
        </div>
      </div>

      <section className="mb-5 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-200 md:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">Productos</p>
          <p className="text-xl font-black">{list.length}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Reseñas</p>
          <p className="text-xl font-black">+240</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Rating</p>
          <p className="text-xl font-black text-amber-400">★ 4.8</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Ventas del mes</p>
          <p className="text-xl font-black">+1.200</p>
        </div>
      </section>
      <section className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-sm font-bold text-white">Filtros de tienda</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/${params.tienda}`} className={`rounded-full px-3 py-1 text-xs ${fCat === "Todas" ? "bg-orange-500 text-black" : "bg-zinc-800 text-zinc-200"}`}>
            Todas
          </Link>
          {categorias.map((c) => (
            <Link key={c} href={`/${params.tienda}?categoria=${encodeURIComponent(c)}`} className={`rounded-full px-3 py-1 text-xs ${fCat === c ? "bg-orange-500 text-black" : "bg-zinc-800 text-zinc-200"}`}>
              {c}
            </Link>
          ))}
        </div>
      </section>
      <h2 className="mb-4 text-2xl font-extrabold text-white">Productos de la tienda</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {listFiltered.map((p) => {
          const img = p.fotos?.[0];
          const ui = p as Producto & { precioOriginal?: number; descuentoPct?: number };
          const maybeOriginal = typeof ui.precioOriginal === "number" ? ui.precioOriginal : null;
          const maybeDiscount = typeof ui.descuentoPct === "number" ? ui.descuentoPct : null;
          return (
            <Link
              key={p.id}
              href={`/${params.tienda}/producto/${p.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-500/70"
            >
              <div className="relative aspect-[4/5] bg-zinc-900">
                {img ? (
                  <Image src={img} alt={p.nombre} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-600">Sin foto</div>
                )}
                {p.destacado && (
                  <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    Destacado
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-orange-500">{p.nombre}</p>
                {maybeOriginal && (
                  <p className="mt-1 text-xs text-zinc-500 line-through">
                    ${Number(maybeOriginal).toLocaleString("es-AR")}
                  </p>
                )}
                <p className="mt-1 text-base font-extrabold text-zinc-100">${Number(p.precio).toLocaleString("es-AR")}</p>
                {maybeDiscount && (
                  <p className="text-xs font-bold text-red-500">-{maybeDiscount}% OFF</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      {!listFiltered.length && <p className="text-sm text-zinc-500">Esta tienda aún no publicó productos.</p>}
      <section className="mt-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:grid-cols-2">
        <div>
          <p className="text-xl font-black text-white">Sobre esta tienda</p>
          <p className="mt-2 text-sm text-zinc-400">{viewStore.descripcion ?? "Tienda oficial de La Salada con atención personalizada."}</p>
        </div>
        <div className="text-sm text-zinc-300">
          <p className="font-bold text-white">Métodos de envío</p>
          <p className="mt-1">Retiro en puesto, envío propio, Correo Argentino y OCA.</p>
          <p className="mt-3 font-bold text-white">Pagos aceptados</p>
          <p className="mt-1">Mercado Pago, transferencia y efectivo coordinado.</p>
        </div>
      </section>
      <a
        href="https://wa.me/5491111111111?text=Hola%20quiero%20consultar%20por%20productos%20de%20la%20tienda"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-30 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-black shadow-lg hover:bg-emerald-400 md:bottom-6"
      >
        WhatsApp
      </a>
    </main>
  );
}
