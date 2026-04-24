import Link from "next/link";
import { ProductosDashboardClient } from "@/components/dashboard/ProductosDashboardClient";

export default function DashboardProductosPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Productos</h1>
          <p className="mt-1 text-sm text-zinc-500">Podés publicar, editar o eliminar. Datos reales en Supabase.</p>
        </div>
        <Link
          href="/dashboard/productos/nuevo"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          + Nuevo producto
        </Link>
      </div>
      <ProductosDashboardClient />
    </div>
  );
}
