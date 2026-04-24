import Link from "next/link";
import type { DemoStore } from "@/lib/demo-data";

export function StoreCard({ store, count }: { store: DemoStore; count: number }) {
  return (
    <Link href={`/${store.slug}`} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:border-orange-300 hover:shadow-md">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700">
        {store.nombre[0]}
      </div>
      <p className="text-sm font-bold text-zinc-900">{store.nombre}</p>
      <p className="mt-1 text-xs text-zinc-500">{count} productos</p>
    </Link>
  );
}
