import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal(projectRoot) {
  const p = path.join(projectRoot, ".env.local");
  const out = {};
  if (!fs.existsSync(p)) return out;
  const raw = fs.readFileSync(p, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^"(.*)"$/, "$1");
    out[k] = v;
  }
  return out;
}

const CATEGORY_PHOTOS = {
  Remeras: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1200&q=80",
  ],
  Pantalones: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
  ],
  Vestidos: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  ],
  Calzado: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
  ],
  Accesorios: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
  ],
  Abrigos: [
    "https://images.unsplash.com/photo-1548624313-0396c75f5e34?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  ],
};

const BASE_ITEMS = [
  ["Remera oversized algodón premium", "Remeras"],
  ["Remera básica cuello redondo", "Remeras"],
  ["Top rib slim fit", "Remeras"],
  ["Musculosa urbana soft", "Remeras"],
  ["Jean recto tiro alto", "Pantalones"],
  ["Jean skinny elastizado", "Pantalones"],
  ["Pantalón cargo gabardina", "Pantalones"],
  ["Pantalón sastrero wide leg", "Pantalones"],
  ["Vestido midi estampado", "Vestidos"],
  ["Vestido satén noche", "Vestidos"],
  ["Vestido camisero lino", "Vestidos"],
  ["Vestido mini volados", "Vestidos"],
  ["Zapatilla urbana cuero", "Calzado"],
  ["Sandalia plataforma confort", "Calzado"],
  ["Botita caña corta", "Calzado"],
  ["Mocasín flexible daily", "Calzado"],
  ["Riñonera premium", "Accesorios"],
  ["Cartera bandolera mini", "Accesorios"],
  ["Mochila urbana reforzada", "Accesorios"],
  ["Lentes de sol retro", "Accesorios"],
  ["Campera puffer corta", "Abrigos"],
  ["Tapado paño clásico", "Abrigos"],
  ["Buzo frisa canguro", "Abrigos"],
  ["Campera bomber urbana", "Abrigos"],
];

async function findUserByEmail(admin, email) {
  let page = 1;
  while (page < 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const found = (data.users ?? []).find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (!data.users?.length) break;
    page += 1;
  }
  return null;
}

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Uso: node scripts/enrich-demo-store.mjs <email>");

  const env = { ...loadEnvLocal(process.cwd()), ...process.env };
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const user = await findUserByEmail(admin, email);
  if (!user) throw new Error(`No se encontró usuario con email ${email}`);

  const { data: tienda, error: tErr } = await admin
    .from("tiendas")
    .select("id,slug,nombre")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (tErr || !tienda?.id) throw new Error(`No se encontró tienda del usuario: ${tErr?.message ?? "sin tienda"}`);

  const { error: updErr } = await admin
    .from("tiendas")
    .update({
      nombre: "Marca Demo COMPU",
      descripcion:
        "Marca de indumentaria urbana y casual. Venta minorista/mayorista con atención por WhatsApp y envíos a todo el país.",
      logo_url:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80",
      banner_url:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=80",
      activa: true,
    })
    .eq("id", tienda.id);
  if (updErr) throw new Error(`No se pudo actualizar tienda: ${updErr.message}`);

  await admin.from("productos").delete().eq("tienda_id", tienda.id);

  const rows = BASE_ITEMS.map(([nombre, categoria], i) => {
    const photos = CATEGORY_PHOTOS[categoria] ?? CATEGORY_PHOTOS.Remeras;
    const price = 12000 + i * 1800;
    return {
      tienda_id: tienda.id,
      nombre,
      descripcion: `${nombre}. Producto real para pruebas de panel, carrito e importación masiva.`,
      categoria,
      precio: price,
      talle: i % 2 === 0 ? "S, M, L, XL" : "38, 40, 42, 44",
      color: i % 3 === 0 ? "Negro, Blanco" : i % 3 === 1 ? "Azul, Gris" : "Beige, Verde",
      stock: 8 + (i % 22),
      fotos: [photos[i % photos.length], photos[(i + 1) % photos.length]],
      activo: true,
      destacado: i % 6 === 0,
    };
  });

  const { data: inserted, error: pErr } = await admin.from("productos").insert(rows).select("id,nombre");
  if (pErr) throw new Error(`No se pudieron insertar productos: ${pErr.message}`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        email,
        store: `https://marketplace-la-salada.vercel.app/${tienda.slug}`,
        dashboard: "https://marketplace-la-salada.vercel.app/dashboard",
        totalProductos: inserted?.length ?? 0,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message || String(e));
  process.exit(1);
});
