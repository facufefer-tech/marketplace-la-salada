import { createSupabaseServerClient } from "@/lib/supabase/server";

const mesesCortos = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function last12MonthKeys() {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 11; i >= 0; i--) {
    const t = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(monthKey(t));
  }
  return out;
}

function labelForKey(k: string) {
  const [y, m] = k.split("-").map(Number);
  return `${mesesCortos[(m || 1) - 1]} ${y % 100}`;
}

/** Montos de demo 2025–2026 (ARS), forma de campana suave */
const demoByMonth: Record<string, number> = {
  "2025-05": 120000,
  "2025-06": 145000,
  "2025-07": 168000,
  "2025-08": 175000,
  "2025-09": 190000,
  "2025-10": 210000,
  "2025-11": 198000,
  "2025-12": 225000,
  "2026-01": 205000,
  "2026-02": 218000,
  "2026-03": 232000,
  "2026-04": 248000,
};

export default async function EstadisticasPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: tienda } = user
    ? await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle()
    : { data: null };

  const keys = last12MonthKeys();
  const ventasMap: Record<string, number> = {};
  for (const k of keys) ventasMap[k] = 0;

  if (tienda?.id) {
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    const { data: rows } = await supabase
      .from("pedidos")
      .select("total, created_at, estado")
      .eq("tienda_id", tienda.id)
      .gte("created_at", since.toISOString());
    if (rows?.length) {
      for (const r of rows) {
        const e = String((r as { estado?: string }).estado).toLowerCase();
        if (e === "pendiente_pago" || (e.includes("pend") && e.includes("pago"))) continue;
        const d = new Date((r as { created_at: string }).created_at);
        const k = monthKey(d);
        if (k in ventasMap) {
          ventasMap[k] += Number((r as { total: number }).total) || 0;
        }
      }
    }
  }
  if (Object.values(ventasMap).every((v) => v === 0)) {
    for (const k of keys) ventasMap[k] = demoByMonth[k] ?? 150000;
  }

  const max = Math.max(1, ...Object.values(ventasMap));
  const ventasTotal = Object.values(ventasMap).reduce((a, b) => a + b, 0);
  const visitasDemo = 12840;
  const conversion = 3.2;
  const ticket = Math.round(ventasTotal / 12);
  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Estadísticas</h1>
        <p className="mt-1 text-sm text-zinc-500">Ventas por mes (reales o demo para la charla con clientes)</p>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900">Ventas por mes (últimos 12)</h2>
        <p className="text-xs text-zinc-500">Escala relativa; pasá el cursor por cada barra.</p>
        <div className="mt-4 flex h-56 min-h-[14rem] items-end justify-between gap-1 border-b border-zinc-200 pb-0 md:gap-2">
          {keys.map((k) => {
            const v = ventasMap[k] ?? 0;
            const h = Math.round((v / max) * 100);
            return (
              <div key={k} className="group flex min-w-0 flex-1 flex-col items-center justify-end">
                <div
                  title={`${labelForKey(k)}: $${v.toLocaleString("es-AR")}`}
                  className="w-full min-w-[8px] max-w-full rounded-t-md bg-gradient-to-t from-orange-600 to-amber-400 transition group-hover:from-orange-500 group-hover:to-amber-300"
                  style={{ height: `${h}%` }}
                />
                <span className="mt-2 hidden w-full truncate text-center text-[10px] text-zinc-500 sm:block">
                  {labelForKey(k)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 text-white shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Visitas (demo)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{visitasDemo.toLocaleString("es-AR")}</p>
          <p className="mt-1 text-xs text-zinc-400">Últimos 30 días</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tasa de conversión</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">{conversion}%</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Suma 12 meses (gráfico)</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">
            ${ventasTotal.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Promedio / mes aprox.</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">${ticket.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    </div>
  );
}
