"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts } from "@/lib/demo-data";

const CATS = ["Todas", "Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];
const TALLES = ["Todos", "XS", "S", "M", "L", "XL", "XXL"];
const MAX_P = 150000;
const MIN_P = 0;

export function HomeCatalog() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [minPrecio, setMinPrecio] = useState(MIN_P);
  const [maxPrecio, setMaxPrecio] = useState(MAX_P);
  const [talle, setTalle] = useState("Todos");
  const [color, setColor] = useState("Todos");

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) setCategoria(cat);
    const query = searchParams.get("q");
    if (query) setQ(query);
    setSoloOfertas(searchParams.get("descuento") === "1");
  }, [searchParams]);

  const coloresU = useMemo(() => {
    const s = new Set<string>();
    demoProducts.forEach((p) => {
      if (p.color) s.add(p.color);
    });
    return ["Todos", ...Array.from(s).sort((a, b) => a.localeCompare(b, "es"))];
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return demoProducts.filter((p) => {
      if (categoria !== "Todas" && p.categoria !== categoria) return false;
      if (soloOfertas && (!p.descuentoPct || p.descuentoPct < 25)) return false;
      const pr = Number(p.precio);
      if (pr < minPrecio || pr > maxPrecio) return false;
      if (talle !== "Todos") {
        if (!p.talle) return false;
        const parts = p.talle
          .split(/[,\s]+/)
          .map((x) => x.trim().toUpperCase())
          .filter(Boolean);
        const want = talle.toUpperCase();
        if (!parts.includes(want) && p.talle.toUpperCase() !== want) return false;
      }
      if (color !== "Todos" && p.color !== color) return false;
      if (
        ql &&
        !`${p.nombre} ${p.descripcion} ${p.marca ?? ""} ${p.categoria ?? ""}`.toLowerCase().includes(ql)
      ) {
        return false;
      }
      return true;
    });
  }, [q, categoria, soloOfertas, minPrecio, maxPrecio, talle, color]);

  return (
    <section className="container-shell space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">Filtros en vivo</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm text-zinc-300">
            Buscar
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, marca, categoría…"
              className="mt-1 w-full rounded-xl border border-zinc-600 bg-[#0a0a0a] px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm text-zinc-300">
            Categoría
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-600 bg-[#0a0a0a] px-3 py-2 text-white"
            >
              {CATS.map((c) => (
                <option key={c} value={c === "Todas" ? "Todas" : c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={soloOfertas} onChange={(e) => setSoloOfertas(e.target.checked)} className="rounded" />
            Solo ofertas fuertes (≥25% off)
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-400">
              Rango de precio: ${minPrecio.toLocaleString("es-AR")} — ${maxPrecio.toLocaleString("es-AR")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                type="range"
                min={0}
                max={MAX_P}
                step={1000}
                value={minPrecio}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setMinPrecio(Math.min(v, maxPrecio));
                }}
                className="min-w-[120px] flex-1"
              />
              <input
                type="range"
                min={0}
                max={MAX_P}
                step={1000}
                value={maxPrecio}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setMaxPrecio(Math.max(v, minPrecio));
                }}
                className="min-w-[120px] flex-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-zinc-300">
              Talle
              <select value={talle} onChange={(e) => setTalle(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-600 bg-[#0a0a0a] px-2 py-2 text-white text-sm">
                {TALLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-300">
              Color
              <select value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-600 bg-[#0a0a0a] px-2 py-2 text-white text-sm">
                {coloresU.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Catálogo</p>
          <h2 className="text-3xl font-black text-white">Productos</h2>
          <p className="text-sm text-zinc-500">{filtered.length} resultados</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
      {!filtered.length && <p className="mt-4 text-center text-sm text-zinc-400">No encontramos productos con esos filtros.</p>}
    </section>
  );
}
