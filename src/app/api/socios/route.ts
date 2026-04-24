import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nombreTienda = String(body.nombre_tienda ?? "").trim();
  const dueno = String(body.dueno ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  const email = String(body.email ?? "").trim();
  const ubicacion = String(body.ubicacion ?? "").trim();
  const categoria = String(body.categoria ?? "").trim();
  const cantidad = String(body.cantidad_productos ?? "").trim();

  if (!nombreTienda || !dueno || !whatsapp || !email || !ubicacion || !categoria || !cantidad) {
    return NextResponse.json({ error: "Completá todos los campos" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const base = slugify(nombreTienda) || "marca";
  const slug = `${base}-${Date.now().toString().slice(-6)}`;
  const descripcion = [
    "Solicitud de alta (estado: pendiente)",
    `Dueño: ${dueno}`,
    `WhatsApp: ${whatsapp}`,
    `Email: ${email}`,
    `Ubicación: ${ubicacion}`,
    `Categoría: ${categoria}`,
    `Cantidad aprox productos: ${cantidad}`,
  ].join(" | ");

  const { data, error } = await admin
    .from("tiendas")
    .insert({
      slug,
      nombre: nombreTienda,
      descripcion,
      activa: false,
      plan: "free",
      comision_pct: 5,
      owner_id: null,
    })
    .select("id,slug,nombre")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
