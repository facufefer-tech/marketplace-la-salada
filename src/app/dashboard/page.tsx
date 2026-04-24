import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

export default async function DashboardHomePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tienda } = await supabase.from("tiendas").select("*").eq("owner_id", user!.id).maybeSingle();

  if (!tienda) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white">Bienvenido al panel</h1>
        <p className="mt-2 text-sm text-zinc-500">Completá el onboarding en 5 pasos para crear tu tienda.</p>
        <div className="mt-6 max-w-lg">
          <OnboardingWizard />
        </div>
      </div>
    );
  }

  const { count: nProd } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })
    .eq("tienda_id", tienda.id);

  const { count: nPed } = await supabase
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .eq("tienda_id", tienda.id);

  return (
    <div>
      <h1 className="text-xl font-bold text-white">{tienda.nombre}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Tu tienda pública:{" "}
        <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
          /{tienda.slug}
        </Link>
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Productos</p>
          <p className="text-2xl font-semibold text-white">{nProd ?? 0}</p>
          <Link href="/dashboard/productos" className="mt-2 inline-block text-sm text-accent hover:underline">
            Gestionar
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Pedidos</p>
          <p className="text-2xl font-semibold text-white">{nPed ?? 0}</p>
          <Link href="/dashboard/pedidos" className="mt-2 inline-block text-sm text-accent hover:underline">
            Ver pedidos
          </Link>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-zinc-800 bg-surface p-4 text-sm text-zinc-400">
        <p>
          Comisión marketplace por defecto: <strong className="text-white">{Number(tienda.comision_pct)}%</strong>{" "}
          (95% feriante / 5% plataforma en checkout con Mercado Pago split).
        </p>
      </div>
    </div>
  );
}
