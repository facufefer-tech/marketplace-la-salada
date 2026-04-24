"use client";

import { useCallback, useEffect, useState } from "react";

type D = {
  id: string;
  codigo: string | null;
  tipo: string;
  valor: number;
  activo: boolean;
  alcance: string;
  categoria: string | null;
};

export function PromocionesClient() {
  const [list, setList] = useState<D[]>([]);
  const [loading, setLoading] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("porcentaje");
  const [valor, setValor] = useState("10");
  const [alcance, setAlcance] = useState("todos");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/descuentos");
    const j = (await res.json()) as { data: D[] };
    setList(j.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/dashboard/descuentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: codigo.trim() || null,
        tipo,
        valor: parseFloat(valor) || 0,
        activo: true,
        limite_usos: null,
        alcance,
        categoria: alcance === "categoria" ? "Remeras" : null,
        producto_ids: null,
      }),
    });
    if (!res.ok) {
      const e = (await res.json()) as { error?: string };
      setMsg(e.error ?? "Error");
      return;
    }
    setCodigo("");
    void load();
  }

  if (loading) return <p className="text-sm text-zinc-500">Cargando…</p>;

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="max-w-xl space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-bold">Nuevo descuento</h2>
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código (vacío = automático interno)"
          className="w-full rounded border px-2 py-1.5"
        />
        <div className="flex gap-2">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded border px-2">
            <option value="porcentaje">%</option>
            <option value="fijo">Monto fijo (ARS)</option>
            <option value="auto">Automático (demo)</option>
          </select>
          <input value={valor} onChange={(e) => setValor(e.target.value)} className="w-24 rounded border px-2" />
        </div>
        <select value={alcance} onChange={(e) => setAlcance(e.target.value)} className="w-full rounded border px-2 py-1">
          <option value="todos">Toda la tienda</option>
          <option value="categoria">Categoría (usar Remeras en demo)</option>
          <option value="productos">Productos específicos (IDs en API)</option>
        </select>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button type="submit" className="rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white">
          Crear
        </button>
      </form>
      <div>
        <h2 className="text-lg font-bold">Descuentos</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {list.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2">
              <span>
                {d.codigo || "(auto)"} — {d.tipo} {d.valor} — {d.alcance} — {d.activo ? "activo" : "off"}
              </span>
            </li>
          ))}
        </ul>
        {!list.length && <p className="text-sm text-zinc-500">No hay códigos aún. Ejecutá el SQL fase 2 en Supabase.</p>}
      </div>
    </div>
  );
}
