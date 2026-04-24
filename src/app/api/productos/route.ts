import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Falta configuración Supabase" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const limit = 12;
  const from = page * limit;
  const to = from + limit - 1;

  const categoria = searchParams.get("categoria");
  const minPrecio = searchParams.get("minPrecio");
  const maxPrecio = searchParams.get("maxPrecio");
  const talle = searchParams.get("talle");
  const color = searchParams.get("color");
  const tiendaSlug = searchParams.get("tienda");
  const q = searchParams.get("q");

  const supabase = createClient(url, key);

  let tiendaId: string | undefined;
  if (tiendaSlug) {
    const { data: t } = await supabase
      .from("tiendas")
      .select("id")
      .eq("slug", tiendaSlug)
      .eq("activa", true)
      .maybeSingle();
    if (!t?.id) {
      return NextResponse.json({ data: [], count: 0, page, hasMore: false });
    }
    tiendaId = t.id;
  }

  let query = supabase
    .from("productos")
    .select("*, tiendas(slug,nombre,logo_url,activa)", { count: "exact" })
    .eq("activo", true);

  if (tiendaId) query = query.eq("tienda_id", tiendaId);

  if (categoria) query = query.ilike("categoria", `%${categoria}%`);
  if (talle) query = query.ilike("talle", `%${talle}%`);
  if (color) query = query.ilike("color", `%${color}%`);
  if (minPrecio) query = query.gte("precio", Number(minPrecio));
  if (maxPrecio) query = query.lte("precio", Number(maxPrecio));
  if (q) query = query.or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%`);

  query = query
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message, data: [], count: 0, hasMore: false },
      { status: 200 },
    );
  }

  const rows = (data ?? []).filter(
    (row: { tiendas?: { activa?: boolean } | null }) => row.tiendas?.activa !== false,
  );
  const hasMore = count != null ? to + 1 < count : rows.length === limit;

  return NextResponse.json({
    data: rows,
    count,
    page,
    hasMore,
  });
}
