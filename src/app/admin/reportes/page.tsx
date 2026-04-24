import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminReportesPage() {
  const admin = createSupabaseAdminClient();
  const { data: ped } = await admin.from("pedidos").select("total, created_at, items");
  const byMonth: Record<string, { total: number; n: number }> = {};
  for (const p of ped ?? []) {
    const d = new Date((p as { created_at: string }).created_at);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[k]) byMonth[k] = { total: 0, n: 0 };
    byMonth[k]!.total += Number((p as { total: number }).total) || 0;
    byMonth[k]!.n += 1;
  }
  const max = Math.max(1, ...Object.values(byMonth).map((x) => x.total));
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Reportes</h1>
      <h2 className="mt-6 text-sm font-bold text-zinc-400">Ventas por mes (pedidos)</h2>
      <div className="mt-2 flex h-40 items-end gap-1">
        {Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-12)
          .map(([k, v]) => (
            <div key={k} className="flex flex-1 flex-col items-center text-[10px] text-zinc-500">
              <div
                className="w-full rounded-t bg-gradient-to-t from-orange-600 to-amber-400"
                style={{ height: `${Math.round((v.total / max) * 100)}%` }}
                title={v.total.toString()}
              />
              {k}
            </div>
          ))}
      </div>
    </div>
  );
}
