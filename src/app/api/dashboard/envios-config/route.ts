import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const METODOS = [
  { metodo: "retiro", defaultPrecio: 0, descripcion: "Retiro en puesto" },
  { metodo: "propio_feriante", defaultPrecio: 0, descripcion: "Envío propio del feriante" },
  { metodo: "correo_argentino", defaultPrecio: 5000, descripcion: "Correo Argentino" },
  { metodo: "oca", defaultPrecio: 6000, descripcion: "OCA" },
  { metodo: "andreani", defaultPrecio: 6000, descripcion: "Andreani" },
  { metodo: "mercadoenvios", defaultPrecio: 0, descripcion: "MercadoEnvíos (próximamente)" },
];

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ data: [] });

  const { data, error } = await supabase.from("envios_config").select("*").eq("tienda_id", tienda.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, defaults: METODOS });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data: tienda } = await supabase.from("tiendas").select("id").eq("owner_id", user.id).maybeSingle();
  if (!tienda) return NextResponse.json({ error: "Sin tienda" }, { status: 400 });

  let body: { items?: { metodo: string; activo: boolean; precio: number; descripcion?: string; tiempo_entrega?: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "items requerido" }, { status: 400 });
  }

  for (const it of body.items) {
    const { error } = await supabase.from("envios_config").upsert(
      {
        tienda_id: tienda.id,
        metodo: it.metodo,
        activo: it.activo,
        precio: Number(it.precio),
        descripcion: it.descripcion ?? null,
        tiempo_entrega: it.tiempo_entrega ?? null,
      },
      { onConflict: "tienda_id,metodo" },
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
