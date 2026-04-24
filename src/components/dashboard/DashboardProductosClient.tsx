"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Producto } from "@/lib/types";
import { AIProductChat } from "@/components/dashboard/AIProductChat";
import { ProductForm } from "@/components/dashboard/ProductForm";

type Props = { productos: Producto[] };

export function DashboardProductosClient({ productos }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Producto | null>(null);

  const onParsed = useCallback(
    async (rows: Record<string, unknown>[]) => {
      for (const r of rows) {
        const body = {
          nombre: String(r.nombre ?? "Sin nombre"),
          descripcion: (r.descripcion as string) ?? null,
          precio: Number(r.precio ?? 0),
          categoria: (r.categoria as string) ?? null,
          talle: (r.talle as string) ?? null,
          color: (r.color as string) ?? null,
          stock: Number(r.stock ?? 0),
          fotos: [] as string[],
          destacado: Boolean(r.destacado),
          activo: true,
        };
        await fetch("/api/dashboard/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      router.refresh();
    },
    [router],
  );

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/dashboard/productos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    router.refresh();
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-white">Carga con IA o formulario manual</h2>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="rounded-lg border border-zinc-600 px-3 py-1 text-xs text-zinc-300 hover:border-accent"
        >
          Nuevo producto
        </button>
      </div>

      <AIProductChat onParsed={(rows) => void onParsed(rows)} />

      <ProductForm key={editing?.id ?? "new"} initial={editing} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-white">Listado</h2>
        <ul className="space-y-2">
          {productos.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-white">{p.nombre}</span>
                <span className="ml-2 text-zinc-400">${Number(p.precio).toLocaleString("es-AR")}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(p)}
                  className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:border-accent"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => void remove(p.id)}
                  className="rounded border border-red-900/50 px-2 py-1 text-xs text-red-400 hover:bg-red-950/40"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
