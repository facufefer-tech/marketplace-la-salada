import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Valida un código de descuento para un carrito (tienda + monto + producto opcional)
 */
export async function POST(req: NextRequest) {
  let body: { codigo?: string; tienda_id?: string; subtotal?: number; producto_id?: string; categoria?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const codigo = String(body.codigo ?? "")
    .trim()
    .toLowerCase();
  const tiendaId = String(body.tienda_id ?? "");
  if (!codigo || !tiendaId) return NextResponse.json({ error: "Código y tienda requeridos" }, { status: 400 });
  const subtotal = Math.max(0, Number(body.subtotal ?? 0));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  const supabase = createClient(url, key);
  const { data: rows, error } = await supabase
    .from("descuentos")
    .select("*")
    .eq("tienda_id", tiendaId)
    .eq("activo", true);
  if (error || !rows?.length) {
    return NextResponse.json({ ok: false, mensaje: "Código no válido" });
  }
  type DescuentoValidRow = {
    id: string;
    codigo: string | null;
    tipo: string;
    valor: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    limite_usos: number | null;
    usos: number;
    alcance: string;
    categoria: string | null;
    producto_ids: string[] | null;
  };
  const list = rows as DescuentoValidRow[];
  const d = list.find((r) => (r.codigo || "").toLowerCase().trim() === codigo);
  if (!d) {
    return NextResponse.json({ ok: false, mensaje: "Código no válido" });
  }
  const now = new Date();
  if (d.fecha_inicio && new Date(d.fecha_inicio) > now) return NextResponse.json({ ok: false, mensaje: "Aún no vigente" });
  if (d.fecha_fin && new Date(d.fecha_fin) < now) return NextResponse.json({ ok: false, mensaje: "Código vencido" });
  if (d.limite_usos != null && d.usos >= d.limite_usos) {
    return NextResponse.json({ ok: false, mensaje: "Límite de usos" });
  }
  if (d.alcance === "categoria" && body.categoria && d.categoria && d.categoria !== body.categoria) {
    return NextResponse.json({ ok: false, mensaje: "No aplica a esta categoría" });
  }
  if (d.alcance === "productos" && body.producto_id && d.producto_ids && !d.producto_ids.includes(body.producto_id)) {
    return NextResponse.json({ ok: false, mensaje: "No aplica a este producto" });
  }
  let descuentoMonto = 0;
  if (d.tipo === "porcentaje") {
    descuentoMonto = Math.round((subtotal * d.valor) / 100);
  } else {
    descuentoMonto = Math.min(subtotal, d.valor);
  }
  return NextResponse.json({ ok: true, descuento: descuentoMonto, descuentoId: d.id });
}
