import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

/** Ruta pública: sin auth bajo ninguna condición (también excluida en `config.matcher`). */
const PATH_PRODUCTOS_NUEVO = "/dashboard/productos/nuevo";

function normalizePathname(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function isProductosNuevoPath(pathname: string) {
  return normalizePathname(pathname) === PATH_PRODUCTOS_NUEVO;
}

export async function middleware(request: NextRequest) {
  if (isProductosNuevoPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", "/admin");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Excluir /dashboard/productos/nuevo: el middleware no corre para esa ruta
     * (nada de sesión ni redirect).
     */
    "/((?!_next/static|_next/image|favicon.ico|dashboard/productos/nuevo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
