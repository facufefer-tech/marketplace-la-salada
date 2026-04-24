import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/admin";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user.email)) {
    redirect("/dashboard");
  }

  let tiendasCount = 0;
  let productosCount = 0;
  let publicidad: { id: string; tipo: string | null; activa: boolean }[] = [];

  try {
    const admin = createSupabaseAdminClient();
    const [{ count: tc }, { count: pc }, { data: pub }] = await Promise.all([
      admin.from("tiendas").select("*", { count: "exact", head: true }),
      admin.from("productos").select("*", { count: "exact", head: true }),
      admin.from("publicidad").select("id, tipo, activa").limit(50),
    ]);
    tiendasCount = tc ?? 0;
    productosCount = pc ?? 0;
    publicidad = pub ?? [];
  } catch {
    /* service role inválido o tablas inexistentes */
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Panel administrador</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Acceso restringido por variable <code className="text-zinc-400">ADMIN_EMAILS</code> (emails separados por coma
        en <code className="text-zinc-400">.env.local</code>).
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-surface p-4">
          <p className="text-sm text-zinc-500">Tiendas</p>
          <p className="text-3xl font-semibold text-white">{tiendasCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-surface p-4">
          <p className="text-sm text-zinc-500">Productos</p>
          <p className="text-3xl font-semibold text-white">{productosCount}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Publicidad (muestra)</h2>
        {!publicidad.length ? (
          <p className="mt-2 text-sm text-zinc-500">Sin registros o sin acceso admin a la tabla.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {publicidad.map((p) => (
              <li key={p.id} className="rounded border border-zinc-800 px-3 py-2">
                {p.tipo ?? "sin tipo"} — {p.activa ? "activa" : "inactiva"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/" className="mt-10 inline-block text-sm text-accent hover:underline">
        Volver al marketplace
      </Link>
    </main>
  );
}
