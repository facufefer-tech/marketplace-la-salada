import Link from "next/link";
import { demoProductsTiendaDemo } from "@/lib/demo-data";
import { demoPedidosFeriante } from "@/lib/demo-pedidos";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";

const fmtMoney = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default function DashboardHomePage() {
  const nProd = demoProductsTiendaDemo.length;
  const nPed = demoPedidosFeriante.length;
  const ventaMes = demoPedidosFeriante.filter((p) => p.estado !== "Pendiente").reduce((a, p) => a + p.total, 0);
  const ticketPromedio = Math.round(ventaMes / Math.max(1, nPed - 1));

  return (
    <div>
      <div className="border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Hola, {DASHBOARD_DEMO.usuario}</h1>
        <p className="mt-1 text-sm text-zinc-500">Resumen de {DASHBOARD_DEMO.tienda} · catálogo y pedidos de demostración</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Productos publicados</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900">{nProd}</p>
          <Link href="/dashboard/productos" className="mt-3 inline-block text-sm font-medium text-orange-600 hover:underline">
            Gestionar catálogo
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Pedidos (demo)</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900">{nPed}</p>
          <Link href="/dashboard/pedidos" className="mt-3 inline-block text-sm font-medium text-orange-600 hover:underline">
            Ver pedidos
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ventas aprox. (demo)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">{fmtMoney(ventaMes)}</p>
          <p className="mt-1 text-xs text-zinc-500">Excl. pedidos pendientes de pago</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ticket promedio</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">{fmtMoney(ticketPromedio)}</p>
          <p className="mt-1 text-xs text-zinc-500">Sobre pedidos de muestra</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-5 text-sm text-zinc-600">
          <p className="font-semibold text-zinc-800">Comisiones</p>
          <p className="mt-2">
            Mercado: <strong className="text-zinc-900">5%</strong> por transacción (configurable). En checkout con Mercado Pago:{" "}
            <strong>95% feriante</strong> / <strong>5% plataforma</strong>.
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-5 text-sm text-zinc-600">
          <p className="font-semibold text-zinc-800">Próximos pasos</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Revisá productos y pedidos de demostración</li>
            <li>Personalizá <Link href="/dashboard/tienda" className="font-medium text-orange-600 hover:underline">tu tienda</Link></li>
            <li>Mirá <Link href="/dashboard/estadisticas" className="font-medium text-orange-600 hover:underline">estadísticas</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
