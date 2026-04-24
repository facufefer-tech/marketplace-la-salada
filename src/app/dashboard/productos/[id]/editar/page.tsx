import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditarProductoApiForm } from "@/components/dashboard/EditarProductoApiForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditarProductoPage({ params }: Props) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/dashboard/productos");

  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) redirect("/dashboard");

  const { data: p, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", params.id)
    .eq("tienda_id", tienda.id)
    .maybeSingle();

  if (error || !p) notFound();

  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <Link href="/dashboard/productos" className="text-sm font-medium text-orange-600 hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900">Editar producto</h1>
      </div>
      <EditarProductoApiForm producto={p as Producto} />
    </div>
  );
}
