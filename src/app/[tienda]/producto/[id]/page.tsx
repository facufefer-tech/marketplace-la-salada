import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AddToCartButton } from "@/components/product/AddToCartButton";

type Props = { params: { tienda: string; id: string } };

export default async function ProductoPage({ params }: Props) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) notFound();

  const supabase = createClient(url, key);
  const { data: producto, error } = await supabase
    .from("productos")
    .select("*, tiendas(slug,nombre,activa)")
    .eq("id", params.id)
    .eq("activo", true)
    .maybeSingle();

  if (error || !producto) notFound();
  const t = producto.tiendas as { slug: string; nombre: string; activa: boolean } | null;
  if (!t?.activa || t.slug !== params.tienda) notFound();

  const fotos: string[] = producto.fotos ?? [];
  const main = fotos[0];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/" className="hover:text-accent">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${params.tienda}`} className="hover:text-accent">
          {t.nombre}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{producto.nombre}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {main ? (
              <Image src={main} alt={producto.nombre} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 50vw" />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600">Sin imagen</div>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {fotos.slice(1).map((f) => (
                <div key={f} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-800">
                  <Image src={f} alt="" fill className="object-cover" sizes="64px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">{producto.nombre}</h1>
          <p className="mt-4 text-3xl font-semibold text-accent">${Number(producto.precio).toLocaleString("es-AR")}</p>
          <dl className="mt-6 space-y-2 text-sm text-zinc-400">
            {producto.categoria && (
              <div>
                <dt className="inline text-zinc-500">Categoría: </dt>
                <dd className="inline text-zinc-200">{producto.categoria}</dd>
              </div>
            )}
            {producto.talle && (
              <div>
                <dt className="inline text-zinc-500">Talle: </dt>
                <dd className="inline text-zinc-200">{producto.talle}</dd>
              </div>
            )}
            {producto.color && (
              <div>
                <dt className="inline text-zinc-500">Color: </dt>
                <dd className="inline text-zinc-200">{producto.color}</dd>
              </div>
            )}
            <div>
              <dt className="inline text-zinc-500">Stock: </dt>
              <dd className="inline text-zinc-200">{producto.stock}</dd>
            </div>
          </dl>
          {producto.descripcion && (
            <p className="mt-6 text-sm leading-relaxed text-zinc-300">{producto.descripcion}</p>
          )}
          <div className="mt-8">
            <AddToCartButton producto={{ ...producto, tiendas: t }} />
          </div>
        </div>
      </div>
    </main>
  );
}
