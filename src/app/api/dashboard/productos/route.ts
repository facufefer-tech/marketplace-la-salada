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

type VariantIn = {
  talle?: string;
  color?: string;
  stock?: number;
  precio_extra?: number;
  precio_override?: number | string | null;
  sku?: string | null;
  activo?: boolean;
};

function parsePrecioOverride(x: unknown): number | null {
  if (x == null) return null;
  if (typeof x === "string" && !x.trim()) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

async function syncVariants(
  supabase: ReturnType<typeof createSupabaseRouteClient>,
  productoId: string,
  variants: unknown,
) {
  if (!Array.isArray(variants)) return;
  await supabase.from("product_variants").delete().eq("producto_id", productoId);
  const rows = (variants as VariantIn[]).map((v) => ({
    producto_id: productoId,
    talle: String(v.talle ?? "Único"),
    color: String(v.color ?? "Único"),
    stock: Math.max(0, Number(v.stock ?? 0)),
    precio_extra: Number(v.precio_extra ?? 0),
    precio_override: parsePrecioOverride(v.precio_override),
    sku: v.sku ? String(v.sku) : null,
    activo: v.activo !== false,
  }));
  if (!rows.length) return;
  const { error } = await supabase.from("product_variants").insert(rows);
  if (error) throw new Error(error.message);
  const sumStock = rows.reduce((a, r) => a + r.stock, 0);
  await supabase.from("productos").update({ stock: sumStock }).eq("id", productoId);
}

function baseProductFromBody(body: Record<string, unknown>) {
  const fotos = (Array.isArray(body.fotos) ? (body.fotos as string[]) : []).filter(Boolean).slice(0, 8);
  const idx = body.foto_principal_index != null ? Math.min(7, Math.max(0, Number(body.foto_principal_index))) : 0;
  return {
    nombre: String(body.nombre ?? ""),
    descripcion: (body.descripcion as string) ?? null,
    precio: Number(body.precio ?? 0),
    precio_lista: body.precio_lista != null ? Number(body.precio_lista) : null,
    marca: (body.marca as string) ?? null,
    sku: body.sku != null ? String(body.sku) : null,
    categoria: (body.categoria as string) ?? null,
    talle: (body.talle as string) ?? null,
    color: (body.color as string) ?? null,
    stock: Number(body.stock ?? 0),
    peso_gramos: body.peso_gramos != null ? Number(body.peso_gramos) : null,
    material: body.material != null ? String(body.material) : null,
    genero: body.genero != null ? String(body.genero) : null,
    temporada: body.temporada != null ? String(body.temporada) : null,
    etiquetas: Array.isArray(body.etiquetas) ? (body.etiquetas as string[]) : null,
    seo_titulo: body.seo_titulo != null ? String(body.seo_titulo) : null,
    seo_descripcion: body.seo_descripcion != null ? String(body.seo_descripcion) : null,
    estado_publicacion:
      typeof body.estado_publicacion === "string" ? String(body.estado_publicacion) : "publicado",
    foto_principal_index: idx,
    fotos,
    activo: body.activo !== false,
    destacado: Boolean(body.destacado),
  };
}

function basicProductoPayload(
  p: ReturnType<typeof baseProductFromBody>,
  tiendaId: string,
) {
  return {
    tienda_id: tiendaId,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    categoria: p.categoria,
    talle: p.talle,
    color: p.color,
    stock: p.stock,
    fotos: p.fotos,
    activo: p.activo,
    destacado: p.destacado,
  };
}

async function insertProductoCompat(
  client: ReturnType<typeof createSupabaseRouteClient> | ReturnType<typeof createSupabaseAdminClient>,
  tiendaId: string,
  insert: ReturnType<typeof baseProductFromBody>,
) {
  let { data, error } = await client.from("productos").insert({ ...insert, tienda_id: tiendaId }).select().single();
  if (error && error.message.toLowerCase().includes("could not find the")) {
    ({ data, error } = await client.from("productos").insert(basicProductoPayload(insert, tiendaId)).select().single());
  }
  return { data, error };
}

async function updateProductoCompat(
  client: ReturnType<typeof createSupabaseRouteClient>,
  id: string,
  fullPatch: Record<string, unknown>,
  basicPatch: Record<string, unknown>,
) {
  let { data, error } = await client.from("productos").update(fullPatch).eq("id", id).select().single();
  if (error && error.message.toLowerCase().includes("could not find the")) {
    ({ data, error } = await client.from("productos").update(basicPatch).eq("id", id).select().single());
  }
  return { data, error };
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

  const insert = baseProductFromBody(body);
  if (!insert.nombre) {
    return NextResponse.json({ error: "nombre requerido" }, { status: 400 });
  }

  const variants = body.variants;

  if (user && tiendaId) {
    const { data, error } = await insertProductoCompat(supabase, tiendaId, insert);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (data?.id) {
      try {
        await syncVariants(supabase, data.id, variants);
      } catch (e) {
        const m = e instanceof Error ? e.message : "Error variantes";
        return NextResponse.json({ error: m, data }, { status: 500 });
      }
    }
    const { data: fresh } = await supabase.from("productos").select("*").eq("id", data.id).single();
    return NextResponse.json({ data: fresh ?? data });
  }

  if (user && !tiendaId) {
    return NextResponse.json({ error: "Primero completá el onboarding de tienda" }, { status: 400 });
  }

  let demoTiendaId: string;
  try {
    demoTiendaId = await getOrCreateDemoTiendaId();
  } catch (e) {
    const m = e instanceof Error ? e.message : "Error al resolver tienda demo";
    return NextResponse.json({ error: m }, { status: 500 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await insertProductoCompat(admin, demoTiendaId, insert);
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

  const b = baseProductFromBody(body);
  const patch: Record<string, unknown> = {
    nombre: b.nombre,
    descripcion: b.descripcion,
    precio: b.precio,
    precio_lista: b.precio_lista,
    marca: b.marca,
    sku: b.sku,
    categoria: b.categoria,
    talle: b.talle,
    color: b.color,
    stock: b.stock,
    peso_gramos: b.peso_gramos,
    material: b.material,
    genero: b.genero,
    temporada: b.temporada,
    etiquetas: b.etiquetas,
    seo_titulo: b.seo_titulo,
    seo_descripcion: b.seo_descripcion,
    estado_publicacion: b.estado_publicacion,
    foto_principal_index: b.foto_principal_index,
    fotos: b.fotos,
    activo: b.activo,
    destacado: b.destacado,
  };
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  ) as Record<string, unknown>;
  const basic = Object.fromEntries(
    Object.entries({
      nombre: b.nombre,
      descripcion: b.descripcion,
      precio: b.precio,
      categoria: b.categoria,
      talle: b.talle,
      color: b.color,
      stock: b.stock,
      fotos: b.fotos,
      activo: b.activo,
      destacado: b.destacado,
    }).filter(([, v]) => v !== undefined),
  ) as Record<string, unknown>;

  const { data, error } = await updateProductoCompat(supabase, id, cleaned, basic);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (Object.prototype.hasOwnProperty.call(body, "variants")) {
    try {
      await syncVariants(supabase, id, body.variants);
    } catch (e) {
      const m = e instanceof Error ? e.message : "Error variantes";
      return NextResponse.json({ error: m, data }, { status: 500 });
    }
  }
  const { data: fresh } = await supabase.from("productos").select("*").eq("id", id).single();
  return NextResponse.json({ data: fresh ?? data });
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
