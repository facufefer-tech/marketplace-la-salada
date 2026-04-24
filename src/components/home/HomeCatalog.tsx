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
  const [visible, setVisible] = useState(12);
  const [loading, setLoading] = useState(true);
  const [sourceProducts, setSourceProducts] = useState(demoProducts);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void (async () => {
      try {
        const res = await fetch("/api/productos?page=0", { cache: "no-store" });
        const j = (await res.json()) as { data?: typeof demoProducts };
        if (!active) return;
        if (res.ok && Array.isArray(j.data) && j.data.length > 0) {
          setSourceProducts(j.data);
        } else {
          setSourceProducts(demoProducts);
        }
      } catch {
        if (active) setSourceProducts(demoProducts);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) setCategoria(cat);
    const query = searchParams.get("q");
    if (query) setQ(query);
    setSoloOfertas(searchParams.get("descuento") === "1");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const tm = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(tm);
  }, [q, categoria, soloOfertas, minPrecio, maxPrecio, talle, color, sourceProducts]);

  const coloresU = useMemo(() => {
    const s = new Set<string>();
    sourceProducts.forEach((p) => {
      if (p.color) s.add(p.color);
    });
    return ["Todos", ...Array.from(s).sort((a, b) => a.localeCompare(b, "es"))];
  }, [sourceProducts]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return sourceProducts.filter((p) => {
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
  }, [q, categoria, soloOfertas, minPrecio, maxPrecio, talle, color, sourceProducts]);
  const visibleItems = filtered.slice(0, visible);

  return (
    <section className="container-shell space-y-6">
      <div className="rounded-2xl border border-[#E0E0E0] bg-[#F5F5F5] p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">Filtros en vivo</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm text-[#555555]">
            Buscar
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, marca, categoría…"
              className="mt-1 w-full rounded-xl border border-[#E0E0E0] bg-white px-3 py-2 text-[#1A1A1A]"
            />
          </label>
          <label className="block text-sm text-[#555555]">
            Categoría
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E0E0E0] bg-white px-3 py-2 text-[#1A1A1A]"
            >
              {CATS.map((c) => (
                <option key={c} value={c === "Todas" ? "Todas" : c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-[#555555]">
            <input type="checkbox" checked={soloOfertas} onChange={(e) => setSoloOfertas(e.target.checked)} className="rounded" />
            Solo ofertas fuertes (≥25% off)
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#555555]">
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
            <label className="text-sm text-[#555555]">
              Talle
              <select value={talle} onChange={(e) => setTalle(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E0E0E0] bg-white px-2 py-2 text-[#1A1A1A] text-sm">
                {TALLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[#555555]">
              Color
              <select value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E0E0E0] bg-white px-2 py-2 text-[#1A1A1A] text-sm">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Catálogo</p>
          <h2 className="text-3xl font-black text-[#1A1A1A]">Productos</h2>
          <p className="text-sm text-[#555555]">{filtered.length} resultados</p>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white">
              <div className="skeleton aspect-[4/5]" />
              <div className="space-y-2 p-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visibleItems.map((p, i) => (
            <div key={p.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
      {!loading && visibleItems.length < filtered.length ? (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 8)}
            className="rounded-xl border border-[#E0E0E0] px-5 py-2 text-sm font-semibold text-[#1A1A1A] hover:border-[#F97316] hover:text-[#F97316]"
          >
            Cargar más productos
          </button>
        </div>
      ) : null}
      {!filtered.length && <p className="mt-4 text-center text-sm text-zinc-400">No encontramos productos con esos filtros.</p>}
    </section>
  );
}
