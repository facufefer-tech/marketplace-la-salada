import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import type { EnvioMetodos } from "@/lib/types";

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseEnvioMetodos(v: unknown): EnvioMetodos {
  if (!v || typeof v !== "object") {
    return { retiro: true, correo: false, oca: false, andreani: false };
  }
  const o = v as Record<string, boolean>;
  return {
    retiro: Boolean(o.retiro),
    correo: Boolean(o.correo),
    oca: Boolean(o.oca),
    andreani: Boolean(o.andreani),
  };
}

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

  const slug = normalizeSlug(String(body.slug ?? ""));

  if (!slug || !body.nombre) {
    return NextResponse.json({ error: "slug y nombre son obligatorios" }, { status: 400 });
  }

  const payload = {
    nombre: String(body.nombre),
    slug,
    descripcion: (body.descripcion as string) ?? null,
    descripcion_html: (body.descripcion_html as string) ?? null,
    logo_url: (body.logo_url as string) ?? null,
    banner_url: (body.banner_url as string) ?? null,
    banner_text: (body.banner_text as string) ?? null,
    color_primario: (body.color_primario as string) ?? null,
    whatsapp: (body.whatsapp as string) ?? null,
    instagram: (body.instagram as string) ?? null,
    facebook: (body.facebook as string) ?? null,
    tiktok: (body.tiktok as string) ?? null,
    direccion: (body.direccion as string) ?? null,
    horarios: (body.horarios as string) ?? null,
    mi_historia: (body.mi_historia as string) ?? null,
    historia_foto_url: (body.historia_foto_url as string) ?? null,
    envio_metodos: parseEnvioMetodos(body.envio_metodos),
    activa: body.activa !== false,
  };

  const { data: existing } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (existing?.id) {
    const { data, error } = await supabase
      .from("tiendas")
      .update(payload)
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
      ...payload,
      plan: "free",
      comision_pct: 5,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
