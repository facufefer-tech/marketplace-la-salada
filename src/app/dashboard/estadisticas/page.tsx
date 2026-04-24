import { demoProductsTiendaDemo } from "@/lib/demo-data";
import { demoPedidosFeriante } from "@/lib/demo-pedidos";

const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default function EstadisticasPage() {
  const ventasTotal = demoPedidosFeriante.filter((p) => p.estado !== "Pendiente").reduce((a, p) => a + p.total, 0);
  const visitasDemo = 12840;
  const conversion = 3.2;
  const ticket = Math.round(ventasTotal / Math.max(1, demoPedidosFeriante.length - 1));

  const categorias: Record<string, number> = {};
  for (const p of demoProductsTiendaDemo) {
    const c = p.categoria ?? "Otras";
    categorias[c] = (categorias[c] ?? 0) + 1;
  }
  const topCat = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Estadísticas</h1>
        <p className="mt-1 text-sm text-zinc-500">Indicadores de demostración (no conectados a analítica real)</p>
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
          <p className="mt-1 text-xs text-zinc-500">Sobre tráfico simulado</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ingresos pedidos (demo)</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">{fmt(ventasTotal)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categoría top</p>
          <p className="mt-2 text-xl font-bold text-zinc-900">{topCat ? topCat[0] : "—"}</p>
          <p className="text-xs text-zinc-500">{topCat ? `${topCat[1]} productos` : ""}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Volumen por categoría (catálogo demo)</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(categorias)
              .sort((a, b) => b[1] - a[1])
              .map(([c, n]) => (
                <li key={c} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{c}</span>
                  <span className="font-semibold tabular-nums text-zinc-900">{n}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Resumen de pedidos demo</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li className="flex justify-between">
              <span>Pedidos en tabla</span>
              <span className="font-medium text-zinc-900">{demoPedidosFeriante.length}</span>
            </li>
            <li className="flex justify-between">
              <span>Ticket promedio (aprox.)</span>
              <span className="font-medium text-zinc-900">{fmt(ticket)}</span>
            </li>
            <li className="flex justify-between">
              <span>Productos publicados (demo)</span>
              <span className="font-medium text-zinc-900">{demoProductsTiendaDemo.length}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
