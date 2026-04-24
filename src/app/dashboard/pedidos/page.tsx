import { demoPedidosFeriante, type DemoPedidoFila } from "@/lib/demo-pedidos";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const estados: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-900",
  Pagado: "bg-sky-100 text-sky-900",
  "En preparación": "bg-violet-100 text-violet-900",
  Enviado: "bg-blue-100 text-blue-900",
  Entregado: "bg-emerald-100 text-emerald-900",
  pendiente_pago: "bg-amber-100 text-amber-900",
  pagado: "bg-sky-100 text-sky-900",
  en_preparacion: "bg-violet-100 text-violet-900",
  enviado: "bg-blue-100 text-blue-900",
  entregado: "bg-emerald-100 text-emerald-900",
  cancelado: "bg-zinc-200 text-zinc-800",
};

type PedidoRow = {
  id: string;
  total: number;
  estado: string;
  created_at: string;
  comprador_email: string | null;
  items: { nombre: string; cantidad: number; precio_unit: number }[];
};

function mapSupabase(p: PedidoRow): DemoPedidoFila {
  const resumen = Array.isArray(p.items)
    ? p.items
        .map((i) => `${i.nombre} (x${i.cantidad})`)
        .join(", ")
        .slice(0, 120)
    : "—";
  const e = p.estado.toLowerCase();
  let estado: DemoPedidoFila["estado"] = "Pendiente";
  if (e.includes("pend") || e.includes("pendient")) estado = "Pendiente";
  else if (e.includes("pago") && !e.includes("pend") && (e.includes("aprob") || e.includes("pagad"))) estado = "Pagado";
  else if (e.includes("prepar")) estado = "En preparación";
  else if (e.includes("envi") && !e.includes("entreg")) estado = "Enviado";
  else if (e.includes("entreg")) estado = "Entregado";
  return {
    id: p.id,
    numero: p.id.slice(0, 8).toUpperCase(),
    fecha: p.created_at,
    comprador: p.comprador_email?.split("@")[0] ?? "Comprador",
    email: p.comprador_email ?? "—",
    itemsResumen: resumen,
    total: Number(p.total),
    estado,
  };
}

export default async function DashboardPedidosPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: tienda } = user
    ? await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle()
    : { data: null };
  let filas: DemoPedidoFila[] = demoPedidosFeriante;
  let fromDb = false;
  if (tienda?.id) {
    const { data: pedidos } = await supabase
      .from("pedidos")
      .select("id, total, estado, created_at, comprador_email, items")
      .eq("tienda_id", tienda.id)
      .order("created_at", { ascending: false });
    if (pedidos && pedidos.length) {
      filas = (pedidos as PedidoRow[]).map((p) => mapSupabase(p));
      fromDb = true;
    }
  }

  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Pedidos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {fromDb
            ? "Pedidos reales de tu tienda (Supabase)."
            : "Mostramos pedidos reales de Supabase; si aún no hay, ves datos de demostración."}
        </p>
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
            {filas.map((p) => (
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
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      estados[p.estado] ?? "bg-zinc-200 text-zinc-800"
                    }`}
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
