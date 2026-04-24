"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoProduct } from "@/lib/demo-data";
import { demoProductsTiendaDemo } from "@/lib/demo-data";
import {
  addDeletedProductId,
  getDeletedProductIds,
  mergeDemoProduct,
} from "@/lib/dashboard-product-demo-storage";

function computeList(): DemoProduct[] {
  const del = getDeletedProductIds();
  return demoProductsTiendaDemo.filter((p) => !del.has(p.id)).map((p) => mergeDemoProduct(p));
}

export function DashboardProductosGrid() {
  const [rows, setRows] = useState<DemoProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setRows(computeList());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [rows]);

  function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}" del catálogo demo?`)) return;
    addDeletedProductId(id);
    refresh();
  }

  if (!mounted) {
    return (
      <p className="text-sm text-zinc-500">Cargando catálogo…</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th className="px-3 py-3">Foto</th>
            <th className="px-3 py-3">Producto</th>
            <th className="px-3 py-3">Precio</th>
            <th className="px-3 py-3">Categoría</th>
            <th className="px-3 py-3">Stock</th>
            <th className="px-3 py-3">Estado</th>
            <th className="px-3 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {sorted.map((p) => {
            const img = p.fotos[0] ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=80";
            return (
              <tr key={p.id} className="bg-white transition hover:bg-zinc-50/80">
                <td className="px-3 py-2">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-zinc-200">
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                </td>
                <td className="max-w-[220px] px-3 py-2 font-medium text-zinc-900">
                  <span className="line-clamp-2">{p.nombre}</span>
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-800">
                  ${Number(p.precio).toLocaleString("es-AR")}
                </td>
                <td className="px-3 py-2 text-zinc-600">{p.categoria ?? "—"}</td>
                <td className="px-3 py-2 tabular-nums text-zinc-800">{p.stock}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      p.activo
                        ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                        : "inline-flex rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
                    }
                  >
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/dashboard/productos/${encodeURIComponent(p.id)}/editar`}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.nombre)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <p className="p-6 text-center text-sm text-zinc-500">No hay productos en el catálogo.</p>
      )}
    </div>
  );
}
