"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EnviosConfigForm } from "@/components/dashboard/EnviosConfigForm";
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
  const [facebook, setFacebook] = useState(initial?.facebook ?? "");
  const [tiktok, setTiktok] = useState(initial?.tiktok ?? "");
  const [horarios, setHorarios] = useState(initial?.horarios ?? "");
  const [miHistoria, setMiHistoria] = useState(initial?.mi_historia ?? "");
  const [historiaFoto, setHistoriaFoto] = useState(initial?.historia_foto_url ?? "");
  const [colorPrimario, setColorPrimario] = useState(initial?.color_primario ?? "#f97316");
  const [bannerText, setBannerText] = useState(initial?.banner_text ?? "");
  const [descripcionHtml, setDescripcionHtml] = useState(initial?.descripcion_html ?? "");
  const [envio, setEnvio] = useState<EnvioMetodos>(
    (initial?.envio_metodos as EnvioMetodos) ?? defaultEnvio,
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [origin, setOrigin] = useState(typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || ""));
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

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
          descripcion_html: descripcionHtml.trim() || null,
          whatsapp: whatsapp.trim() || null,
          instagram: instagram.trim() || null,
          facebook: facebook.trim() || null,
          tiktok: tiktok.trim() || null,
          horarios: horarios.trim() || null,
          mi_historia: miHistoria.trim() || null,
          historia_foto_url: historiaFoto.trim() || null,
          color_primario: colorPrimario,
          banner_text: bannerText.trim() || null,
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
    } catch (e) {
      const m = e instanceof Error ? e.message : "Error al guardar";
      setMsg(m);
    } finally {
      setSaving(false);
    }
  }

  function toggleEnvio(k: keyof EnvioMetodos) {
    setEnvio((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  return (
    <div className="space-y-6">
    <div className="grid gap-8 lg:grid-cols-2">
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
          <span className="text-sm font-medium text-zinc-700">Descripción corta</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Texto con formato básico (HTML permitido)</span>
          <textarea
            value={descripcionHtml}
            onChange={(e) => setDescripcionHtml(e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm"
            placeholder="<p><b>Negrita</b>, listas...</p>"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-700">Texto en banner</span>
          <input
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
            placeholder="Ej: 2x1 en remeras hoy"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-700">Color principal</span>
          <input
            type="color"
            value={colorPrimario}
            onChange={(e) => setColorPrimario(e.target.value)}
            className="mt-1.5 h-10 w-20 cursor-pointer rounded border"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-700">Facebook</span>
          <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2" />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-700">TikTok</span>
          <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2" />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Horarios de atención</span>
          <input
            value={horarios}
            onChange={(e) => setHorarios(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
            placeholder="Lun a Dom 8 a 20h"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Mi historia</span>
          <textarea
            value={miHistoria}
            onChange={(e) => setMiHistoria(e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">Foto del equipo (URL o Cloudinary)</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input value={historiaFoto} onChange={(e) => setHistoriaFoto(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2" />
            <CloudinaryBtn label="Subir" onUploaded={(u) => setHistoriaFoto(u)} />
          </div>
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
    <div className="min-h-[320px] space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-sm font-bold text-zinc-900">Vista previa (tienda pública)</h3>
      <p className="text-xs text-zinc-500">Actualizá y guardá; recargá el iframe para ver cambios en banner/logo.</p>
      {origin ? (
        <iframe
          title="preview"
          className="h-[420px] w-full rounded-xl border border-zinc-200 bg-white"
          src={`${origin}/${slugFinal}`}
        />
      ) : null}
      <a
        href={`/${slugFinal}`}
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white"
      >
        Ver mi tienda pública
      </a>
    </div>
    </div>
    <EnviosConfigForm />
    </div>
  );
}
