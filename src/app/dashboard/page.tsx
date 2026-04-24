import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardOnboarding } from "@/components/dashboard/DashboardOnboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardHomePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/dashboard");

  const { data: tienda } = await supabase.from("tiendas").select("id, nombre, logo_url, descripcion, mp_access_token, slug").eq("owner_id", user.id).maybeSingle();

  const nProd = tienda
    ? (
        await supabase
          .from("productos")
          .select("id", { count: "exact", head: true })
          .eq("tienda_id", tienda.id)
      ).count ?? 0
    : 0;
  const nPed = tienda
    ? (
        await supabase
          .from("pedidos")
          .select("id", { count: "exact", head: true })
          .eq("tienda_id", tienda.id)
      ).count ?? 0
    : 0;

  return (
    <div>
      <div className="border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Hola{tienda ? `, ${tienda.nombre}` : ""}</h1>
        <p className="mt-1 text-sm text-zinc-500">Resumen de tu negocio en La Salada</p>
      </div>

      <div className="mt-6">
        <DashboardOnboarding
          hasLogo={!!tienda?.logo_url}
          hasDescripcion={!!(tienda?.descripcion && tienda.descripcion.length > 5)}
          productCount={nProd}
          hasMercadoPago={!!tienda?.mp_access_token}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase text-zinc-500">Productos</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900">{nProd}</p>
          <Link href="/dashboard/productos" className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline">
            Gestionar
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase text-zinc-500">Pedidos</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900">{nPed}</p>
          <Link href="/dashboard/pedidos" className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline">
            Ver
          </Link>
        </div>
        {tienda?.slug && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">Vitrina pública</p>
            <p className="mt-1 font-mono text-sm text-zinc-800">/{tienda.slug}</p>
            <Link href={`/${tienda.slug}`} className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline">
              Ver como comprador
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
