"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Producto } from "@/lib/types";

type Props = { initial?: Producto | null };

export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [precio, setPrecio] = useState(String(initial?.precio ?? ""));
  const [categoria, setCategoria] = useState(initial?.categoria ?? "");
  const [talle, setTalle] = useState(initial?.talle ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [stock, setStock] = useState(String(initial?.stock ?? "0"));
  const [fotos, setFotos] = useState<string[]>(initial?.fotos ?? []);
  const [destacado, setDestacado] = useState(Boolean(initial?.destacado));
  const [activo, setActivo] = useState(initial?.activo !== false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(initial?.nombre ?? "");
    setDescripcion(initial?.descripcion ?? "");
    setPrecio(String(initial?.precio ?? ""));
    setCategoria(initial?.categoria ?? "");
    setTalle(initial?.talle ?? "");
    setColor(initial?.color ?? "");
    setStock(String(initial?.stock ?? "0"));
    setFotos(initial?.fotos ?? []);
    setDestacado(Boolean(initial?.destacado));
    setActivo(initial?.activo !== false);
    /* Intencional: solo al cambiar el id del registro editado */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  async function save() {
    setErr(null);
    setLoading(true);
    try {
      const body = {
        id: initial?.id,
        nombre,
        descripcion: descripcion || null,
        precio: Number(precio),
        categoria: categoria || null,
        talle: talle || null,
        color: color || null,
        stock: Number(stock),
        fotos,
        destacado,
        activo,
      };
      const res = await fetch("/api/dashboard/productos", {
        method: initial?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "Error");
        return;
      }
      router.refresh();
      if (!initial?.id) {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setCategoria("");
        setTalle("");
        setColor("");
        setStock("0");
        setFotos([]);
        setDestacado(false);
        setActivo(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-surface p-4">
      <h3 className="text-sm font-semibold text-white">{initial?.id ? "Editar producto" : "Nuevo producto"}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-zinc-400 sm:col-span-2">
          Nombre
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400 sm:col-span-2">
          Descripción
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Precio
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Stock
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Categoría
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Talle
          <input
            value={talle}
            onChange={(e) => setTalle(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-zinc-400">
          Color
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            Destacado
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Activo
          </label>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-zinc-500">Fotos (Cloudinary)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {fotos.map((f) => (
            <span key={f} className="max-w-[200px] truncate rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ sources: ["local"], multiple: true, maxFiles: 5 }}
            onSuccess={(res) => {
              const info = res.info as { secure_url?: string };
              if (info?.secure_url) setFotos((prev) => [...prev, info.secure_url!]);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-white hover:border-accent"
              >
                Subir imágenes
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      <button
        type="button"
        disabled={loading || !nombre.trim()}
        onClick={() => void save()}
        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Guardando…" : initial?.id ? "Actualizar" : "Crear producto"}
      </button>
    </div>
  );
}
