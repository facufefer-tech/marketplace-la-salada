import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { DASHBOARD_DEMO, TIENDA_ID_VACIO_PRUEBA } from "@/lib/dashboard-demo";

export default async function DashboardPedidosPage() {
  const supabase = createSupabaseServerClient();

  const { data: tienda } = await supabase
    .from("tiendas")
    .select("id, slug, nombre")
    .eq("slug", DASHBOARD_DEMO.slug)
    .maybeSingle();

  const tiendaId = tienda?.id ?? TIENDA_ID_VACIO_PRUEBA;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Pedidos recibidos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {DASHBOARD_DEMO.usuario} — {DASHBOARD_DEMO.tienda}
          {tienda ? (
            <>
              {" "}
              ·{" "}
              <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
                {tienda.nombre}
              </Link>{" "}
              — actualización en tiempo real (Supabase Realtime).
            </>
          ) : (
            <span className="text-zinc-600"> Modo prueba: sin tienda {DASHBOARD_DEMO.slug} en la base; tabla vacía.</span>
          )}
        </p>
      </div>
      <OrdersTable tiendaId={tiendaId} />
    </div>
  );
}
