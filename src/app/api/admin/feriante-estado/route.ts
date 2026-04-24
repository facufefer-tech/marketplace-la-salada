import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id");
  const accion = new URL(req.url).searchParams.get("accion");
  if (!id || (accion !== "activa" && accion !== "suspender" && accion !== "pendiente")) {
    return NextResponse.json({ error: "Params" }, { status: 400 });
  }
  const admin = createSupabaseAdminClient();
  const next = accion === "activa" ? "activa" : accion === "suspender" ? "suspendida" : "pendiente";
  const { error } = await admin.from("tiendas").update({ admin_estado: next, activa: accion !== "suspender" }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL("/admin/feriantes", req.nextUrl.origin));
}
