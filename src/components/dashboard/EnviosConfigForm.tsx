"use client";

import { useCallback, useEffect, useState } from "react";

const METODOS: { id: string; label: string; fijo: boolean }[] = [
  { id: "retiro", label: "Retiro en puesto (gratis)", fijo: true },
  { id: "propio_feriante", label: "Envío propio del feriante", fijo: false },
  { id: "correo_argentino", label: "Correo Argentino", fijo: false },
  { id: "oca", label: "OCA", fijo: false },
  { id: "andreani", label: "Andreani", fijo: false },
  { id: "mercadoenvios", label: "MercadoEnvíos (próximamente)", fijo: true },
];

type Row = { metodo: string; activo: boolean; precio: number; descripcion: string; tiempo_entrega: string };

export function EnviosConfigForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/envios-config");
      const j = (await res.json()) as { data?: Row[]; defaults?: { metodo: string; defaultPrecio: number; descripcion: string }[] };
      if (j.data && j.data.length) {
        const m = new Map(j.data.map((r) => [r.metodo, r]));
        setRows(
          METODOS.map((def) => {
            const ex = m.get(def.id);
            return (
              ex ?? {
                metodo: def.id,
                activo: def.id === "retiro",
                precio: def.fijo ? 0 : 5000,
                descripcion: "",
                tiempo_entrega: "2-5 días",
              }
            );
          }),
        );
      } else {
        setRows(
          METODOS.map((def) => ({
            metodo: def.id,
            activo: def.id === "retiro",
            precio: def.fijo ? 0 : 5000,
            descripcion: def.label,
            tiempo_entrega: "2-5 días",
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function update(i: number, part: Partial<Row>) {
    setRows((r) => {
      const n = [...r];
      n[i] = { ...n[i]!, ...part };
      return n;
    });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/dashboard/envios-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: rows.map((r) => ({ ...r, precio: r.metodo === "retiro" ? 0 : r.precio })) }),
      });
      if (!res.ok) {
        const e = (await res.json()) as { error?: string };
        setMsg(e.error ?? "Error");
        return;
      }
      setMsg("Envíos guardados.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando envíos…</p>;
  }
  return (
    <div className="mt-6 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
      <h3 className="text-sm font-bold text-zinc-900">Métodos de envío (precio y plazo)</h3>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.metodo} className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-3 sm:grid-cols-[auto_1fr_1fr_1fr] sm:items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={r.activo} onChange={(e) => update(i, { activo: e.target.checked })} />
              <span className="font-medium">{METODOS.find((m) => m.id === r.metodo)?.label ?? r.metodo}</span>
            </label>
            <input
              type="number"
              disabled={r.metodo === "retiro" || r.metodo === "mercadoenvios"}
              value={r.precio}
              onChange={(e) => update(i, { precio: parseFloat(e.target.value) || 0 })}
              className="rounded border px-2 py-1 text-sm"
              placeholder="Precio (ARS)"
            />
            <input
              value={r.tiempo_entrega}
              onChange={(e) => update(i, { tiempo_entrega: e.target.value })}
              className="rounded border px-2 py-1 text-sm"
              placeholder="Tiempo estimado"
            />
            <input
              value={r.descripcion}
              onChange={(e) => update(i, { descripcion: e.target.value })}
              className="rounded border px-2 py-1 text-sm"
              placeholder="Nota (opcional)"
            />
          </div>
        ))}
      </div>
      {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        {saving ? "…" : "Guardar envíos"}
      </button>
    </div>
  );
}
