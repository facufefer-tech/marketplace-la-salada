import Image from "next/image";
import Link from "next/link";
import type { DemoStore } from "@/lib/demo-data";

export function StoreCard({ store, count }: { store: DemoStore; count: number }) {
  return (
    <Link href={`/${store.slug}`} className="rounded-2xl border border-zinc-700 bg-[#111111] p-4 shadow-sm hover:border-orange-500">
      <div className="relative mb-3 h-12 w-12 overflow-hidden rounded-full border border-zinc-700">
        <Image src={store.avatarUrl} alt={store.owner} fill className="object-cover" sizes="48px" />
      </div>
      <p className="text-sm font-bold text-white">{store.nombre}</p>
      <p className="mt-1 text-xs text-zinc-400">{store.owner}</p>
      <p className="mt-1 text-xs text-zinc-500">{count} productos · ⭐ {store.rating.toFixed(1)}</p>
    </Link>
  );
}
