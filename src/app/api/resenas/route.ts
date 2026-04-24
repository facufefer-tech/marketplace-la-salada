import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("producto_id");
  if (!id) return NextResponse.json({ error: "producto_id requerido" }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ data: [] });
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("resenas")
    .select("*")
    .eq("producto_id", id)
    .eq("aprobada", true)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  let body: {
    producto_id?: string;
    nombre?: string;
    estrellas?: number;
    comentario?: string;
    comprador_email?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const productoId = String(body.producto_id ?? "");
  if (!productoId || !body.nombre) {
    return NextResponse.json({ error: "producto y nombre requeridos" }, { status: 400 });
  }
  const estrellas = Math.min(5, Math.max(1, Number(body.estrellas ?? 5)));
  const admin = createSupabaseAdminClient();
  const { data: prod, error: pe } = await admin.from("productos").select("id,tienda_id").eq("id", productoId).maybeSingle();
  if (pe || !prod) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  const { data, error } = await admin
    .from("resenas")
    .insert({
      producto_id: productoId,
      tienda_id: prod.tienda_id,
      nombre: String(body.nombre).slice(0, 120),
      comentario: body.comentario ? String(body.comentario).slice(0, 2000) : null,
      estrellas,
      comprador_email: body.comprador_email?.trim() || null,
      aprobada: false,
    })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
