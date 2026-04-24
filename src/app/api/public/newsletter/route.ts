import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let body: { email?: string; nombre?: string; tienda_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("newsletters").upsert(
    {
      email,
      nombre: body.nombre?.trim() || null,
      activo: true,
      tiendas_seguidas: body.tienda_id ? [body.tienda_id] : [],
    },
    { onConflict: "email" },
  );
  if (error) {
    if (String(error.message).includes("no existe") || String(error.message).toLowerCase().includes("schema")) {
      return NextResponse.json(
        { error: "Base en migración. Ejecutá supabase/schema-fase2.sql" },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
