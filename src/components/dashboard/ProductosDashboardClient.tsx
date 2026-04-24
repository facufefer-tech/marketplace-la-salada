"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Producto } from "@/lib/types";

export function ProductosDashboardClient() {
  const router = useRouter();
  const [rows, setRows] = useState<Producto[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr(null);
    const res = await fetch("/api/dashboard/productos", { cache: "no-store" });
    const j = (await res.json()) as { data?: Producto[]; error?: string };
    if (!res.ok) {
      setErr(j.error ?? "Error");
      return;
    }
    setRows(j.data ?? []);
  }, []);

  useEffect(() => {
    setLoading(true);
    void load().finally(() => setLoading(false));
  }, [load]);

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto de la base?")) return;
    const res = await fetch(`/api/dashboard/productos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const j = (await res.json()) as { error?: string };
      setErr(j.error ?? "No se pudo eliminar");
      return;
    }
    router.refresh();
    void load();
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando productos…</p>;
  }

  if (err) {
    return <p className="text-sm text-red-600">{err}</p>;
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
        <p className="text-zinc-600">Todavía no cargaste productos.</p>
        <Link href="/dashboard/productos/nuevo" className="mt-3 inline-block font-semibold text-orange-600 hover:underline">
          Cargar el primero
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase text-zinc-500">
            <th className="px-3 py-2">Foto</th>
            <th className="px-3 py-2">Producto</th>
            <th className="px-3 py-2">Precio</th>
            <th className="px-3 py-2">Categoría</th>
            <th className="px-3 py-2">Stock</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((p) => {
            const img = p.fotos[0] ?? "";
            return (
              <tr key={p.id} className="hover:bg-zinc-50/80">
                <td className="px-3 py-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                    {img ? <Image src={img} alt="" fill className="object-cover" sizes="48px" /> : null}
                  </div>
                </td>
                <td className="max-w-[200px] font-medium text-zinc-900">
                  <span className="line-clamp-2">{p.nombre}</span>
                </td>
                <td className="tabular-nums text-zinc-800">${Number(p.precio).toLocaleString("es-AR")}</td>
                <td className="text-zinc-600">{p.categoria ?? "—"}</td>
                <td className="tabular-nums">{p.stock}</td>
                <td>
                  <span className={p.activo ? "text-emerald-600" : "text-zinc-500"}>{p.activo ? "Activo" : "Inactivo"}</span>
                </td>
                <td className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/dashboard/productos/${p.id}/editar`}
                      className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-zinc-50"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
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
    </div>
  );
}
