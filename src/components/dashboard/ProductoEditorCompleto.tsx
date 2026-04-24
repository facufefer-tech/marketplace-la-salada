"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GaleriaFotosDnd } from "@/components/dashboard/GaleriaFotosDnd";
import type { Producto, ProductVariant } from "@/lib/types";

const ProductoFotosUpload = dynamic(
  () => import("@/components/dashboard/ProductoFotosUpload").then((m) => m.ProductoFotosUpload),
  { ssr: false },
);

const categorias = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];

type VarRow = {
  talle: string;
  color: string;
  stock: string;
  precio_extra: string;
  precio_override: string;
  sku: string;
};

type Props = { producto: Producto; initialVariants: ProductVariant[] };

function toVarRows(v: ProductVariant[]): VarRow[] {
  if (!v.length) return [{ talle: "M", color: "Único", stock: "0", precio_extra: "0", precio_override: "", sku: "" }];
  return v.map((x) => ({
    talle: x.talle,
    color: x.color,
    stock: String(x.stock),
    precio_extra: String(x.precio_extra),
    precio_override: x.precio_override != null ? String(x.precio_override) : "",
    sku: x.sku ?? "",
  }));
}

export function ProductoEditorCompleto({ producto, initialVariants }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState(producto.nombre);
  const [sku, setSku] = useState(producto.sku ?? "");
  const [marca, setMarca] = useState(producto.marca ?? "");
  const [categoria, setCategoria] = useState(producto.categoria ?? "Remeras");
  const [material, setMaterial] = useState(producto.material ?? "");
  const [genero, setGenero] = useState(producto.genero ?? "unisex");
  const [temporada, setTemporada] = useState(producto.temporada ?? "todo el año");
  const [peso, setPeso] = useState(producto.peso_gramos != null ? String(producto.peso_gramos) : "");
  const [etiquetas, setEtiquetas] = useState((producto.etiquetas ?? []).join(", "));
  const [seoTit, setSeoTit] = useState(producto.seo_titulo ?? "");
  const [seoDesc, setSeoDesc] = useState(producto.seo_descripcion ?? "");
  const [precioLista, setPrecioLista] = useState(
    producto.precio_lista != null ? String(producto.precio_lista) : String(producto.precio),
  );
  const [precioFinal, setPrecioFinal] = useState(String(producto.precio));
  const [precioMayorista, setPrecioMayorista] = useState(
    producto.precio_mayorista != null ? String(producto.precio_mayorista) : "",
  );
  const [precioPromocional, setPrecioPromocional] = useState(
    producto.precio_promocional != null ? String(producto.precio_promocional) : "",
  );
  const [tallasTxt, setTallasTxt] = useState((producto.tallas ?? []).join(", "));
  const [coloresTxt, setColoresTxt] = useState((producto.colores ?? []).join(", "));
  const [descripcion, setDescripcion] = useState(producto.descripcion ?? "");
  const [fotos, setFotos] = useState<string[]>(producto.fotos?.length ? producto.fotos.slice(0, 8) : []);
  const [fotoPrincipal, setFotoPrincipal] = useState(producto.foto_principal_index ?? 0);
  const [estadoPub, setEstadoPub] = useState(
    (producto.estado_publicacion as "publicado" | "borrador" | "agotado") ?? "publicado",
  );
  const [activo, setActivo] = useState(producto.activo);
  const [destacado, setDestacado] = useState(producto.destacado);
  const [variantRows, setVariantRows] = useState<VarRow[]>(toVarRows(initialVariants));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const slug = producto.tiendas?.slug;

  const variantsPayload = useMemo(() => {
    return variantRows
      .filter((r) => r.talle || r.color)
      .map((r) => ({
        talle: r.talle || "Único",
        color: r.color || "Único",
        stock: Math.max(0, parseInt(r.stock, 10) || 0),
        precio_extra: Math.max(0, parseFloat(r.precio_extra) || 0),
        precio_override: r.precio_override ? parseFloat(r.precio_override) : null,
        sku: r.sku || null,
        activo: true,
      }));
  }, [variantRows]);

  async function save(e: React.FormEvent) {
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
      const res = await fetch("/api/dashboard/productos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: producto.id,
          nombre: nombre.trim(),
          sku: sku.trim() || null,
          marca: marca.trim() || null,
          categoria,
          material: material.trim() || null,
          genero: genero.trim() || null,
          temporada: temporada.trim() || null,
          peso_gramos: peso ? parseInt(peso, 10) : null,
          etiquetas: etiquetas
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean),
          seo_titulo: seoTit.trim() || null,
          seo_descripcion: seoDesc.trim() || null,
          precio: pf,
          precio_lista: pl > pf ? pl : null,
          precio_mayorista: precioMayorista ? Number(precioMayorista) : null,
          precio_promocional: precioPromocional ? Number(precioPromocional) : null,
          descripcion: descripcion.trim() || null,
          tallas: tallasTxt
            .split(/[,;/]/)
            .map((s) => s.trim())
            .filter(Boolean),
          colores: coloresTxt
            .split(/[,;/]/)
            .map((s) => s.trim())
            .filter(Boolean),
          fotos: fotos.filter(Boolean).slice(0, 8),
          foto_principal_index: fotoPrincipal,
          estado_publicacion: estadoPub,
          activo,
          destacado,
          talle: null,
          color: null,
          stock: 0,
          variants: variantsPayload,
        }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(j.error ?? "Error");
        return;
      }
      setMsg("Guardado.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900">Ficha y precios</h2>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-zinc-700">SKU</span>
            <input value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Marca</span>
            <input value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm">Precio mayorista</span>
            <input type="number" value={precioMayorista} onChange={(e) => setPrecioMayorista(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label>
            <span className="text-sm">Precio promocional</span>
            <input type="number" value={precioPromocional} onChange={(e) => setPrecioPromocional(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm">Tallas (coma separada)</span>
            <input value={tallasTxt} onChange={(e) => setTallasTxt(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label>
            <span className="text-sm">Colores (coma separada)</span>
            <input value={coloresTxt} onChange={(e) => setColoresTxt(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </div>
        <label>
          <span className="text-sm font-medium text-zinc-700">Categoría</span>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm">Precio referencia (tachado)</span>
            <input type="number" value={precioLista} onChange={(e) => setPrecioLista(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label>
            <span className="text-sm">Precio final</span>
            <input type="number" value={precioFinal} onChange={(e) => setPrecioFinal(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" required />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm">Material</span>
            <input value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label>
            <span className="text-sm">Peso (g)</span>
            <input value={peso} onChange={(e) => setPeso(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm">Género</span>
            <select value={genero} onChange={(e) => setGenero(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="unisex">Unisex</option>
              <option value="niños">Niños</option>
            </select>
          </label>
          <label>
            <span className="text-sm">Temporada</span>
            <select value={temporada} onChange={(e) => setTemporada(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
              <option value="todo el año">Todo el año</option>
            </select>
          </label>
        </div>
        <label>
          <span className="text-sm">Etiquetas (separar por comas)</span>
          <input value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label>
          <span className="text-sm">Descripción</span>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <h2 className="pt-2 text-lg font-bold text-zinc-900">SEO</h2>
        <label>
          <span className="text-sm">Título SEO</span>
          <input value={seoTit} onChange={(e) => setSeoTit(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label>
          <span className="text-sm">Descripción SEO</span>
          <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <h2 className="pt-2 text-lg font-bold text-zinc-900">Estado de publicación</h2>
        <div className="flex flex-wrap gap-2">
          {(["publicado", "borrador", "agotado"] as const).map((e) => (
            <label key={e} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm">
              <input type="radio" name="est" checked={estadoPub === e} onChange={() => setEstadoPub(e)} />
              {e}
            </label>
          ))}
        </div>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Publicado (activo)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            Destacado
          </label>
        </div>
        <h2 className="pt-2 text-lg font-bold text-zinc-900">Galería (arrastrá para ordenar) · {fotos.length}/8</h2>
        <GaleriaFotosDnd fotos={fotos} principalIndex={fotoPrincipal} onChange={(next, p) => { setFotos(next); setFotoPrincipal(p); }} />
        <div>
          <p className="text-sm text-zinc-500">Subir a Cloudinary</p>
          <div className="mt-1">
            <ProductoFotosUpload fotos={fotos} onChange={setFotos} max={8} />
          </div>
        </div>
        <h2 className="pt-2 text-lg font-bold text-zinc-900">Variantes (talle + color + stock + ajuste precio)</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-zinc-500">
                <th className="py-1">Talle</th>
                <th>Color</th>
                <th>Stock</th>
                <th>+Precio (extra)</th>
                <th>Precio fijo (opcional)</th>
                <th>SKU</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {variantRows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="py-1">
                    <input
                      className="w-20 rounded border px-1"
                      value={row.talle}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, talle: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="w-24 rounded border px-1"
                      value={row.color}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, color: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="w-16 rounded border px-1"
                      value={row.stock}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, stock: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="w-20 rounded border px-1"
                      value={row.precio_extra}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, precio_extra: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="w-20 rounded border px-1"
                      placeholder="vacío=base+extra"
                      value={row.precio_override}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, precio_override: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="w-24 rounded border px-1"
                      value={row.sku}
                      onChange={(e) => {
                        const n = [...variantRows];
                        n[i] = { ...n[i]!, sku: e.target.value };
                        setVariantRows(n);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setVariantRows((r) => r.filter((_, j) => j !== i))}
                      className="text-rose-600"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() =>
            setVariantRows((r) => [...r, { talle: "M", color: "Nuevo", stock: "0", precio_extra: "0", precio_override: "", sku: "" }])
          }
          className="text-sm text-orange-600"
        >
          + Agregar variante
        </button>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
        >
          {saving ? "Guardando…" : "Guardar producto"}
        </button>
      </div>
      <div className="space-y-3 lg:sticky lg:top-4 lg:h-fit">
        <h2 className="text-lg font-bold text-zinc-900">Preview en vivo (marketplace)</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-[#111] p-3 text-white shadow">
          <div className="relative aspect-[4/5] w-full max-w-sm bg-zinc-800">
            {fotos[fotoPrincipal] ? (
              <Image src={fotos[fotoPrincipal]!} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">Sin foto</div>
            )}
          </div>
          <p className="mt-2 line-clamp-2 font-bold">{nombre || "Nombre"}</p>
          {marca && <p className="text-xs text-orange-300">{marca}</p>}
          <p className="text-lg font-black text-white">
            ${(Number(precioFinal) || 0).toLocaleString("es-AR")}{" "}
            {Number(precioLista) > Number(precioFinal) && (
              <span className="text-sm text-zinc-500 line-through">${(Number(precioLista) || 0).toLocaleString("es-AR")}</span>
            )}
          </p>
          <p className="text-xs text-zinc-500">{estadoPub === "borrador" ? "Borrador (no visible en catálogo)" : "Vitrina pública"}</p>
        </div>
        {slug && (
          <Link
            href={`/${slug}/producto/${producto.id}`}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-sm text-orange-600 underline"
          >
            Abrir ficha pública
          </Link>
        )}
      </div>
    </form>
  );
}
