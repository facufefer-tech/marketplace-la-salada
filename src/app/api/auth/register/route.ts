import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 50);
}

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; nombreTienda?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const nombreTienda = String(body.nombreTienda ?? "").trim();

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Email y contraseña (6+ caracteres) requeridos" }, { status: 400 });
  }
  if (!nombreTienda) {
    return NextResponse.json({ error: "Nombre de la tienda requerido" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !created.user) {
    return NextResponse.json({ error: authErr?.message ?? "No se pudo crear el usuario" }, { status: 400 });
  }

  const base = slugify(nombreTienda) || "tienda";
  const slug = `${base}-${Date.now().toString(36).slice(-6)}`;

  const { error: dbErr } = await admin.from("tiendas").insert({
    owner_id: created.user.id,
    slug,
    nombre: nombreTienda,
    descripcion: null,
    activa: true,
    plan: "free",
    comision_pct: 5,
  });

  if (dbErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email });
}
