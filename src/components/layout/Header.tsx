"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cartOpen, setCartOpen] = useState(false);
  const count = useCartStore((s) => s.count());

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.push(`/?${params.toString()}`);
    },
    [q, router, searchParams],
  );

  const showSearch = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            La <span className="text-accent">Salada</span>
          </Link>

          {showSearch && (
            <form onSubmit={onSearch} className="order-3 flex w-full flex-1 sm:order-none sm:max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos…"
                className="w-full rounded-l-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
              >
                Buscar
              </button>
            </form>
          )}

          <nav className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Feriantes
            </Link>
            <Link
              href="/auth"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cuenta
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 hover:border-accent"
            >
              Carrito
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-black">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
