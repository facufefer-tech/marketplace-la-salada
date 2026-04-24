import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NuevoProductoForm } from "./NuevoProductoForm";

export default async function DashboardNuevoProductoPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth?next=/dashboard/productos/nuevo");

  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) redirect("/dashboard");

  return (
    <div className="max-w-3xl">
      <NuevoProductoForm />
    </div>
  );
}
