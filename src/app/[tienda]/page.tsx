import Image from "next/image";
import Link from "next/link";
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
  const fallbackStore = demoStores.find((s) => s.slug === params.tienda);

  if (!url || !key) {
    if (!fallbackStore) {
      return (
        <main className="container-shell py-10">
          <section className="rounded-2xl border border-[#E0E0E0] bg-white p-8 text-center">
            <h1 className="text-3xl font-black text-[#1A1A1A]">Esta tienda está en preparación</h1>
            <p className="mt-2 text-[#555555]">
              Estamos terminando de cargar productos y datos de contacto. Volvé en unos minutos.
            </p>
            <Link href="/" className="mt-5 inline-block rounded-xl bg-[#FF6B00] px-4 py-2 font-bold text-white">
              Volver al inicio
            </Link>
          </section>
        </main>
      );
    }
  }

  const supabase = url && key ? createClient(url, key) : null;
  const { data: tienda } = supabase
    ? await supabase
        .from("tiendas")
        .select("*")
        .eq("slug", params.tienda)
        .eq("activa", true)
        .maybeSingle()
    : { data: null };

  const { data: productos } = supabase
    ? await supabase
        .from("productos")
        .select("*")
        .eq("tienda_id", tienda?.id ?? "__none__")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .order("created_at", { ascending: false })
    : { data: [] };

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
  const storeWhatsapp =
    (tienda as { whatsapp?: string | null } | null)?.whatsapp ??
    list.find((x) => x.tiendas?.whatsapp)?.tiendas?.whatsapp ??
    null;
  const waHref = storeWhatsapp
    ? `https://wa.me/${storeWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hola! Quiero consultar por productos de la tienda.")}`
    : null;
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
  if (!viewStore) {
    return (
      <main className="container-shell py-10">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Tienda no encontrada</h1>
          <p className="mt-2 text-[#555555]">
            Esta URL todavía no tiene tienda activa. Te mostramos otras opciones del marketplace.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/feriantes" className="rounded-xl border border-[#E0E0E0] px-4 py-2 font-bold text-[#1A1A1A]">
              Ver feriantes
            </Link>
            <Link href="/" className="rounded-xl bg-[#FF6B00] px-4 py-2 font-bold text-white">
              Ir al inicio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container-shell py-8">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-sm">
        {viewStore.banner_url ? (
          <div className="relative h-40 sm:h-52">
            <Image src={viewStore.banner_url} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-[#FF6B00] to-[#E05A00] sm:h-40" />
        )}
        <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-6 sm:p-6">
          <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E0E0E0] bg-[#F5F5F5] text-2xl font-bold text-[#1A1A1A] sm:-mt-20 sm:h-28 sm:w-28">
            {viewStore.logo_url ? (
              <Image src={viewStore.logo_url} alt="" fill className="object-cover" />
            ) : (
              viewStore.nombre[0]
            )}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="text-4xl font-black text-[#1A1A1A]">{viewStore.nombre}</h1>
            {viewStore.descripcion && <p className="mt-2 text-sm text-[#555555]">{viewStore.descripcion}</p>}
            <p className="mt-2 text-xs text-[#555555]">
              Plan {viewStore.plan} · Comisión plataforma {Number(viewStore.comision_pct)}%
            </p>
            {"owner" in viewStore && typeof viewStore.owner === "string" && (
              <p className="mt-1 text-xs text-[#555555]">Marca gestionada por: {viewStore.owner}</p>
            )}
          </div>
        </div>
      </div>

      <section className="mb-5 grid gap-3 rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-4 text-[#1A1A1A] md:grid-cols-4">
        <div>
          <p className="text-xs text-[#555555]">Productos</p>
          <p className="text-xl font-black">{list.length}</p>
        </div>
        <div>
          <p className="text-xs text-[#555555]">Reseñas</p>
          <p className="text-xl font-black">+240</p>
        </div>
        <div>
          <p className="text-xs text-[#555555]">Rating</p>
          <p className="text-xl font-black text-amber-500">★ 4.8</p>
        </div>
        <div>
          <p className="text-xs text-[#555555]">Ventas del mes</p>
          <p className="text-xl font-black">+1.200</p>
        </div>
      </section>
      <section className="mb-5 rounded-2xl border border-[#E0E0E0] bg-white p-4">
        <p className="text-sm font-bold text-[#1A1A1A]">Filtros de tienda</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/${params.tienda}`} className={`rounded-full px-3 py-1 text-xs ${fCat === "Todas" ? "bg-[#FF6B00] text-white" : "bg-[#F5F5F5] text-[#1A1A1A]"}`}>
            Todas
          </Link>
          {categorias.map((c) => (
            <Link key={c} href={`/${params.tienda}?categoria=${encodeURIComponent(c)}`} className={`rounded-full px-3 py-1 text-xs ${fCat === c ? "bg-[#FF6B00] text-white" : "bg-[#F5F5F5] text-[#1A1A1A]"}`}>
              {c}
            </Link>
          ))}
        </div>
      </section>
      <h2 className="mb-4 text-2xl font-extrabold text-[#1A1A1A]">Productos de la tienda</h2>
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
              className="group overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#FF6B00]/70"
            >
              <div className="relative aspect-[4/5] bg-[#F5F5F5]">
                {img ? (
                  <Image src={img} alt={p.nombre} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#555555]">Sin foto</div>
                )}
                {p.destacado && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#FF6B00] px-2 py-0.5 text-xs font-bold text-white">
                    Destacado
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-[#1A1A1A] group-hover:text-[#FF6B00]">{p.nombre}</p>
                {maybeOriginal && (
                  <p className="mt-1 text-xs text-[#555555] line-through">
                    ${Number(maybeOriginal).toLocaleString("es-AR")}
                  </p>
                )}
                <p className="mt-1 text-base font-extrabold text-[#1A1A1A]">${Number(p.precio).toLocaleString("es-AR")}</p>
                {maybeDiscount && (
                  <p className="text-xs font-bold text-red-500">-{maybeDiscount}% OFF</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      {!listFiltered.length && <p className="text-sm text-[#555555]">Esta tienda aún no publicó productos.</p>}
      <section className="mt-8 grid gap-4 rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-5 md:grid-cols-2">
        <div>
          <p className="text-xl font-black text-[#1A1A1A]">Sobre esta tienda</p>
          <p className="mt-2 text-sm text-[#555555]">{viewStore.descripcion ?? "Tienda oficial de La Salada con atención personalizada."}</p>
        </div>
        <div className="text-sm text-[#555555]">
          <p className="font-bold text-[#1A1A1A]">Métodos de envío</p>
          <p className="mt-1">Retiro en puesto, envío propio, Correo Argentino y OCA.</p>
          <p className="mt-3 font-bold text-[#1A1A1A]">Pagos aceptados</p>
          <p className="mt-1">Mercado Pago, transferencia y efectivo coordinado.</p>
          <p className="mt-3 font-bold text-[#1A1A1A]">Reseñas destacadas</p>
          <p className="mt-1 text-[#555555]">&ldquo;Excelente atención y calidad&rdquo; · &ldquo;Llegó rápido y en buen estado&rdquo;.</p>
        </div>
      </section>
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 z-30 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 md:bottom-6"
        >
          WhatsApp
        </a>
      ) : null}
    </main>
  );
}
