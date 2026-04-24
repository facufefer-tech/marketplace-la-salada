"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const TALLES = ["", "XS", "S", "M", "L", "XL", "Único"];
const COLORES = ["", "Negro", "Blanco", "Azul", "Rojo", "Verde", "Gris", "Varios"];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => ({
      categoria: searchParams.get("categoria") ?? "",
      minPrecio: searchParams.get("minPrecio") ?? "",
      maxPrecio: searchParams.get("maxPrecio") ?? "",
      talle: searchParams.get("talle") ?? "",
      color: searchParams.get("color") ?? "",
      tienda: searchParams.get("tienda") ?? "",
    }),
    [searchParams],
  );

  const [f, setF] = useState(initial);

  const apply = useCallback(() => {
    const p = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) p.set("q", q);
    if (f.categoria) p.set("categoria", f.categoria);
    if (f.minPrecio) p.set("minPrecio", f.minPrecio);
    if (f.maxPrecio) p.set("maxPrecio", f.maxPrecio);
    if (f.talle) p.set("talle", f.talle);
    if (f.color) p.set("color", f.color);
    if (f.tienda) p.set("tienda", f.tienda);
    router.push(`/?${p.toString()}`);
  }, [f, router, searchParams]);

  const clear = useCallback(() => {
    setF({
      categoria: "",
      minPrecio: "",
      maxPrecio: "",
      talle: "",
      color: "",
      tienda: "",
    });
    const q = searchParams.get("q");
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }, [router, searchParams]);

  return (
    <aside className="rounded-xl border border-zinc-800 bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold text-white">Filtros</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block text-xs text-zinc-400">
          Categoría
          <input
            value={f.categoria}
            onChange={(e) => setF((s) => ({ ...s, categoria: e.target.value }))}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
            placeholder="Ej: indumentaria"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Slug tienda
          <input
            value={f.tienda}
            onChange={(e) => setF((s) => ({ ...s, tienda: e.target.value }))}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
            placeholder="mi-puesto"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs text-zinc-400">
            Precio min
            <input
              type="number"
              value={f.minPrecio}
              onChange={(e) => setF((s) => ({ ...s, minPrecio: e.target.value }))}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            Precio max
            <input
              type="number"
              value={f.maxPrecio}
              onChange={(e) => setF((s) => ({ ...s, maxPrecio: e.target.value }))}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
            />
          </label>
        </div>
        <label className="block text-xs text-zinc-400">
          Talle
          <select
            value={f.talle}
            onChange={(e) => setF((s) => ({ ...s, talle: e.target.value }))}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          >
            {TALLES.map((t) => (
              <option key={t || "any"} value={t}>
                {t || "Todos"}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-zinc-400">
          Color
          <select
            value={f.color}
            onChange={(e) => setF((s) => ({ ...s, color: e.target.value }))}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          >
            {COLORES.map((c) => (
              <option key={c || "any"} value={c}>
                {c || "Todos"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={apply}
          className="flex-1 rounded-lg bg-accent py-2 text-sm font-semibold text-black hover:bg-orange-400"
        >
          Aplicar
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-zinc-700 px-3 text-sm text-zinc-400 hover:bg-zinc-900"
        >
          Limpiar
        </button>
      </div>
    </aside>
  );
}
