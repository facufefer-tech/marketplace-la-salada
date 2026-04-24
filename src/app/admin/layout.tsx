import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/admin/dashboard", label: "Métricas" },
  { href: "/admin/feriantes", label: "Feriantes" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/reportes", label: "Reportes" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-zinc-100">
      <div className="border-b border-zinc-800 bg-[#111]">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="text-lg font-black text-white">
            Admin <span className="text-orange-500">La Salada</span>
          </p>
          <nav className="flex flex-wrap gap-2 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link href="/" className="rounded-lg px-2 py-1 text-zinc-500">
              Marketplace
            </Link>
          </nav>
        </div>
      </div>
      <div className="container-shell py-8">{children}</div>
    </div>
  );
}
