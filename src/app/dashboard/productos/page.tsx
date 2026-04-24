import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { DashboardProductosClient } from "@/components/dashboard/DashboardProductosClient";
import type { Producto } from "@/lib/types";

export default async function DashboardProductosPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tienda } = await supabase.from("tiendas").select("*").eq("owner_id", user!.id).maybeSingle();

  if (!tienda) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white">Productos</h1>
        <p className="mt-2 text-sm text-zinc-500">Primero creá tu tienda.</p>
        <div className="mt-6 max-w-lg">
          <OnboardingWizard />
        </div>
      </div>
    );
  }

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tienda.id)
    .order("created_at", { ascending: false });

  const list = (productos ?? []) as Producto[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Productos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tienda:{" "}
          <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
            /{tienda.slug}
          </Link>
        </p>
      </div>

      <DashboardProductosClient productos={list} />
    </div>
  );
}
