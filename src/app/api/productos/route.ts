import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const supabase = createSupabaseAdminClient();

    let q = supabase
      .from("productos")
      .select(`
        *,
        tiendas (
          slug,
          nombre
        )
      `)
      .eq("activo", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (categoria) {
      q = q.eq("categoria", categoria);
    }

    const { data, error } = await q;
    if (error) return NextResponse.json([]);
    return NextResponse.json(
      (data ?? []).map((p) => ({
        ...p,
        tienda_slug: (p as { tiendas?: { slug?: string | null } | null }).tiendas?.slug || "moda-la-salada-demo",
        tienda_nombre: (p as { tiendas?: { nombre?: string | null } | null }).tiendas?.nombre || "Moda La Salada",
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}
