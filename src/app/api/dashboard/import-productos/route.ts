import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

type Row = Record<string, string | undefined>;

function parseTags(s: string | undefined) {
  if (!s) return null;
  return s
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseFotos(row: Row) {
  return [row.foto_1_url, row.foto_2_url, row.foto_3_url].filter(Boolean) as string[];
}

async function insertProductoCompat(
  supabase: ReturnType<typeof createSupabaseRouteClient>,
  insert: Record<string, unknown>,
) {
  let { error } = await supabase.from("productos").insert(insert);
  if (!error) return null;
  if (!error.message.toLowerCase().includes("could not find the")) return error;
  const basic = {
    tienda_id: insert.tienda_id,
    nombre: insert.nombre,
    descripcion: insert.descripcion,
    categoria: insert.categoria,
    precio: insert.precio,
    talle: insert.talle,
    color: insert.color,
    stock: insert.stock,
    fotos: insert.fotos,
    activo: true,
    destacado: false,
  };
  ({ error } = await supabase.from("productos").insert(basic));
  return error ?? null;
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
  const rows = body.rows as Row[];
  if (!Array.isArray(rows) || !rows.length) {
    return NextResponse.json({ error: "rows requerido" }, { status: 400 });
  }
  const errors: { fila: number; mensaje: string }[] = [];
  let imported = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]!;
    const nombre = String(r.nombre ?? "").trim();
    const precio = Number(r.precio ?? 0);
    const categoria = String(r.categoria ?? "").trim();
    if (!nombre || !precio || !categoria) {
      errors.push({ fila: i + 1, mensaje: "Faltan nombre, precio o categoría" });
      continue;
    }
    const precioDesc = r.precio_descuento != null && r.precio_descuento !== "" ? Number(r.precio_descuento) : null;
    const insert = {
      tienda_id: tienda.id,
      nombre,
      descripcion: r.descripcion?.trim() || null,
      categoria,
      precio: precioDesc && precioDesc < precio ? precioDesc : precio,
      precio_lista: precioDesc && precioDesc < precio ? precio : null,
      talle: r.talle?.trim() || null,
      color: r.color?.trim() || null,
      stock: r.stock != null && r.stock !== "" ? Number(r.stock) : 0,
      marca: r.marca?.trim() || null,
      material: r.material?.trim() || null,
      genero: r.genero?.trim() || null,
      peso_gramos: r.peso_gramos != null && r.peso_gramos !== "" ? Number(r.peso_gramos) : null,
      fotos: parseFotos(r).slice(0, 8),
      etiquetas: parseTags(r.etiquetas),
      activo: true,
      destacado: false,
      estado_publicacion: "publicado",
    };
    const error = await insertProductoCompat(supabase, insert);
    if (error) {
      errors.push({ fila: i + 1, mensaje: error.message });
    } else {
      imported += 1;
    }
  }
  return NextResponse.json({ imported, errores: errors.length, detalleErrores: errors });
}
