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
  const env = { ...loadEnvLocal(process.cwd()), ...process.env };
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  for (const table of ["tiendas", "productos"]) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`${table}: ERROR ${error.message}`);
      continue;
    }
    console.log(`${table}: ${Object.keys(data?.[0] ?? {}).join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e.message || String(e));
  process.exit(1);
});
