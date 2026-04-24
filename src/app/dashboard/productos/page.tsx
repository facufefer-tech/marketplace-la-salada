import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardProductosClient } from "@/components/dashboard/DashboardProductosClient";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";
import type { Producto } from "@/lib/types";

export default async function DashboardProductosPage() {
  const supabase = createSupabaseServerClient();

  const { data: tienda } = await supabase
    .from("tiendas")
    .select("*")
    .eq("slug", DASHBOARD_DEMO.slug)
    .maybeSingle();

  let list: Producto[] = [];
  if (tienda) {
    const { data: productos } = await supabase
      .from("productos")
      .select("*")
      .eq("tienda_id", tienda.id)
      .order("created_at", { ascending: false });
    list = (productos ?? []) as Producto[];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Productos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {DASHBOARD_DEMO.usuario} · {DASHBOARD_DEMO.tienda}
          {tienda ? (
            <>
              {" "}
              —{" "}
              <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
                /{tienda.slug}
              </Link>
            </>
          ) : (
            <span className="text-zinc-600"> — (sin fila con slug {DASHBOARD_DEMO.slug} en la base; lista vacía en prueba)</span>
          )}
        </p>
        <Link
          href="/dashboard/productos/nuevo"
          className="mt-3 inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-black text-white"
        >
          Cargar producto nuevo
        </Link>
      </div>

      <DashboardProductosClient productos={list} />
    </div>
  );
}
