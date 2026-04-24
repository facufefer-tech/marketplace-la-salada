import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
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

  if (error || !tienda) notFound();

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tienda.id)
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (productos ?? []) as Producto[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
        {tienda.banner_url ? (
          <div className="relative h-40 sm:h-52">
            <Image src={tienda.banner_url} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-zinc-800 to-zinc-900 sm:h-40" />
        )}
        <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-6 sm:p-6">
          <div className="relative -mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 sm:-mt-20 sm:h-28 sm:w-28">
            {tienda.logo_url ? (
              <Image src={tienda.logo_url} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-600">Logo</div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="text-2xl font-bold text-white">{tienda.nombre}</h1>
            {tienda.descripcion && <p className="mt-2 text-sm text-zinc-400">{tienda.descripcion}</p>}
            <p className="mt-2 text-xs text-zinc-500">
              Plan {tienda.plan} · Comisión plataforma {Number(tienda.comision_pct)}%
            </p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-white">Productos</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const img = p.fotos?.[0];
          return (
            <Link
              key={p.id}
              href={`/${params.tienda}/producto/${p.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-surface transition hover:border-accent/40"
            >
              <div className="relative aspect-[4/3] bg-zinc-900">
                {img ? (
                  <Image src={img} alt={p.nombre} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-600">Sin foto</div>
                )}
                {p.destacado && (
                  <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-black">
                    Destacado
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-white group-hover:text-accent">{p.nombre}</p>
                <p className="mt-1 text-base font-semibold text-white">${Number(p.precio).toLocaleString("es-AR")}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {!list.length && <p className="text-sm text-zinc-500">Esta tienda aún no publicó productos.</p>}
    </main>
  );
}
