import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminAllProductosPage() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("productos")
    .select("id,nombre,activo,destacado,tienda_id, tiendas(nombre,slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    return <p className="text-red-400">{error.message}</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Todos los productos</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="py-2">Producto</th>
              <th>Tienda</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => {
              const r = p as {
                id: string;
                nombre: string;
                activo: boolean;
                destacado: boolean;
                tiendas: { nombre: string; slug: string } | { nombre: string; slug: string }[] | null;
              };
              const t = r.tiendas
                ? Array.isArray(r.tiendas)
                  ? r.tiendas[0]
                  : r.tiendas
                : null;
              return (
                <tr key={r.id} className="border-b border-zinc-800/50">
                  <td className="py-2 text-white">{r.nombre}</td>
                  <td>{t?.nombre}</td>
                  <td>
                    {r.activo ? "on" : "off"} {r.destacado ? "· destacado" : ""}
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
