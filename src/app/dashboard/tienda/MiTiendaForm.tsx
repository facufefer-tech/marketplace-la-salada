"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";

const KEY = "ls-dashboard-mi-tienda-v2";

export type MiTiendaLocal = {
  nombreTienda: string;
  descripcion: string;
  whatsapp: string;
  logoUrl: string;
};

const defaultData: MiTiendaLocal = {
  nombreTienda: DASHBOARD_DEMO.tienda,
  descripcion:
    "Moda y precios de mercado. Envíos a todo el país. Atención personalizada por WhatsApp.",
  whatsapp: "+54 11 0000-0000",
  logoUrl: "",
};

const CloudinaryLogoUpload = dynamic(
  () => import("@/components/dashboard/CloudinaryLogoUpload").then((m) => m.CloudinaryLogoUpload),
  { ssr: false, loading: () => <span className="text-xs text-zinc-500">Cargando subida…</span> },
);

export function MiTiendaForm() {
  const [data, setData] = useState<MiTiendaLocal>(defaultData);
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const j = JSON.parse(raw) as Partial<MiTiendaLocal>;
        setData((prev) => ({
          nombreTienda: j.nombreTienda ?? prev.nombreTienda,
          descripcion: j.descripcion ?? prev.descripcion,
          whatsapp: j.whatsapp ?? prev.whatsapp,
          logoUrl: j.logoUrl ?? prev.logoUrl,
        }));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function update<K extends keyof MiTiendaLocal>(key: K, value: MiTiendaLocal[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(KEY, JSON.stringify(data));
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  }

  if (!ready) {
    return <p className="text-sm text-zinc-500">Cargando…</p>;
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Nombre de la tienda</span>
        <input
          value={data.nombreTienda}
          onChange={(e) => update("nombreTienda", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Descripción</span>
        <textarea
          value={data.descripcion}
          onChange={(e) => update("descripcion", e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700">WhatsApp</span>
        <input
          value={data.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
          placeholder="+54 11 …"
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-zinc-700">Logo</span>
        <p className="text-xs text-zinc-500">Subí una imagen (Cloudinary) o pegá la URL pública abajo.</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {data.logoUrl ? (
              <Image src={data.logoUrl} alt="Logo" fill className="object-contain" sizes="80px" unoptimized={data.logoUrl.startsWith("data:")} />
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <CloudinaryLogoUpload
              onUploaded={(url) => {
                update("logoUrl", url);
              }}
            />
          </div>
        </div>
        <input
          value={data.logoUrl}
          onChange={(e) => update("logoUrl", e.target.value)}
          placeholder="https://res.cloudinary.com/… (opcional si subís arriba)"
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
        />
      </div>

      {ok && <p className="text-sm font-medium text-emerald-600">Guardado en este navegador (localStorage).</p>}

      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
      >
        Guardar cambios
      </button>
    </form>
  );
}
