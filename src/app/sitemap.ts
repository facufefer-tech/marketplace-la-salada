import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const out: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/para-feriantes`, changeFrequency: "weekly" },
    { url: `${base}/envios`, changeFrequency: "monthly" },
  ];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return out;
  const supabase = createClient(url, key);
  const { data: tiendas } = await supabase.from("tiendas").select("slug, created_at").eq("activa", true);
  for (const t of tiendas ?? []) {
    const s = t as { slug: string; created_at?: string };
    out.push({
      url: `${base}/${s.slug}`,
      lastModified: s.created_at ? new Date(s.created_at) : new Date(),
    });
  }
  const { data: prods } = await supabase.from("productos").select("id, created_at, tienda_id").eq("activo", true).limit(2000);
  const { data: tid } = await supabase.from("tiendas").select("id, slug");
  const sm = new Map((tid ?? []).map((x) => [x.id, (x as { id: string; slug: string }).slug]));
  for (const p of prods ?? []) {
    const r = p as { id: string; created_at: string; tienda_id: string };
    const sl = sm.get(r.tienda_id);
    if (sl) {
      out.push({
        url: `${base}/${sl}/producto/${r.id}`,
        lastModified: r.created_at ? new Date(r.created_at) : new Date(),
      });
    }
  }
  return out;
}
