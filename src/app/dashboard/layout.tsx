import Link from "next/link";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";

const nav = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/pedidos", label: "Pedidos" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Modo pruebas: sin redirect ni sesión; usuario/tienda ficticios
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
      <aside className="shrink-0 md:w-52">
        <p className="mb-1 truncate text-sm font-bold text-white">{DASHBOARD_DEMO.usuario}</p>
        <p className="mb-3 truncate text-xs text-zinc-500">
          {DASHBOARD_DEMO.tienda}
          <span className="ml-1 text-zinc-600">(modo prueba)</span>
        </p>
        <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-accent hover:underline">
            Ver tienda pública
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
