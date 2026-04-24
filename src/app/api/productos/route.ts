import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const supabase = createSupabaseAdminClient();

    let q = supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (categoria) {
      q = q.eq("categoria", categoria);
    }

    const { data } = await q;
    const baseRows = (data ?? []) as Array<{ tienda_id?: string | null } & Record<string, unknown>>;
    const tiendaIds = Array.from(
      new Set(baseRows.map((r) => r.tienda_id).filter((x): x is string => Boolean(x))),
    );
    const tiendasById = new Map<string, { slug: string | null; nombre: string | null }>();
    if (tiendaIds.length) {
      const { data: tiendas } = await supabase
        .from("tiendas")
        .select("id,slug,nombre")
        .in("id", tiendaIds);
      (tiendas ?? []).forEach((t) => {
        const row = t as { id: string; slug: string | null; nombre: string | null };
        tiendasById.set(row.id, { slug: row.slug, nombre: row.nombre });
      });
    }

    const rows = baseRows.map((r) => {
      const t = r.tienda_id ? tiendasById.get(r.tienda_id) : null;
      return {
        ...r,
        tienda_nombre: t?.nombre ?? null,
        tienda_slug: t?.slug ?? null,
        tiendas: t ? { nombre: t.nombre ?? "", slug: t.slug ?? "" } : null,
      };
    });
    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
