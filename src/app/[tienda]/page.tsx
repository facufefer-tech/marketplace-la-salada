import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { demoProducts, demoStores } from "@/lib/demo-data";
import type { Producto } from "@/lib/types";

type Props = { params: { tienda: string } };

export default async function TiendaPage({ params }: Props) {
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
    .eq("tienda_id", tienda.id)
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  const list = ((productos ?? []) as Producto[]).length
    ? ((productos ?? []) as Producto[])
    : demoProducts.filter((p) => p.tiendas?.slug === params.tienda);
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
              <p className="mt-1 text-xs text-zinc-500">Feriante: {viewStore.owner}</p>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-extrabold text-zinc-900">Productos de la tienda</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map((p) => {
          const img = p.fotos?.[0];
          return (
            <Link
              key={p.id}
              href={`/${params.tienda}/producto/${p.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] bg-zinc-100">
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
                <p className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-orange-500">{p.nombre}</p>
                <p className="mt-1 text-base font-extrabold text-zinc-900">${Number(p.precio).toLocaleString("es-AR")}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {!list.length && <p className="text-sm text-zinc-500">Esta tienda aún no publicó productos.</p>}
    </main>
  );
}
