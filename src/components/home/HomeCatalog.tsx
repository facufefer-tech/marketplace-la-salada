"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/home/ProductCard";
import type { Producto } from "@/lib/types";

type Row = Producto & {
  tiendas?: { slug: string; nombre: string; logo_url: string | null } | null;
};

export function HomeCatalog() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    searchParams.forEach((v, k) => {
      if (["q", "categoria", "minPrecio", "maxPrecio", "talle", "color", "tienda"].includes(k)) {
        p.set(k, v);
      }
    });
    return p.toString();
  }, [searchParams]);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams(queryString);
        qs.set("page", String(nextPage));
        const res = await fetch(`/api/productos?${qs.toString()}`);
        const json = await res.json();
        if (json.error && !json.data?.length) setError(json.error);
        const data: Row[] = json.data ?? [];
        setHasMore(Boolean(json.hasMore));
        setPage(nextPage);
        setRows((prev) => (append ? [...prev, ...data] : data));
      } catch {
        setError("No se pudo cargar el catálogo");
      } finally {
        setLoading(false);
      }
    },
    [queryString],
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    void load(0, false);
  }, [load, queryString]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void load(page + 1, true);
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, load, loading, page]);

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
          {error} — Revisá que Supabase tenga las tablas (ver <code className="text-xs">supabase/schema.sql</code>).
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
      {!rows.length && !loading && (
        <p className="py-12 text-center text-sm text-zinc-500">No hay productos con estos filtros.</p>
      )}
      <div ref={sentinel} className="h-8" />
      {loading && <p className="py-4 text-center text-sm text-zinc-500">Cargando…</p>}
    </div>
  );
}
