import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminFeriantesPage() {
  const admin = createSupabaseAdminClient();
  const { data: rows, error } = await admin
    .from("tiendas")
    .select("id,slug,nombre,admin_estado,activa, created_at, owner_id")
    .order("created_at", { ascending: false });
  if (error) {
    return <p className="text-red-400">Error: {error.message}</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Feriantes</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="py-2">Tienda</th>
              <th>Estado</th>
              <th>Activa pública</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((t) => {
              const r = t as {
                id: string;
                slug: string;
                nombre: string;
                admin_estado: string;
                activa: boolean;
              };
              return (
                <tr key={r.id} className="border-b border-zinc-800/60">
                  <td className="py-2">
                    <p className="font-medium text-white">{r.nombre}</p>
                    <p className="text-xs text-zinc-500">{r.slug}</p>
                  </td>
                  <td>{r.admin_estado}</td>
                  <td>{r.activa ? "Sí" : "No"}</td>
                  <td className="space-x-2 text-right">
                    <a href={`/api/admin/feriante-estado?accion=activa&id=${r.id}`} className="text-emerald-400">
                      aprobar
                    </a>
                    <a href={`/api/admin/feriante-estado?accion=suspender&id=${r.id}`} className="text-amber-400">
                      suspender
                    </a>
                    <Link href={`/${r.slug}`} className="text-sky-400" target="_blank">
                      ver
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
