import type { DemoProduct } from "@/lib/demo-data";

const KEY_DELETED = "ls-dashboard-deleted-product-ids";
const keyOverride = (id: string) => `ls-dashboard-product-${id}`;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getDeletedProductIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const ids = safeParse<string[]>(localStorage.getItem(KEY_DELETED), []);
  return new Set(ids);
}

export function addDeletedProductId(id: string) {
  if (typeof window === "undefined") return;
  const s = getDeletedProductIds();
  s.add(id);
  localStorage.setItem(KEY_DELETED, JSON.stringify(Array.from(s)));
}

export function getProductOverride(id: string): Partial<DemoProduct> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(keyOverride(id));
  if (!raw) return null;
  return safeParse<Partial<DemoProduct>>(raw, {});
}

export function setProductOverride(id: string, patch: Partial<DemoProduct>) {
  if (typeof window === "undefined") return;
  const prev = getProductOverride(id) ?? {};
  const merged = { ...prev, ...patch };
  localStorage.setItem(keyOverride(id), JSON.stringify(merged));
}

export function mergeDemoProduct(base: DemoProduct): DemoProduct {
  const o = getProductOverride(base.id);
  if (!o || Object.keys(o).length === 0) return base;
  return { ...base, ...o, fotos: o.fotos !== undefined ? o.fotos : base.fotos };
}
