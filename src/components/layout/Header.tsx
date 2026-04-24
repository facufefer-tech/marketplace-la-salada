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
  const showMenu = !pathname.startsWith("/dashboard") && !pathname.startsWith("/admin");
  const cats = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Ofertas", "Feriantes"];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#111111] text-white">
        <div className="container-shell flex flex-wrap items-center gap-3 py-3">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">
            La <span className="text-accent">Salada</span>
          </Link>

          {showSearch && (
            <form onSubmit={onSearch} className="order-3 flex w-full flex-1 sm:order-none sm:max-w-2xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos…"
                className="w-full rounded-l-xl border border-zinc-700 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
              >
                Buscar
              </button>
            </form>
          )}

          <nav className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/feriantes"
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
        {showMenu && (
          <div className="container-shell flex gap-2 overflow-x-auto pb-3">
            {cats.map((c) => {
              if (c === "Feriantes") {
                return (
                  <Link key={c} href="/feriantes" className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-1.5 text-xs font-semibold hover:bg-orange-500">
                    {c}
                  </Link>
                );
              }
              if (c === "Ofertas") {
                return (
                  <Link key={c} href="/?descuento=1" className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-1.5 text-xs font-semibold hover:bg-orange-500">
                    {c}
                  </Link>
                );
              }
              return (
                <Link
                  key={c}
                  href={`/?categoria=${encodeURIComponent(c)}`}
                  className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-1.5 text-xs font-semibold hover:bg-orange-500"
                >
                  {c}
                </Link>
              );
            })}
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
