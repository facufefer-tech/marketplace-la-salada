import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createSupabaseAdminClient() : null;
  const db = admin ?? supabase;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data, error } = await db.from("tiendas").select("*").eq("owner_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createSupabaseAdminClient() : null;
  const db = admin ?? supabase;
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

  const slug = normalizeSlug(String(body.slug ?? ""));

  if (!slug || !body.nombre) {
    return NextResponse.json({ error: "slug y nombre son obligatorios" }, { status: 400 });
  }

  const payload = {
    nombre: String(body.nombre),
    slug,
    descripcion: (body.descripcion as string) ?? null,
    descripcion_larga: (body.descripcion_larga as string) ?? null,
    logo_url: (body.logo_url as string) ?? null,
    banner_url: (body.banner_url as string) ?? null,
    banner_texto: ((body.banner_texto as string) ?? (body.banner_text as string)) ?? null,
    color_principal: ((body.color_principal as string) ?? (body.color_primario as string) ?? "#F97316") as string,
    whatsapp: (body.whatsapp as string) ?? null,
    instagram: (body.instagram as string) ?? null,
    facebook: (body.facebook as string) ?? null,
    tiktok: (body.tiktok as string) ?? null,
    horarios: (body.horarios as string) ?? null,
    activa: body.activa !== false,
  };
  const basicPayload = {
    nombre: String(body.nombre),
    slug,
    descripcion: (body.descripcion as string) ?? null,
    logo_url: (body.logo_url as string) ?? null,
    banner_url: (body.banner_url as string) ?? null,
    activa: body.activa !== false,
  };

  const { data: existing } = await db.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (existing?.id) {
    let { data, error } = await db
      .from("tiendas")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();
    if (error && error.message.toLowerCase().includes("could not find the")) {
      ({ data, error } = await db
        .from("tiendas")
        .update(basicPayload)
        .eq("id", existing.id)
        .select()
        .single());
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  let { data, error } = await db
    .from("tiendas")
    .insert({
      owner_id: user.id,
      ...payload,
      plan: "free",
      comision_pct: 5,
    })
    .select()
    .single();
  if (error && error.message.toLowerCase().includes("could not find the")) {
    ({ data, error } = await db
      .from("tiendas")
      .insert({
        owner_id: user.id,
        ...basicPayload,
        plan: "free",
        comision_pct: 5,
      })
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
