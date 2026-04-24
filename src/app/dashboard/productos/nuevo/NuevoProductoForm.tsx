"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const talles = ["XS", "S", "M", "L", "XL", "XXL"];
const categorias = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];

export function NuevoProductoForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Remeras");
  const [precioOriginal, setPrecioOriginal] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [tallesSel, setTallesSel] = useState<string[]>([]);
  const [colores, setColores] = useState("");
  const [stock, setStock] = useState("0");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function toggleTalle(t: string) {
    setTallesSel((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      const po = Number(precioOriginal || "0");
      const pd = Number(precioDescuento || "0");
      const final = pd > 0 && pd <= po ? pd : po;
      if (!nombre.trim() || !final) {
        setErr("Completá nombre y precio");
        return;
      }

      const payload = {
        nombre,
        categoria,
        precio: final,
        talle: tallesSel.join(", "),
        color: colores,
        stock: Number(stock || "0"),
        descripcion: `Precio original: $${po.toLocaleString("es-AR")} | ${descripcion}`,
        fotos: fotos.slice(0, 4),
        activo: true,
        destacado: false,
      };

      const res = await fetch("/api/dashboard/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "No se pudo publicar");
        return;
      }
      setOk("Producto publicado correctamente.");
      setNombre("");
      setPrecioOriginal("");
      setPrecioDescuento("");
      setTallesSel([]);
      setColores("");
      setStock("0");
      setDescripcion("");
      setFotos([]);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-zinc-700 bg-[#111111] p-5">
      <h1 className="text-2xl font-black text-white">Nuevo producto</h1>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2" />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2">
        {categorias.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="number" value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} placeholder="Precio original" className="rounded-xl border border-zinc-700 bg-black px-3 py-2" />
        <input type="number" value={precioDescuento} onChange={(e) => setPrecioDescuento(e.target.value)} placeholder="Precio con descuento" className="rounded-xl border border-zinc-700 bg-black px-3 py-2" />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-200">Talles disponibles</p>
        <div className="flex flex-wrap gap-2">
          {talles.map((t) => (
            <label key={t} className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-200">
              <input type="checkbox" checked={tallesSel.includes(t)} onChange={() => toggleTalle(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>
      <input value={colores} onChange={(e) => setColores(e.target.value)} placeholder="Colores disponibles (ej: negro, blanco, azul)" className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2" />
      <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2" />
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows={4} className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2" />

      <div>
        <p className="mb-2 text-sm text-zinc-300">Subir hasta 4 fotos (Cloudinary)</p>
        <div className="mb-2 grid grid-cols-2 gap-2">
          {fotos.map((f) => (
            <div key={f} className="relative h-24 w-full overflow-hidden rounded-lg">
              <Image src={f} alt="Foto del producto" fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
            </div>
          ))}
        </div>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{ sources: ["local"], multiple: true, maxFiles: 4 }}
          onSuccess={(result) => {
            const info = result.info as { secure_url?: string };
            if (info?.secure_url) {
              setFotos((prev) => [...prev, info.secure_url!].slice(0, 4));
            }
          }}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()} className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-bold text-zinc-100">
              Subir fotos
            </button>
          )}
        </CldUploadWidget>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}
      {ok && <p className="text-sm text-emerald-400">{ok}</p>}
      <button disabled={loading} className="rounded-xl bg-orange-500 px-4 py-2 font-black text-white disabled:opacity-60">
        {loading ? "Publicando..." : "Publicar producto"}
      </button>
    </form>
  );
}
