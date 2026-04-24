import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { ProductoDetalleClient } from "@/components/product/ProductoDetalleClient";
import { demoProducts, getDemoStoreBySlug, getDemoProductById } from "@/lib/demo-data";
import { getSiteUrl } from "@/lib/site-url";
import type { EnvioMetodos, Producto, ResenaRow, Tienda } from "@/lib/types";

type Props = { params: { tienda: string; id: string } };
export const revalidate = 0;

type TiendaRow = Pick<Tienda, "slug" | "nombre" | "logo_url" | "whatsapp" | "instagram" | "direccion" | "envio_metodos">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const base = getSiteUrl();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let title = `Producto | La Salada`;
  let desc = "Moda La Salada marketplace";
  let image: string | undefined;
  if (url && key) {
    const supabase = createClient(url, key);
    const { data: row } = await supabase.from("productos").select("nombre, descripcion, fotos, seo_titulo, seo_descripcion").eq("id", params.id).maybeSingle();
    if (row) {
      const r = row as { nombre: string; descripcion: string | null; fotos: string[]; seo_titulo?: string; seo_descripcion?: string };
      title = r.seo_titulo || r.nombre;
      desc = r.seo_descripcion || r.descripcion || desc;
      image = r.fotos?.[0];
    }
  }
  return {
    title: `${title} | La Salada`,
    description: desc,
    openGraph: { title, description: desc, url: `${base}/${params.tienda}/producto/${params.id}`, images: image ? [{ url: image }] : [] },
  };
}

export default async function ProductoPage({ params }: Props) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let producto: Record<string, unknown> | null = null;
  let tiendaRow: TiendaRow | null = null;
  let enviosConfig: { metodo: string; precio: number; activo: boolean; tiempo_entrega: string | null; descripcion: string | null }[] = [];
  let resenasList: ResenaRow[] = [];
  let mismaTienda: Producto[] = [];
  let similares: Producto[] = [];

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
        const tid = (row as { tienda_id: string }).tienda_id;
        const category = (row as { categoria?: string | null }).categoria ?? null;
        const [{ data: ev }, { data: rs }, { data: rel }, { data: sim }] = await Promise.all([
          supabase.from("envios_config").select("*").eq("tienda_id", tid).eq("activo", true),
          supabase.from("resenas").select("*").eq("producto_id", params.id).eq("aprobada", true),
          supabase.from("productos").select("*").eq("tienda_id", tid).eq("activo", true).neq("id", params.id).limit(4),
          category
            ? supabase.from("productos").select("*").eq("categoria", category).eq("activo", true).neq("id", params.id).limit(4)
            : Promise.resolve({ data: [] as unknown[] }),
        ]);
        enviosConfig = (ev ?? []) as typeof enviosConfig;
        resenasList = (rs ?? []) as ResenaRow[];
        mismaTienda = (rel ?? []) as Producto[];
        similares = (sim ?? []) as Producto[];
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
    enviosConfig = [
      { metodo: "retiro", precio: 0, activo: true, tiempo_entrega: "Coordinar", descripcion: "Puesto" },
      { metodo: "correo_argentino", precio: 4500, activo: true, tiempo_entrega: "3-7 d", descripcion: "Demo" },
    ];
    mismaTienda = demoProducts.filter((x) => x.tiendas?.slug === params.tienda && x.id !== demoP.id).slice(0, 4);
    similares = demoProducts.filter((x) => x.categoria === demoP.categoria && x.id !== demoP.id).slice(0, 4);
  }

  if (!producto || !tiendaRow) {
    return (
      <main className="container-shell py-10">
        <section className="rounded-2xl border border-[#E0E0E0] bg-white p-8 text-center">
          <h1 className="text-3xl font-black text-[#1A1A1A]">Producto no encontrado</h1>
          <p className="mt-2 text-[#555555]">
            Este producto no está disponible o fue dado de baja. Podés seguir comprando en la tienda.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href={`/${params.tienda}`} className="rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white">
              Volver a la tienda
            </Link>
            <Link href="/" className="rounded-xl border border-[#E0E0E0] px-4 py-2 font-bold text-[#1A1A1A]">
              Ir al inicio
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    image: p.fotos,
    description: p.descripcion ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: p.precio,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
  return (
    <main className="container-shell py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <p className="text-sm text-zinc-400">Tienda en La Salada</p>
        </div>
      )}

      <ProductoDetalleClient
        producto={p}
        tienda={t}
        enviosConfig={enviosConfig}
        resenas={resenasList}
        relacionadosMismaTienda={mismaTienda}
        similares={similares}
      />
    </main>
  );
}
