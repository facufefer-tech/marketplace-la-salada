"use client";

import Papa from "papaparse";
import { useState } from "react";
import * as XLSX from "xlsx";

type Row = Record<string, string>;

export function ImportarClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<{ imported: number; errores: number; detalle: unknown } | null>(null);

  function onFile(f: File | null) {
    if (!f) return;
    setResult(null);
    if (f.name.endsWith(".csv")) {
      Papa.parse<Row>(f, {
        header: true,
        skipEmptyLines: true,
        complete: (r) => setRows((r.data as Row[]).filter((x) => x.nombre && x.precio)),
      });
      return;
    }
    f.arrayBuffer().then((ab) => {
      const wb = XLSX.read(ab);
      const sh = wb.Sheets[wb.SheetNames[0]!]!;
      const data = XLSX.utils.sheet_to_json<Row>(sh, { defval: "" });
      setRows(data.filter((x) => x.nombre && x.precio));
    });
  }

  async function runImport() {
    setProgress("Importando…");
    setResult(null);
    try {
      const res = await fetch("/api/dashboard/import-productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const j = (await res.json()) as { imported: number; errores: number; detalleErrores: unknown; error?: string };
      if (!res.ok) {
        setProgress(j.error ?? "Error");
        return;
      }
      setResult({ imported: j.imported, errores: j.errores, detalle: j.detalleErrores });
      setProgress(`Listo: ${j.imported} importados, ${j.errores} errores.`);
    } catch {
      setProgress("Error de red");
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
      {progress && <p className="text-sm text-zinc-600">{progress}</p>}
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
