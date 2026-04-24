"use client";

import { useCallback, useEffect, useState } from "react";

type R = { id: string; nombre: string; estrellas: number; comentario: string | null; aprobada: boolean; productos: { nombre: string } | null };

export function ResenasPanel() {
  const [rows, setRows] = useState<R[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/dashboard/resenas/moderar");
    const j = (await res.json()) as { data: R[] };
    setRows(j.data ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setAprobada(id: string, aprobada: boolean) {
    await fetch("/api/dashboard/resenas/moderar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aprobada }),
    });
    void load();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b text-xs text-zinc-500">
            <th className="py-2">Producto</th>
            <th>Nombre</th>
            <th>Estrellas</th>
            <th>Comentario</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-zinc-100">
              <td className="py-2">{(r.productos as { nombre?: string } | null)?.nombre ?? "—"}</td>
              <td>{r.nombre}</td>
              <td>{r.estrellas}</td>
              <td className="max-w-xs truncate">{r.comentario}</td>
              <td>
                {r.aprobada ? (
                  <span className="text-emerald-600">Aprobada</span>
                ) : (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setAprobada(r.id, true)} className="text-xs text-orange-600">
                      Aprobar
                    </button>
                    <button type="button" onClick={() => setAprobada(r.id, false)} className="text-xs text-zinc-400">
                      Rechazar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="text-sm text-zinc-500">No hay reseñas. Ejecutá schema fase 2 o esperá que lleguen comentarios.</p>}
    </div>
  );
}
