"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DASHBOARD_DEMO } from "@/lib/dashboard-demo";
import { demoStores } from "@/lib/demo-data";

const KEY = "ls-dashboard-tienda-preview";

type TiendaLocal = { logo: string; banner: string; descripcion: string };

const defaultData: TiendaLocal = {
  logo: demoStores[0]?.avatarUrl ?? "",
  banner: demoStores[0]?.bannerUrl ?? "",
  descripcion: `Bienvenidos a ${DASHBOARD_DEMO.tienda}. Moda y precios de mercado, envíos a todo el país. Catálogo actualizado semanalmente.`,
};

export function MiTiendaForm() {
  const [logo, setLogo] = useState(defaultData.logo);
  const [banner, setBanner] = useState(defaultData.banner);
  const [descripcion, setDescripcion] = useState(defaultData.descripcion);
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const j = JSON.parse(raw) as TiendaLocal;
        if (j.logo) setLogo(j.logo);
        if (j.banner) setBanner(j.banner);
        if (j.descripcion) setDescripcion(j.descripcion);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload: TiendaLocal = { logo, banner, descripcion };
    localStorage.setItem(KEY, JSON.stringify(payload));
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  }

  if (!ready) {
    return <p className="text-sm text-zinc-500">Cargando…</p>;
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <div>
        <span className="text-sm font-medium text-zinc-700">Logo de la tienda</span>
        <div className="mt-2 flex items-start gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {logo ? <Image src={logo} alt="Logo" fill className="object-cover" sizes="96px" /> : null}
          </div>
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ sources: ["local"], maxFiles: 1 }}
            onSuccess={(r) => {
              const u = (r.info as { secure_url?: string })?.secure_url;
              if (u) setLogo(u);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Subir logo
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-700">Banner</span>
        <div className="relative mt-2 h-40 w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
          {banner ? <Image src={banner} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" /> : null}
        </div>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{ sources: ["local"], maxFiles: 1 }}
          onSuccess={(r) => {
            const u = (r.info as { secure_url?: string })?.secure_url;
            if (u) setBanner(u);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="mt-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Subir banner
            </button>
          )}
        </CldUploadWidget>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Descripción</span>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm"
        />
      </label>

      {ok && <p className="text-sm font-medium text-emerald-600">Cambios guardados.</p>}

      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
      >
        Guardar tienda
      </button>
    </form>
  );
}
