"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Producto } from "@/lib/types";

const ProductoFotosUpload = dynamic(
  () => import("@/components/dashboard/ProductoFotosUpload").then((m) => m.ProductoFotosUpload),
  { ssr: false },
);

const tallesAll = ["XS", "S", "M", "L", "XL", "XXL"];
const categorias = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];

function parseTalles(s: string | null): string[] {
  if (!s) return [];
  return s
    .split(/[,\s]+/)
    .map((x) => x.trim().toUpperCase())
    .filter((x) => tallesAll.includes(x));
}

type Props = { producto: Producto };

export function EditarProductoApiForm({ producto }: Props) {
  const router = useRouter();
  const lista = producto.precio_lista != null ? Number(producto.precio_lista) : Number(producto.precio);
  const [nombre, setNombre] = useState(producto.nombre);
  const [marca, setMarca] = useState(producto.marca ?? "");
  const [categoria, setCategoria] = useState(producto.categoria ?? "Remeras");
  const [precioLista, setPrecioLista] = useState(String(lista));
  const [precioFinal, setPrecioFinal] = useState(String(producto.precio));
  const [tallesSel, setTallesSel] = useState<string[]>(parseTalles(producto.talle));
  const [colores, setColores] = useState(producto.color ?? "");
  const [stock, setStock] = useState(String(producto.stock));
  const [descripcion, setDescripcion] = useState(producto.descripcion ?? "");
  const [fotos, setFotos] = useState<string[]>(producto.fotos?.length ? producto.fotos : []);
  const [activo, setActivo] = useState(producto.activo);
  const [destacado, setDestacado] = useState(producto.destacado);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function toggleTalle(t: string) {
    setTallesSel((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const pl = Math.max(0, Number(precioLista) || 0);
      const pf = Math.max(0, Number(precioFinal) || 0);
      if (!nombre.trim() || !pf) {
        setMsg("Completá nombre y precio final");
        return;
      }
      const talleStr = tallesSel.sort((a, b) => tallesAll.indexOf(a) - tallesAll.indexOf(b)).join(", ");
      const res = await fetch("/api/dashboard/productos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: producto.id,
          nombre: nombre.trim(),
          marca: marca.trim() || null,
          categoria,
          precio: pf,
          precio_lista: pl > 0 ? pl : null,
          talle: talleStr || null,
          color: colores || null,
          stock: Number(stock) || 0,
          descripcion: descripcion.trim() || null,
          fotos: fotos.filter(Boolean).slice(0, 4),
          activo,
          destacado,
        }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(j.error ?? "Error");
        return;
      }
      setMsg("Cambios guardados.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Nombre</span>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Marca</span>
        <input value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Categoría</span>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2">
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-zinc-700">Precio lista (tachado)</span>
          <input type="number" value={precioLista} onChange={(e) => setPrecioLista(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2" />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-700">Precio final</span>
          <input type="number" value={precioFinal} onChange={(e) => setPrecioFinal(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2" required />
        </label>
      </div>
      <div>
        <span className="text-sm font-medium text-zinc-700">Talles</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {tallesAll.map((t) => (
            <label key={t} className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-sm">
              <input type="checkbox" checked={tallesSel.includes(t)} onChange={() => toggleTalle(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Colores</span>
        <input value={colores} onChange={(e) => setColores(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2" />
      </label>
      <label className="block max-w-xs">
        <span className="text-sm font-medium text-zinc-700">Stock</span>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Descripción</span>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2" />
      </label>
      <div>
        <span className="text-sm font-medium text-zinc-700">Fotos</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {fotos.map((f, i) => (
            <div key={f + i} className="relative aspect-square overflow-hidden rounded-lg border">
              <Image src={f} alt="" fill className="object-cover" sizes="25vw" />
              <button
                type="button"
                onClick={() => setFotos(fotos.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded bg-red-500 px-1.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {fotos.length < 4 && <div className="mt-2"><ProductoFotosUpload fotos={fotos} onChange={setFotos} max={4} /></div>}
      </div>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          Activo
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
          Destacado
        </label>
      </div>
      {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" onClick={() => router.push("/dashboard/productos")} className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm">
          Volver
        </button>
      </div>
    </form>
  );
}
