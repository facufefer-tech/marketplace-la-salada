import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const supabase = createSupabaseAdminClient();

    let q = supabase
      .from("productos")
      .select("*, tiendas:tienda_id(nombre,slug)")
      .eq("activo", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (categoria) {
      q = q.eq("categoria", categoria);
    }

    const { data } = await q;
    const rows = (data ?? []).map((r) => {
      const t = (r as { tiendas?: { nombre?: string; slug?: string } | null }).tiendas;
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
