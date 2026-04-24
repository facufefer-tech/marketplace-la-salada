import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data, error } = await supabase.from("tiendas").select("*").eq("owner_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const slug = String(body.slug ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug || !body.nombre) {
    return NextResponse.json({ error: "slug y nombre son obligatorios" }, { status: 400 });
  }

  const { data: existing } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (existing?.id) {
    const { data, error } = await supabase
      .from("tiendas")
      .update({
        nombre: body.nombre,
        slug,
        descripcion: body.descripcion ?? null,
        logo_url: body.logo_url ?? null,
        banner_url: body.banner_url ?? null,
        activa: body.activa ?? true,
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const { data, error } = await supabase
    .from("tiendas")
    .insert({
      owner_id: user.id,
      slug,
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      logo_url: body.logo_url ?? null,
      banner_url: body.banner_url ?? null,
      activa: true,
      plan: "free",
      comision_pct: 5,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
