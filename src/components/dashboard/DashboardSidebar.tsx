"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/importar", label: "Importar CSV" },
  { href: "/dashboard/promociones", label: "Promociones" },
  { href: "/dashboard/pedidos", label: "Pedidos" },
  { href: "/dashboard/tienda", label: "Mi tienda" },
  { href: "/dashboard/resenas", label: "Reseñas" },
  { href: "/dashboard/estadisticas", label: "Estadísticas" },
];

type Props = { tiendaNombre: string; userEmail: string; publicSlug: string };

export function DashboardSidebar({ tiendaNombre, userEmail, publicSlug }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-zinc-800 px-1 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Panel de ventas</p>
        <p className="mt-1 truncate text-lg font-bold text-white">{tiendaNombre}</p>
        <p className="mt-0.5 truncate text-sm text-zinc-400">{userEmail}</p>
      </div>
      <nav className="mt-6 flex flex-1 flex-col gap-0.5">
        {nav.map((n) => {
          const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              className={
                active
                  ? "rounded-lg bg-zinc-800 px-3 py-2.5 text-sm font-semibold text-white"
                  : "rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800/80 hover:text-white"
              }
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-zinc-800 pt-4">
        {publicSlug ? (
          <Link
            href={`/${publicSlug}`}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-orange-400 transition hover:bg-zinc-800 hover:text-orange-300"
          >
            Ver mi vitrina
          </Link>
        ) : null}
        <Link href="/" className="mt-1 block rounded-lg px-3 py-2 text-xs text-zinc-500 transition hover:text-zinc-300">
          ← Volver al marketplace
        </Link>
      </div>
    </div>
  );
}
