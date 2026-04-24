import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MiTiendaSupabaseForm } from "./MiTiendaSupabaseForm";

export default async function MiTiendaPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/dashboard/tienda");

  const { data: tienda } = await supabase.from("tiendas").select("*").eq("owner_id", user.id).maybeSingle();

  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mi tienda</h1>
        <p className="mt-1 text-sm text-zinc-500">Datos públicos, envíos y branding. Se guardan en Supabase.</p>
      </div>
      <MiTiendaSupabaseForm initial={tienda} />
    </div>
  );
}
