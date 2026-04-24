import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProductoDetalleClient } from "@/components/product/ProductoDetalleClient";
import { getDemoStoreBySlug, getDemoProductById } from "@/lib/demo-data";
import type { EnvioMetodos, Producto, Tienda } from "@/lib/types";

type Props = { params: { tienda: string; id: string } };

type TiendaRow = Pick<Tienda, "slug" | "nombre" | "logo_url" | "whatsapp" | "instagram" | "direccion" | "envio_metodos">;

export default async function ProductoPage({ params }: Props) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let producto: Record<string, unknown> | null = null;
  let tiendaRow: TiendaRow | null = null;

  if (url && key) {
    const supabase = createClient(url, key);
    const { data: row, error } = await supabase
      .from("productos")
      .select("*, tiendas(slug,nombre,activa,logo_url,whatsapp,instagram,direccion,envio_metodos)")
      .eq("id", params.id)
      .eq("activo", true)
      .maybeSingle();
    if (!error && row) {
      const t = row.tiendas as unknown as (TiendaRow & { activa?: boolean }) | null;
      if (t?.slug === params.tienda) {
        producto = row;
        tiendaRow = t;
      }
    }
  }

  const demoP = getDemoProductById(params.id);
  const demoStore = getDemoStoreBySlug(params.tienda);

  if (!producto && demoP && demoP.tiendas?.slug === params.tienda && demoStore) {
    producto = { ...demoP };
    const emb = demoP.tiendas;
    const env = emb?.envio_metodos as EnvioMetodos | undefined;
    tiendaRow = {
      slug: demoStore.slug,
      nombre: demoStore.nombre,
      logo_url: null,
      whatsapp: emb?.whatsapp ?? null,
      instagram: null,
      direccion: emb?.direccion ?? "La Salada (demo)",
      envio_metodos: env ?? { retiro: true, correo: true, oca: false, andreani: false },
    };
  }

  if (!producto || !tiendaRow) notFound();

  const row = producto as Producto & { tienda_id: string; destacado?: boolean };
  const t = tiendaRow;
  const p: Producto = {
    id: String(row.id),
    tienda_id: row.tienda_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    precio_lista: row.precio_lista,
    marca: row.marca,
    categoria: row.categoria,
    talle: row.talle,
    color: row.color,
    stock: row.stock,
    fotos: row.fotos ?? [],
    activo: row.activo,
    destacado: row.destacado ?? false,
    created_at: row.created_at,
    tiendas: {
      slug: t.slug,
      nombre: t.nombre,
      logo_url: t.logo_url,
      whatsapp: t.whatsapp,
      direccion: t.direccion,
      envio_metodos: t.envio_metodos,
    },
  };
  return (
    <main className="container-shell py-8">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-orange-400">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${params.tienda}`} className="hover:text-orange-400">
          {t.nombre}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{row.nombre}</span>
      </nav>

      {t.logo_url && (
        <div className="mb-6 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-800">
            <Image src={t.logo_url} alt={t.nombre} fill className="object-cover" sizes="48px" />
          </div>
          <p className="text-sm text-zinc-400">Tienda verificada en La Salada</p>
        </div>
      )}

      <ProductoDetalleClient producto={p} tienda={t} />
    </main>
  );
}
