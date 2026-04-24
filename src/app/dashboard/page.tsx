import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";

export default async function DashboardHomePage() {
  const supabase = createSupabaseServerClient();
  const { data: tienda } = await supabase.from("tiendas").select("*").eq("slug", DASHBOARD_DEMO.slug).maybeSingle();

  let nProd = 0;
  let nPed = 0;
  if (tienda) {
    const { count: c1 } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("tienda_id", tienda.id);
    const { count: c2 } = await supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("tienda_id", tienda.id);
    nProd = c1 ?? 0;
    nPed = c2 ?? 0;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white">{DASHBOARD_DEMO.tienda}</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Usuario: <span className="text-white">{DASHBOARD_DEMO.usuario}</span>
        {" · "}
        Slug:{" "}
        <span className="text-zinc-300">/{DASHBOARD_DEMO.slug}</span>{" "}
        <span className="text-zinc-600">(ficticio; si existe en Supabase, se muestran conteos reales)</span>
      </p>
      {tienda && (
        <p className="mt-2 text-sm text-zinc-500">
          Tienda vinculada en DB:{" "}
          <Link href={`/${tienda.slug}`} className="text-accent hover:underline">
            /{tienda.slug}
          </Link>
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Productos</p>
          <p className="text-2xl font-semibold text-white">{nProd}</p>
          <Link href="/dashboard/productos" className="mt-2 inline-block text-sm text-accent hover:underline">
            Gestionar
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Pedidos</p>
          <p className="text-2xl font-semibold text-white">{nPed}</p>
          <Link href="/dashboard/pedidos" className="mt-2 inline-block text-sm text-accent hover:underline">
            Ver pedidos
          </Link>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-zinc-800 bg-surface p-4 text-sm text-zinc-400">
        <p>
          Comisión marketplace por defecto: <strong className="text-white">5%</strong> (95% feriante / 5% plataforma en
          checkout con Mercado Pago split). Modo prueba: sin login obligatorio.
        </p>
      </div>
    </div>
  );
}
