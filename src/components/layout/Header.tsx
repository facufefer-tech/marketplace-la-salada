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
  const cats = [
    { label: "👕 Remeras", value: "Remeras" },
    { label: "👖 Pantalones", value: "Pantalones" },
    { label: "👗 Vestidos", value: "Vestidos" },
    { label: "👟 Calzado", value: "Calzado" },
    { label: "🧢 Accesorios", value: "Accesorios" },
    { label: "🔥 Ofertas", value: "Ofertas" },
    { label: "🏪 Feriantes", value: "Feriantes" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E0E0E0] bg-white/95 text-[#1A1A1A] shadow-sm backdrop-blur">
        <div className="container-shell flex flex-wrap items-center gap-3 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg border border-[#E0E0E0] px-3 py-1.5 text-xs font-bold text-[#555555] md:hidden"
          >
            ☰
          </button>
          <Link href="/" className="rounded-xl bg-[#FF6B00] px-3 py-1.5 text-2xl font-black tracking-tight text-white">
            La Salada
          </Link>

          {showSearch && (
            <form onSubmit={onSearch} className="order-3 flex w-full flex-1 sm:order-none sm:max-w-2xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar remeras, vestidos, calzado..."
                className="w-full rounded-l-xl border border-[#E0E0E0] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#555555] focus:border-[#FF6B00] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-xl bg-[#FF6B00] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#E05A00]"
              >
                Buscar
              </button>
            </form>
          )}

          <nav className="ml-auto hidden items-center gap-2 sm:gap-3 md:flex">
            <Link
              href="/sobre-nosotros"
              className="rounded-lg px-2 py-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            >
              Sobre nosotros
            </Link>
            <Link
              href="/privacidad"
              className="rounded-lg px-2 py-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            >
              Privacidad
            </Link>
            <Link
              href="/para-feriantes"
              className="rounded-lg px-2 py-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            >
              Para feriantes
            </Link>
            <Link
              href="/envios"
              className="rounded-lg px-2 py-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            >
              Envíos
            </Link>
            <Link
              href="/auth"
              className="rounded-lg px-2 py-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            >
              Cuenta
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg border border-[#E0E0E0] bg-white px-3 py-1.5 text-sm text-[#1A1A1A] hover:border-[#FF6B00]"
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
              if (c.value === "Feriantes") {
                return (
                  <Link key={c.value} href="/feriantes" className="whitespace-nowrap rounded-full bg-[#F5F5F5] px-4 py-1.5 text-xs font-semibold hover:bg-[#FF6B00] hover:text-white">
                    {c.label}
                  </Link>
                );
              }
              if (c.value === "Ofertas") {
                return (
                  <Link key={c.value} href="/?descuento=1" className="whitespace-nowrap rounded-full bg-[#F5F5F5] px-4 py-1.5 text-xs font-semibold hover:bg-[#FF6B00] hover:text-white">
                    {c.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={c.value}
                  href={`/?categoria=${encodeURIComponent(c.value)}`}
                  className="whitespace-nowrap rounded-full bg-[#F5F5F5] px-4 py-1.5 text-xs font-semibold hover:bg-[#FF6B00] hover:text-white"
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        )}
        {menuOpen && (
          <div className="container-shell border-t border-[#E0E0E0] py-2 md:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/sobre-nosotros" className="rounded-lg bg-[#F5F5F5] px-3 py-2" onClick={() => setMenuOpen(false)}>
                Sobre nosotros
              </Link>
              <Link href="/feriantes" className="rounded-lg bg-[#F5F5F5] px-3 py-2" onClick={() => setMenuOpen(false)}>
                Feriantes
              </Link>
              <Link href="/?descuento=1" className="rounded-lg bg-[#F5F5F5] px-3 py-2" onClick={() => setMenuOpen(false)}>
                Ofertas
              </Link>
              <Link href="/auth" className="rounded-lg bg-[#F5F5F5] px-3 py-2" onClick={() => setMenuOpen(false)}>
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
