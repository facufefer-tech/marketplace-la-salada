import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { OrdersTable } from "@/components/dashboard/OrdersTable";

export default async function DashboardPedidosPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tienda } = await supabase.from("tiendas").select("id, slug, nombre").eq("owner_id", user!.id).maybeSingle();

  if (!tienda) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white">Pedidos</h1>
        <p className="mt-2 text-sm text-zinc-500">Primero creá tu tienda.</p>
        <div className="mt-6 max-w-lg">
          <OnboardingWizard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Pedidos recibidos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tienda{" "}
          <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
            {tienda.nombre}
          </Link>{" "}
          — actualización en tiempo real (Supabase Realtime).
        </p>
      </div>
      <OrdersTable tiendaId={tienda.id} />
    </div>
  );
}
