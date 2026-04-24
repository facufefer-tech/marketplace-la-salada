import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let activas = 0;
  let pendientes = 0;
  let productos = 0;
  let ventasMes = 0;
  let comisiones = 0;
  let regSemana = 0;

  try {
    const admin = createSupabaseAdminClient();
    const { data: tis } = await admin.from("tiendas").select("id, admin_estado, created_at, owner_id");
    const t = tis ?? [];
    activas = t.filter((x) => (x as { admin_estado?: string }).admin_estado === "activa" || !(x as { admin_estado?: string }).admin_estado).length;
    pendientes = t.filter((x) => (x as { admin_estado?: string }).admin_estado === "pendiente").length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    regSemana = t.filter(
      (x) => (x as { created_at: string }).created_at && new Date((x as { created_at: string }).created_at) > weekAgo,
    ).length;
    const { count: pc } = await admin.from("productos").select("*", { count: "exact", head: true });
    productos = pc ?? 0;
    const mStart = new Date();
    mStart.setDate(1);
    mStart.setHours(0, 0, 0, 0);
    const { data: ped } = await admin.from("pedidos").select("total, comision_cobrada, created_at, estado");
    for (const p of ped ?? []) {
      if (new Date((p as { created_at: string }).created_at) >= mStart) {
        const e = String((p as { estado: string }).estado);
        if (!e.toLowerCase().includes("pend")) {
          ventasMes += Number((p as { total: number }).total) || 0;
        }
        comisiones += Number((p as { comision_cobrada: number }).comision_cobrada) || 0;
      }
    }
  } catch {
    /* */
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Métricas globales</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Feriantes (activa)</p>
          <p className="text-2xl font-black text-white">{activas}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Feriantes pendientes</p>
          <p className="text-2xl font-black text-amber-400">{pendientes}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Productos publicados</p>
          <p className="text-2xl font-black text-white">{productos}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Ventas del mes (aprox.)</p>
          <p className="text-2xl font-black text-emerald-400">${ventasMes.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Comisiones cobradas (hist. cargado en pedidos)</p>
          <p className="text-2xl font-black text-orange-300">${comisiones.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Nuevas tiendas (7 d)</p>
          <p className="text-2xl font-black text-sky-400">{regSemana}</p>
        </div>
      </div>
    </div>
  );
}
