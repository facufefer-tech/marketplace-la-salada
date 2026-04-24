import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const tiendaId = new URL(req.url).searchParams.get("tienda_id");
  if (!tiendaId) return NextResponse.json({ error: "tienda_id requerido" }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ data: [] });
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("envios_config").select("*").eq("tienda_id", tiendaId).eq("activo", true);
  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}
