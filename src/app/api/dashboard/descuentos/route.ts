import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ data: [] });
  const { data, error } = await supabase
    .from("descuentos")
    .select("*")
    .eq("tienda_id", tienda.id)
    .order("id", { ascending: false });
  if (error) {
    return NextResponse.json({ data: [] });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ error: "Sin tienda" }, { status: 400 });
  const body = await req.json();
  const row = {
    tienda_id: tienda.id,
    codigo: body.codigo != null && String(body.codigo).trim() ? String(body.codigo).trim().toLowerCase() : null,
    tipo: String(body.tipo ?? "porcentaje"),
    valor: Number(body.valor),
    fecha_inicio: body.fecha_inicio || null,
    fecha_fin: body.fecha_fin || null,
    activo: body.activo !== false,
    limite_usos: body.limite_usos != null ? Number(body.limite_usos) : null,
    alcance: String(body.alcance ?? "todos"),
    categoria: body.categoria || null,
    producto_ids: Array.isArray(body.producto_ids) ? body.producto_ids : null,
  };
  const { data, error } = await supabase.from("descuentos").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ error: "Sin tienda" }, { status: 400 });
  const body = await req.json();
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  const { data, error } = await supabase
    .from("descuentos")
    .update({ activo: body.activo === true })
    .eq("id", id)
    .eq("tienda_id", tienda.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
