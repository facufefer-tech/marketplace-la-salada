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

async function main() {
  const root = process.cwd();
  const env = { ...loadEnvLocal(root), ...process.env };
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const token = Date.now().toString().slice(-6);
  const email = `demo.marketplace.${token}@gmail.com`;
  const password = "Demo123456!";
  const marca = "Marca Demo COMPU";
  const slug = `marca-demo-compu-${token}`;

  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (userErr || !created.user) {
    throw new Error(`No se pudo crear usuario: ${userErr?.message ?? "error desconocido"}`);
  }

  const ownerId = created.user.id;
  const { data: tienda, error: tiendaErr } = await admin
    .from("tiendas")
    .insert({
      owner_id: ownerId,
      slug,
      nombre: marca,
      descripcion: "Indumentaria urbana y casual para todo el año.",
      activa: true,
      plan: "free",
      comision_pct: 5,
    })
    .select("id,slug,nombre")
    .single();
  if (tiendaErr || !tienda?.id) {
    await admin.auth.admin.deleteUser(ownerId);
    throw new Error(`No se pudo crear tienda: ${tiendaErr?.message ?? "error desconocido"}`);
  }

  const tiendaId = tienda.id;
  const envios = [
    { metodo: "retiro", activo: true, precio: 0, descripcion: "Retiro en puesto", tiempo_entrega: "Coordinar" },
    {
      metodo: "correo_argentino",
      activo: true,
      precio: 4500,
      descripcion: "Correo Argentino",
      tiempo_entrega: "3-6 días hábiles",
    },
    { metodo: "oca", activo: true, precio: 5200, descripcion: "OCA", tiempo_entrega: "2-5 días hábiles" },
  ];
  let enviosWarning = "";
  const { error: envErr } = await admin.from("envios_config").insert(
    envios.map((e) => ({
      tienda_id: tiendaId,
      ...e,
    })),
  );
  if (envErr) {
    enviosWarning = `No se pudo usar envios_config (${envErr.message}). Se aplicó fallback en tienda.envio_metodos.`;
    await admin
      .from("tiendas")
      .update({ envio_metodos: { retiro: true, correo: true, oca: true, andreani: false } })
      .eq("id", tiendaId);
  }

  const baseFotos = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  ];
  const productos = [
    {
      nombre: "Remera oversize premium",
      categoria: "Remeras",
      precio: 15900,
      precio_lista: 19900,
      talle: "S, M, L, XL",
      color: "Negro, Blanco",
      stock: 28,
      descripcion: "Remera de algodón peinado, corte oversize.",
      sku: `RMP-${token}-01`,
    },
    {
      nombre: "Jean recto urbano",
      categoria: "Pantalones",
      precio: 28900,
      precio_lista: 34900,
      talle: "38, 40, 42, 44",
      color: "Azul",
      stock: 18,
      descripcion: "Jean recto con elastano y lavado stone.",
      sku: `PAN-${token}-01`,
    },
    {
      nombre: "Buzo frisa canguro",
      categoria: "Abrigos",
      precio: 32900,
      precio_lista: 39900,
      talle: "M, L, XL",
      color: "Gris, Negro",
      stock: 14,
      descripcion: "Buzo frisa premium con capucha y bolsillo frontal.",
      sku: `ABR-${token}-01`,
    },
  ];

  const inserted = [];
  for (let i = 0; i < productos.length; i += 1) {
    const p = productos[i];
    const richPayload = {
      tienda_id: tiendaId,
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      talle: p.talle,
      color: p.color,
      stock: p.stock,
      fotos: [baseFotos[i % baseFotos.length], baseFotos[(i + 1) % baseFotos.length]],
      activo: true,
      destacado: i === 0,
    };
    let row = null;
    let err = null;
    ({ data: row, error: err } = await admin.from("productos").insert(richPayload).select("id,nombre").single());
    if (err) {
      const basicPayload = {
        tienda_id: tiendaId,
        nombre: p.nombre,
        descripcion: p.descripcion,
        categoria: p.categoria,
        precio: p.precio,
        talle: p.talle,
        color: p.color,
        stock: p.stock,
        activo: true,
        destacado: i === 0,
      };
      ({ data: row, error: err } = await admin.from("productos").insert(basicPayload).select("id,nombre").single());
    }
    if (err || !row) {
      throw new Error(`No se pudieron crear productos: ${err?.message ?? "error desconocido"}`);
    }
    inserted.push(row);
  }

  const output = {
    email,
    password,
    marca,
    tiendaSlug: slug,
    dashboard: "https://marketplace-la-salada.vercel.app/dashboard",
    publicStore: `https://marketplace-la-salada.vercel.app/${slug}`,
    enviosWarning,
    productos: (inserted ?? []).map((p) => ({ id: p.id, nombre: p.nombre })),
  };
  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error(err.message || String(err));
  process.exit(1);
});
