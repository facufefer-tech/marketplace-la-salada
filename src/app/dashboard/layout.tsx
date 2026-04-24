import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const nav = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/pedidos", label: "Pedidos" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/dashboard");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
      <aside className="shrink-0 md:w-52">
        <p className="mb-3 truncate text-xs text-zinc-500">{user.email}</p>
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
