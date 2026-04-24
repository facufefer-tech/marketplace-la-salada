"use client";

import Papa from "papaparse";
import { useState } from "react";
import * as XLSX from "xlsx";

type Row = Record<string, string>;

function normKey(k: string) {
  return k
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["']/g, "")
    .trim();
}

function toInternalRows(rawRows: Row[]) {
  const bySlug = new Map<string, Row>();
  return rawRows
    .map((r) => {
      const mapped: Row = {};
      const keys = Object.keys(r);
      for (const key of keys) {
        const nk = normKey(key);
        const v = (r[key] ?? "").trim();
        if (!v) continue;
        if (nk === "nombre") mapped.nombre = v;
        else if (nk === "descripcion") mapped.descripcion = v;
        else if (nk === "categorias" || nk === "categoria") mapped.categoria = v.split(",")[0]!.trim();
        else if (nk === "precio") mapped.precio = v;
        else if (nk === "precio_mayorista" || nk === "precio mayorista") mapped.precio_mayorista = v;
        else if (nk === "precio promocional" || nk === "precio_promocional") mapped.precio_descuento = v;
        else if (nk === "stock") mapped.stock = v;
        else if (nk === "marca") mapped.marca = v;
        else if (nk === "sku") mapped.sku = v;
        else if (nk === "tallas" || nk === "talles") mapped.tallas = v;
        else if (nk === "colores") mapped.colores = v;
        else if (nk === "peso (kg)" || nk === "peso kg") {
          const kg = Number(v.replace(",", "."));
          if (Number.isFinite(kg)) mapped.peso_gramos = String(Math.round(kg * 1000));
        } else if (nk === "tags") mapped.etiquetas = v;
        else if (nk === "valor de propiedad 1") mapped.color = v;
        else if (nk === "valor de propiedad 2") mapped.talle = v;
        else if (nk === "identificador de url") mapped._slug = v;
      }
      return mapped;
    })
    .map((r) => {
      const slug = r._slug;
      if (slug && r.nombre) bySlug.set(slug, r);
      if (slug && !r.nombre && bySlug.has(slug)) {
        const b = bySlug.get(slug)!;
        return { ...b, ...r, nombre: b.nombre, categoria: r.categoria || b.categoria, descripcion: r.descripcion || b.descripcion };
      }
      if (r.tallas && !r.talle) r.talle = r.tallas;
      if (r.colores && !r.color) r.color = r.colores;
      return r;
    })
    .filter((x) => x.nombre && x.precio)
    .map((x) => Object.fromEntries(Object.entries(x).filter(([k]) => k !== "_slug")) as Row);
}

export function ImportarClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [result, setResult] = useState<{ imported: number; errores: number; detalle: unknown } | null>(null);

  function onFile(f: File | null) {
    if (!f) return;
    setResult(null);
    if (f.name.endsWith(".csv")) {
      Papa.parse<Row>(f, {
        header: true,
        skipEmptyLines: true,
        delimiter: "",
        complete: (r) => setRows(toInternalRows(r.data as Row[])),
      });
      return;
    }
    f.arrayBuffer().then((ab) => {
      const wb = XLSX.read(ab);
      const sh = wb.Sheets[wb.SheetNames[0]!]!;
      const data = XLSX.utils.sheet_to_json<Row>(sh, { defval: "" });
      setRows(toInternalRows(data));
    });
  }

  async function runImport() {
    setProgress("Importando…");
    setProgressPct(15);
    setResult(null);
    try {
      setProgressPct(35);
      const res = await fetch("/api/dashboard/import-productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      setProgressPct(75);
      const j = (await res.json()) as { imported: number; errores: number; detalleErrores: unknown; error?: string };
      if (!res.ok) {
        setProgress(j.error ?? "Error");
        setProgressPct(100);
        return;
      }
      setResult({ imported: j.imported, errores: j.errores, detalle: j.detalleErrores });
      setProgress(`Listo: ${j.imported} importados, ${j.errores} errores.`);
      setProgressPct(100);
    } catch {
      setProgress("Error de red");
      setProgressPct(100);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2">
        <a
          href="/api/templates/csv?tipo=general"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium"
        >
          CSV general
        </a>
        <a href="/api/templates/csv?tipo=remera" className="rounded-lg border px-3 py-2 text-sm">
          CSV remeras
        </a>
        <a href="/api/templates/csv?tipo=pantalon" className="rounded-lg border px-3 py-2 text-sm">
          CSV pantalones
        </a>
        <a href="/api/templates/csv?tipo=calzado" className="rounded-lg border px-3 py-2 text-sm">
          CSV calzado
        </a>
        <a href="/api/templates/xlsx" className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800">
          Excel + instrucciones
        </a>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Archivo .csv o .xlsx</span>
        <input
          type="file"
          accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm"
        />
      </label>
      {rows.length > 0 && (
        <div>
          <p className="text-sm font-bold">Preview (primeras 5 filas)</p>
          <div className="mt-2 max-h-64 overflow-auto rounded border border-zinc-200 text-xs">
            <table className="w-full min-w-[600px] text-left">
              <tbody>
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-1">{r.nombre}</td>
                    <td className="p-1">{r.precio}</td>
                    <td className="p-1">{r.categoria}</td>
                    <td className="p-1">{r.talle}</td>
                    <td className="p-1">{r.color}</td>
                    <td className="p-1">{r.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">Total filas: {rows.length}</p>
          <button
            type="button"
            onClick={() => void runImport()}
            className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white"
          >
            Importar a Supabase
          </button>
        </div>
      )}
      {progress && (
        <div className="space-y-1">
          <p className="text-sm text-zinc-600">{progress}</p>
          <div className="h-2 w-full overflow-hidden rounded bg-zinc-200">
            <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}
      {result && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">
          <p>
            Importados: {result.imported} · Errores: {result.errores}
          </p>
          <pre className="mt-2 max-h-40 overflow-auto text-xs">{JSON.stringify(result.detalle, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
