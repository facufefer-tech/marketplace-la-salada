import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

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
  const aprobada = Boolean(body.aprobada);
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  const { data, error } = await supabase
    .from("resenas")
    .update({ aprobada })
    .eq("id", id)
    .eq("tienda_id", tienda.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ data: [] });
  const { data, error } = await supabase
    .from("resenas")
    .select("*, productos(nombre)")
    .eq("tienda_id", tienda.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}
