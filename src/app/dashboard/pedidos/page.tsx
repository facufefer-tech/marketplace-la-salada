import { demoPedidosFeriante } from "@/lib/demo-pedidos";

const estados: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-900",
  Pagado: "bg-sky-100 text-sky-900",
  "En preparación": "bg-violet-100 text-violet-900",
  Enviado: "bg-blue-100 text-blue-900",
  Entregado: "bg-emerald-100 text-emerald-900",
};

export default function DashboardPedidosPage() {
  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Pedidos</h1>
        <p className="mt-1 text-sm text-zinc-500">Historial de demostración (5 pedidos ficticios, datos realistas)</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Comprador</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {demoPedidosFeriante.map((p) => (
              <tr key={p.id} className="bg-white transition hover:bg-zinc-50/80">
                <td className="px-4 py-3 font-mono text-xs text-zinc-800">{p.numero}</td>
                <td className="px-4 py-3 tabular-nums text-zinc-600">
                  {new Date(p.fecha).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{p.comprador}</p>
                  <p className="text-xs text-zinc-500">{p.email}</p>
                </td>
                <td className="max-w-[320px] px-4 py-3 text-zinc-600">
                  <span className="line-clamp-2">{p.itemsResumen}</span>
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums text-zinc-900">
                  ${p.total.toLocaleString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${estados[p.estado] ?? "bg-zinc-200 text-zinc-800"}`}
                  >
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
