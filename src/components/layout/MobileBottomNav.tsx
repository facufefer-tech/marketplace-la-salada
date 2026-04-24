"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

const items = [
  { href: "/", label: "Inicio", icon: "⌂" },
  { href: "/?focus=search", label: "Buscar", icon: "⌕" },
  { href: "/carrito", label: "Carrito", icon: "🛒" },
  { href: "/auth", label: "Cuenta", icon: "◉" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.count());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-[#0d0d0d]/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href.split("?")[0]!);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex flex-col items-center gap-1 py-2 text-xs ${active ? "text-orange-400" : "text-zinc-400"}`}
            >
              <span className="text-base">{it.icon}</span>
              <span>{it.label}</span>
              {it.label === "Carrito" && count > 0 ? (
                <span className="absolute right-[30%] top-1 rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-black">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
