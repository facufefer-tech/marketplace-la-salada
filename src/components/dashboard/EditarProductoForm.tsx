"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { DemoProduct } from "@/lib/demo-data";
import { mergeDemoProduct, setProductOverride } from "@/lib/dashboard-product-demo-storage";

const tallesAll = ["XS", "S", "M", "L", "XL", "XXL"];
const categorias = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];

function parseTalles(s: string | null): string[] {
  if (!s) return [];
  return s
    .split(/[,\s]+/)
    .map((x) => x.trim().toUpperCase())
    .filter((x) => tallesAll.includes(x));
}

type Props = { base: DemoProduct };

export function EditarProductoForm({ base }: Props) {
  const router = useRouter();
  const initial = useMemo(() => mergeDemoProduct(base), [base]);

  const [nombre, setNombre] = useState(initial.nombre);
  const [categoria, setCategoria] = useState(initial.categoria ?? "Remeras");
  const [precioOriginal, setPrecioOriginal] = useState(String(initial.precioOriginal));
  const [precioDescuento, setPrecioDescuento] = useState(String(initial.precio));
  const [tallesSel, setTallesSel] = useState<string[]>(parseTalles(initial.talle));
  const [colores, setColores] = useState(initial.color ?? "");
  const [stock, setStock] = useState(String(initial.stock));
  const [descripcion, setDescripcion] = useState(initial.descripcion ?? "");
  const [fotos, setFotos] = useState<string[]>(initial.fotos.length ? initial.fotos : []);
  const [activo, setActivo] = useState(initial.activo);
  const [destacado, setDestacado] = useState(initial.destacado);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    const m = mergeDemoProduct(base);
    setNombre(m.nombre);
    setCategoria(m.categoria ?? "Remeras");
    setPrecioOriginal(String(m.precioOriginal));
    setPrecioDescuento(String(m.precio));
    setTallesSel(parseTalles(m.talle));
    setColores(m.color ?? "");
    setStock(String(m.stock));
    setDescripcion(m.descripcion ?? "");
    setFotos(m.fotos.length ? m.fotos : []);
    setActivo(m.activo);
    setDestacado(m.destacado);
  }, [base]);

  function toggleTalle(t: string) {
    setTallesSel((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function removeFoto(i: number) {
    setFotos((prev) => prev.filter((_, j) => j !== i).slice(0, 4));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setSaving(true);
    try {
      const po = Math.max(0, Number(precioOriginal) || 0);
      const pd = Math.max(0, Number(precioDescuento) || 0);
      const final = pd > 0 && pd <= po ? pd : po;
      if (!nombre.trim() || !final) {
        setOk(null);
        return;
      }
      const talleStr = tallesSel.sort((a, b) => tallesAll.indexOf(a) - tallesAll.indexOf(b)).join(", ");
      const descPct = po > 0 && po > final ? Math.round(((po - final) / po) * 100) : 0;
      setProductOverride(base.id, {
        nombre: nombre.trim(),
        categoria,
        precio: final,
        precioOriginal: po,
        descuentoPct: descPct,
        talle: talleStr,
        color: colores,
        stock: Number(stock) || 0,
        descripcion: descripcion.trim() || null,
        fotos: fotos.filter(Boolean).slice(0, 4),
        activo,
        destacado,
      } as Partial<DemoProduct>);
      setOk("Cambios guardados en este navegador (demo).");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Categoría</span>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Precio original</span>
            <input
              type="number"
              value={precioOriginal}
              onChange={(e) => setPrecioOriginal(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 tabular-nums text-zinc-900 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Precio con descuento</span>
            <input
              type="number"
              value={precioDescuento}
              onChange={(e) => setPrecioDescuento(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 tabular-nums text-zinc-900 shadow-sm"
            />
          </label>
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-700">Talles</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {tallesAll.map((t) => (
            <label
              key={t}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={tallesSel.includes(t)}
                onChange={() => toggleTalle(t)}
                className="rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Colores</span>
        <input
          value={colores}
          onChange={(e) => setColores(e.target.value)}
          placeholder="Negro, Blanco, Azul"
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
        />
      </label>

      <label className="block max-w-xs">
        <span className="text-sm font-medium text-zinc-700">Stock</span>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 tabular-nums text-zinc-900 shadow-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Descripción</span>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-zinc-700">Fotos (hasta 4)</span>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fotos.map((url, i) => (
            <div key={i} className="relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200">
                {url ? (
                  <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 20vw" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeFoto(i)}
                className="mt-1 w-full rounded border border-zinc-200 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        {fotos.length < 4 && (
          <div className="mt-2">
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign"
              options={{ sources: ["local"], multiple: true, maxFiles: 4 - fotos.length }}
              onSuccess={(result) => {
                const info = result.info as { secure_url?: string };
                if (info?.secure_url) {
                  setFotos((prev) => [...prev, info.secure_url!].slice(0, 4));
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-orange-400 hover:text-orange-700"
                >
                  Subir imagen
                </button>
              )}
            </CldUploadWidget>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-orange-500"
          />
          <span className="text-sm font-medium text-zinc-800">Activo</span>
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={destacado}
            onChange={(e) => setDestacado(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-orange-500"
          />
          <span className="text-sm font-medium text-zinc-800">Destacado</span>
        </label>
      </div>

      {ok && <p className="text-sm font-medium text-emerald-600">{ok}</p>}

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/productos")}
          className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Volver
        </button>
      </div>
    </form>
  );
}
