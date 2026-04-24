import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error && !error.message.toLowerCase().includes("could not find the")) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      email: user.email ?? "",
      nombre: (perfil?.nombre as string | null) ?? (user.user_metadata?.nombre as string | undefined) ?? "",
      telefono: (perfil?.telefono as string | null) ?? (user.user_metadata?.telefono as string | undefined) ?? "",
      direccion_envio_preferida:
        (perfil?.direccion_envio_preferida as string | null) ??
        (user.user_metadata?.direccion_envio_preferida as string | undefined) ??
        "",
      usaFallback: Boolean(error && error.message.toLowerCase().includes("could not find the")),
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: { nombre?: string; telefono?: string; direccion_envio_preferida?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const payload = {
    nombre: String(body.nombre ?? "").trim(),
    telefono: String(body.telefono ?? "").trim(),
    direccion_envio_preferida: String(body.direccion_envio_preferida ?? "").trim(),
  };

  const { error } = await supabase.from("perfiles").upsert(
    {
      user_id: user.id,
      ...payload,
    },
    { onConflict: "user_id" },
  );

  if (error && !error.message.toLowerCase().includes("could not find the")) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: authErr } = await supabase.auth.updateUser({
    data: {
      nombre: payload.nombre,
      telefono: payload.telefono,
      direccion_envio_preferida: payload.direccion_envio_preferida,
    },
  });
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    fallback: Boolean(error && error.message.toLowerCase().includes("could not find the")),
  });
}

