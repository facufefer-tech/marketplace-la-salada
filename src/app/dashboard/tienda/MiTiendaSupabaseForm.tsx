"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { EnvioMetodos, Tienda } from "@/lib/types";

const CloudinaryBtn = dynamic(
  () => import("@/components/dashboard/CloudinaryLogoUpload").then((m) => m.CloudinaryLogoUpload),
  { ssr: false, loading: () => <span className="text-xs text-zinc-400">…</span> },
);

type Props = { initial: Partial<Tienda> | null };

const defaultEnvio: EnvioMetodos = { retiro: true, correo: false, oca: false, andreani: false };

export function MiTiendaSupabaseForm({ initial }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");
  const [direccion, setDireccion] = useState(initial?.direccion ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(initial?.banner_url ?? "");
  const [envio, setEnvio] = useState<EnvioMetodos>(
    (initial?.envio_metodos as EnvioMetodos) ?? defaultEnvio,
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const slugFinal = useMemo(() => {
    const s = slug.trim() || nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return s || "mi-tienda";
  }, [slug, nombre]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/tienda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          slug: slugFinal,
          descripcion: descripcion.trim() || null,
          whatsapp: whatsapp.trim() || null,
          instagram: instagram.trim() || null,
          direccion: direccion.trim() || null,
          logo_url: logoUrl.trim() || null,
          banner_url: bannerUrl.trim() || null,
          envio_metodos: envio,
        }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(j.error ?? "Error al guardar");
        return;
      }
      setMsg("Guardado correctamente.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function toggleEnvio(k: keyof EnvioMetodos) {
    setEnvio((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Nombre de la tienda</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
            required
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">URL (slug)</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugFinal}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Descripción</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">WhatsApp</span>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+54 9 11 0000-0000"
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Instagram</span>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@tutienda"
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Dirección del puesto / local</span>
          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-700">Logo</span>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {logoUrl ? <Image src={logoUrl} alt="" fill className="object-contain" sizes="80px" /> : null}
          </div>
          <CloudinaryBtn label="Subir logo" onUploaded={(u) => setLogoUrl(u)} />
        </div>
        <input
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          placeholder="URL del logo (opcional)"
        />
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-700">Banner</span>
        <div className="relative mt-2 h-32 w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
          {bannerUrl ? <Image src={bannerUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 576px" /> : null}
        </div>
        <div className="mt-2">
          <CloudinaryBtn label="Subir banner" onUploaded={(u) => setBannerUrl(u)} />
        </div>
        <input
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          placeholder="URL del banner (opcional)"
        />
      </div>

      <div>
        <span className="text-sm font-bold text-zinc-800">Métodos de envío</span>
        <p className="text-xs text-zinc-500">Activá los que apliquen. El costo lo coordina cada feriante con el comprador.</p>
        <ul className="mt-2 space-y-2">
          {(
            [
              ["retiro", "Retiro en el puesto"],
              ["correo", "Correo Argentino"],
              ["oca", "OCA"],
              ["andreani", "Andreani"],
            ] as const
          ).map(([k, label]) => (
            <li key={k}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
                <input type="checkbox" checked={envio[k]} onChange={() => toggleEnvio(k)} className="rounded" />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {msg && <p className={msg.includes("Error") || msg.includes("error") ? "text-sm text-red-600" : "text-sm text-emerald-600"}>{msg}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar en la nube"}
      </button>
    </form>
  );
}
