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
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore((s) => s.count());

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const term = q.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("q", term);
      else params.delete("q");
      const qs = params.toString();
      /* Sin "?" suelto: asegura que /?q=... recarga el listado con filtros */
      router.push(qs ? `/?${qs}` : "/");
      router.refresh();
    },
    [q, router, searchParams],
  );

  const showSearch = pathname === "/";
  const showMenu = !pathname.startsWith("/dashboard") && !pathname.startsWith("/admin");
  const cats = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Ofertas", "Feriantes"];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#101010]/95 text-white backdrop-blur">
        <div className="container-shell flex flex-wrap items-center gap-3 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 md:hidden"
          >
            ☰
          </button>
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            La <span className="text-orange-500">Salada</span>
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
                className="rounded-r-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-orange-400"
              >
                Buscar
              </button>
            </form>
          )}

          <nav className="ml-auto hidden items-center gap-2 sm:gap-3 md:flex">
            <Link
              href="/sobre-nosotros"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Sobre nosotros
            </Link>
            <Link
              href="/privacidad"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Privacidad
            </Link>
            <Link
              href="/para-feriantes"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Para feriantes
            </Link>
            <Link
              href="/envios"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Envíos
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
        {menuOpen && (
          <div className="container-shell border-t border-zinc-800 py-2 md:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/sobre-nosotros" className="rounded-lg bg-zinc-900 px-3 py-2" onClick={() => setMenuOpen(false)}>
                Sobre nosotros
              </Link>
              <Link href="/feriantes" className="rounded-lg bg-zinc-900 px-3 py-2" onClick={() => setMenuOpen(false)}>
                Feriantes
              </Link>
              <Link href="/?descuento=1" className="rounded-lg bg-zinc-900 px-3 py-2" onClick={() => setMenuOpen(false)}>
                Ofertas
              </Link>
              <Link href="/auth" className="rounded-lg bg-zinc-900 px-3 py-2" onClick={() => setMenuOpen(false)}>
                Mi cuenta
              </Link>
            </div>
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
