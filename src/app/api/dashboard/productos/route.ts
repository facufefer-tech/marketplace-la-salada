import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const DEMO_TIENDA_SLUG = "demo-cargas-publicas";

async function getOrCreateDemoTiendaId() {
  const idFromEnv = process.env.DEMO_TIENDA_ID;
  if (idFromEnv) return idFromEnv;

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin.from("tiendas").select("id").eq("slug", DEMO_TIENDA_SLUG).maybeSingle();
  if (existing?.id) return existing.id;

  const { data: created, error } = await admin
    .from("tiendas")
    .insert({
      slug: DEMO_TIENDA_SLUG,
      nombre: "Demo — cargas sin cuenta",
      descripcion: "Productos de prueba cargados sin iniciar sesión (temporal).",
      activa: true,
      plan: "free",
      comision_pct: 5,
      owner_id: null,
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "No se pudo crear la tienda demo");
  }
  return created.id;
}

async function getMyTiendaId(supabase: ReturnType<typeof createSupabaseRouteClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null as null, tiendaId: null as string | null };
  const { data } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  return { user, tiendaId: data?.id ?? null };
}

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const { user, tiendaId } = await getMyTiendaId(supabase);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!tiendaId) return NextResponse.json({ data: [] });

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tiendaId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const { user, tiendaId } = await getMyTiendaId(supabase);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const insert = {
    nombre: String(body.nombre ?? ""),
    descripcion: (body.descripcion as string) ?? null,
    precio: Number(body.precio ?? 0),
    precio_lista: body.precio_lista != null ? Number(body.precio_lista) : null,
    marca: (body.marca as string) ?? null,
    categoria: (body.categoria as string) ?? null,
    talle: (body.talle as string) ?? null,
    color: (body.color as string) ?? null,
    stock: Number(body.stock ?? 0),
    fotos: (Array.isArray(body.fotos) ? body.fotos : []) as string[],
    activo: body.activo !== false,
    destacado: Boolean(body.destacado),
  };

  if (!insert.nombre) {
    return NextResponse.json({ error: "nombre requerido" }, { status: 400 });
  }

  if (user && tiendaId) {
    const { data, error } = await supabase
      .from("productos")
      .insert({ ...insert, tienda_id: tiendaId })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (user && !tiendaId) {
    return NextResponse.json({ error: "Primero completá el onboarding de tienda" }, { status: 400 });
  }

  // Sin login: carga de prueba en tienda demo (temporal, mismo criterio que ruta pública)
  let demoTiendaId: string;
  try {
    demoTiendaId = await getOrCreateDemoTiendaId();
  } catch (e) {
    const m = e instanceof Error ? e.message : "Error al resolver tienda demo";
    return NextResponse.json({ error: m }, { status: 500 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("productos")
    .insert({ ...insert, tienda_id: demoTiendaId })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, demo: true });
}

export async function PUT(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const { user, tiendaId } = await getMyTiendaId(supabase);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!tiendaId) return NextResponse.json({ error: "Sin tienda" }, { status: 400 });

  let body: Record<string, unknown> & { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = body.id;
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  const { data: row } = await supabase.from("productos").select("id").eq("id", id).eq("tienda_id", tiendaId).maybeSingle();
  if (!row) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const patch = {
    nombre: body.nombre != null ? String(body.nombre) : undefined,
    descripcion: body.descripcion as string | null | undefined,
    precio: body.precio != null ? Number(body.precio) : undefined,
    precio_lista: body.precio_lista != null ? Number(body.precio_lista) : undefined,
    marca: body.marca as string | null | undefined,
    categoria: body.categoria as string | null | undefined,
    talle: body.talle as string | null | undefined,
    color: body.color as string | null | undefined,
    stock: body.stock != null ? Number(body.stock) : undefined,
    fotos: Array.isArray(body.fotos) ? (body.fotos as string[]) : undefined,
    activo: typeof body.activo === "boolean" ? body.activo : undefined,
    destacado: typeof body.destacado === "boolean" ? body.destacado : undefined,
  };

  const cleaned = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));

  const { data, error } = await supabase.from("productos").update(cleaned).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const { user, tiendaId } = await getMyTiendaId(supabase);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!tiendaId) return NextResponse.json({ error: "Sin tienda" }, { status: 400 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query requerido" }, { status: 400 });

  const { error } = await supabase.from("productos").delete().eq("id", id).eq("tienda_id", tiendaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
