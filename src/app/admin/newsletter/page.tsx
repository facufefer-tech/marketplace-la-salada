import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("newsletters").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) {
    return <p className="text-red-400">Tabla no disponible: {error.message}</p>;
  }
  const csv = [
    ["email", "nombre", "activo", "creado"].join(","),
    ...(data ?? []).map((r) => {
      const x = r as { email: string; nombre: string; activo: boolean; created_at: string };
      return [x.email, x.nombre ?? "", x.activo ? "1" : "0", x.created_at].join(",");
    }),
  ].join("\n");
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Newsletter</h1>
      <p className="mt-1 text-sm text-zinc-500">{(data ?? []).length} suscriptores</p>
      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download="newsletter-export.csv"
        className="mt-3 inline-block rounded bg-orange-500 px-4 py-2 text-sm font-bold text-black"
      >
        Descargar CSV
      </a>
      <ul className="mt-4 max-h-[480px] space-y-1 overflow-y-auto text-sm text-zinc-300">
        {(data ?? []).slice(0, 100).map((r) => {
          const x = r as { id: string; email: string; nombre: string | null; created_at: string };
          return (
            <li key={x.id} className="border-b border-zinc-800 py-1">
              {x.email} — {x.nombre} — {new Date(x.created_at).toLocaleString("es-AR")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
