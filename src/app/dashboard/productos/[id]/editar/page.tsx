import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductoEditorCompleto } from "@/components/dashboard/ProductoEditorCompleto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Producto, ProductVariant } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditarProductoPage({ params }: Props) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth?next=/dashboard/productos");

    const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
    if (!tienda) redirect("/dashboard");

    let p: Record<string, unknown> | null = null;
    let loadError: string | null = null;

    const full = await supabase
      .from("productos")
      .select("*, tiendas(slug,nombre)")
      .eq("id", id)
      .eq("tienda_id", tienda.id)
      .maybeSingle();

    if (full.error && full.error.message.toLowerCase().includes("could not find the")) {
      const basic = await supabase
        .from("productos")
        .select("id,tienda_id,nombre,descripcion,precio,categoria,talle,color,stock,fotos,activo,destacado,created_at")
        .eq("id", id)
        .eq("tienda_id", tienda.id)
        .maybeSingle();
      p = (basic.data as Record<string, unknown> | null) ?? null;
      loadError = basic.error?.message ?? null;
    } else {
      p = (full.data as Record<string, unknown> | null) ?? null;
      loadError = full.error?.message ?? null;
    }

    if (loadError || !p) {
      return (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-black text-amber-900">No pudimos abrir este producto</h1>
          <p className="mt-2 text-sm text-amber-800">
            Puede haber sido eliminado o tu base todavía no tiene todas las columnas de la última versión.
          </p>
          <Link href="/dashboard/productos" className="mt-4 inline-block rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white">
            Volver a productos
          </Link>
        </section>
      );
    }

    const { data: rawVariants, error: vErr } = await supabase.from("product_variants").select("*").eq("producto_id", id);
    const initialVariants: ProductVariant[] = vErr ? [] : (rawVariants as ProductVariant[]) ?? [];

    const producto = p as Producto;
    producto.tallas = Array.isArray(producto.tallas) ? producto.tallas : [];
    producto.colores = Array.isArray(producto.colores) ? producto.colores : [];
    producto.fotos = Array.isArray(producto.fotos) ? producto.fotos : [];
    if (!producto.tiendas && p && typeof p === "object" && "tiendas" in p) {
      producto.tiendas = (p as { tiendas?: Producto["tiendas"] }).tiendas;
    }

    return (
      <div>
        <div className="mb-6 border-b border-zinc-100 pb-6">
          <Link href="/dashboard/productos" className="text-sm font-medium text-orange-600 hover:underline">
            ← Volver a productos
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-zinc-900">Editar producto (avanzado)</h1>
        </div>
        <ProductoEditorCompleto
          producto={producto}
          initialVariants={initialVariants}
        />
      </div>
    );
  } catch {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h1 className="text-xl font-black text-rose-900">Tuvimos un problema al abrir el editor</h1>
        <p className="mt-2 text-sm text-rose-800">
          Reintentá en unos segundos. Si sigue igual, revisá la conexión de Supabase.
        </p>
        <Link href="/dashboard/productos" className="mt-4 inline-block rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white">
          Volver a productos
        </Link>
      </section>
    );
  }
}
