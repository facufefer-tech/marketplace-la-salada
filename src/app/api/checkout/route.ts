import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PedidoItem } from "@/lib/types";

type BodyItem = {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio_unit: number;
  tienda_id: string;
};

export async function POST(req: NextRequest) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Mercado Pago no configurado. Agregá MP_ACCESS_TOKEN en .env.local (comisión 5% vía marketplace_fee).",
      },
      { status: 400 },
    );
  }

  let body: {
    items?: BodyItem[];
    comprador_email?: string;
    comision_pct?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (!items.length) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
  }

  const tiendaId = items[0]?.tienda_id;
  if (!items.every((i) => i.tienda_id === tiendaId)) {
    return NextResponse.json(
      { error: "Por ahora solo podés pagar productos de una misma tienda por compra." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: tienda, error: tErr } = await admin
    .from("tiendas")
    .select("id, nombre, slug, comision_pct")
    .eq("id", tiendaId)
    .single();

  if (tErr || !tienda) {
    return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
  }

  const pct = body.comision_pct ?? Number(tienda.comision_pct) ?? 5;
  const subtotal = items.reduce((acc, i) => acc + Number(i.precio_unit) * i.cantidad, 0);
  const marketplace_fee = Math.round(subtotal * (pct / 100) * 100) / 100;

  const pedidoItems: PedidoItem[] = items.map((i) => ({
    producto_id: i.producto_id,
    nombre: i.nombre,
    cantidad: i.cantidad,
    precio_unit: Number(i.precio_unit),
    subtotal: Math.round(Number(i.precio_unit) * i.cantidad * 100) / 100,
  }));

  const { data: pedido, error: pErr } = await admin
    .from("pedidos")
    .insert({
      tienda_id: tiendaId,
      comprador_email: body.comprador_email ?? null,
      items: pedidoItems,
      total: subtotal,
      comision_cobrada: marketplace_fee,
      estado: "pendiente_pago",
    })
    .select("id")
    .single();

  if (pErr || !pedido) {
    return NextResponse.json({ error: pErr?.message ?? "No se pudo crear el pedido" }, { status: 500 });
  }

  const client = new MercadoPagoConfig({ accessToken: token });
  const preference = new Preference(client);

  const origin = req.headers.get("origin") ?? req.nextUrl.origin;

  try {
    const pref = await preference.create({
      body: {
        items: items.map((i) => ({
          id: i.producto_id,
          title: i.nombre,
          quantity: i.cantidad,
          unit_price: Number(i.precio_unit),
          currency_id: "ARS",
        })),
        marketplace_fee,
        payer: body.comprador_email
          ? { email: body.comprador_email }
          : undefined,
        metadata: { pedido_id: pedido.id, tienda_id: tiendaId },
        back_urls: {
          success: `${origin}/dashboard/pedidos?mp=ok`,
          failure: `${origin}/?mp=fail`,
          pending: `${origin}/?mp=pending`,
        },
        auto_return: "approved",
        external_reference: pedido.id,
      },
    });

    if (pref.id) {
      await admin.from("pedidos").update({ mp_payment_id: pref.id }).eq("id", pedido.id);
    }

    return NextResponse.json({
      init_point: pref.init_point,
      sandbox_init_point: pref.sandbox_init_point,
      preference_id: pref.id,
      pedido_id: pedido.id,
      marketplace_fee,
      feriante_pct: 100 - pct,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error Mercado Pago";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
