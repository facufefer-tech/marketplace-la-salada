"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Pedido } from "@/lib/types";

export function OrdersTable({ tiendaId }: { tiendaId: string }) {
  const [rows, setRows] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("pedidos")
        .select("*")
        .eq("tienda_id", tiendaId)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setRows((data as Pedido[]) ?? []);
        setLoading(false);
      }
    }

    void load();

    const channel = supabase
      .channel(`pedidos-${tiendaId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos", filter: `tienda_id=eq.${tiendaId}` },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [tiendaId]);

  if (loading) return <p className="text-sm text-zinc-500">Cargando pedidos…</p>;

  if (!rows.length) {
    return <p className="text-sm text-zinc-500">Todavía no recibiste pedidos.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Comprador</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">Comisión</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">MP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
              <td className="px-3 py-2 text-zinc-400">{new Date(p.created_at).toLocaleString("es-AR")}</td>
              <td className="px-3 py-2 text-white">{p.comprador_email ?? "—"}</td>
              <td className="px-3 py-2 text-white">${Number(p.total).toLocaleString("es-AR")}</td>
              <td className="px-3 py-2 text-zinc-400">${Number(p.comision_cobrada).toLocaleString("es-AR")}</td>
              <td className="px-3 py-2 text-accent">{p.estado}</td>
              <td className="max-w-[120px] truncate px-3 py-2 text-xs text-zinc-500">{p.mp_payment_id ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
