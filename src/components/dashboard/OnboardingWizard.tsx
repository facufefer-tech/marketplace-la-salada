"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = ["Nombre", "URL", "Descripción", "Imágenes", "Publicar"];

type Props = { initial?: Record<string, unknown> | null };

export function OnboardingWizard({ initial }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [nombre, setNombre] = useState(String(initial?.nombre ?? ""));
  const [slug, setSlug] = useState(String(initial?.slug ?? ""));
  const [descripcion, setDescripcion] = useState(String(initial?.descripcion ?? ""));
  const [logo_url, setLogoUrl] = useState(String(initial?.logo_url ?? ""));
  const [banner_url, setBannerUrl] = useState(String(initial?.banner_url ?? ""));
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function finish() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/tienda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          slug: slugify(slug || nombre),
          descripcion: descripcion || null,
          logo_url: logo_url || null,
          banner_url: banner_url || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "Error al guardar");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-surface p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Onboarding — paso {step + 1} de {steps.length}</h2>
      <p className="mt-1 text-sm text-zinc-500">{steps[step]}</p>
      <div className="mt-4 flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-zinc-800"}`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <label className="block text-sm text-zinc-400">
            Nombre de la tienda
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              placeholder="Ej: Puesto de Remeras Juan"
            />
          </label>
        )}
        {step === 1 && (
          <label className="block text-sm text-zinc-400">
            URL pública (slug)
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              placeholder="mi-puesto"
            />
            <span className="mt-1 block text-xs text-zinc-600">Quedará en /{slug || slugify(nombre) || "…"}</span>
          </label>
        )}
        {step === 2 && (
          <label className="block text-sm text-zinc-400">
            Descripción
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
              placeholder="Contá qué vendés, horarios, ubicación en La Salada…"
            />
          </label>
        )}
        {step === 3 && (
          <div className="space-y-3 text-sm text-zinc-400">
            <label className="block">
              Logo (URL)
              <input
                value={logo_url}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                placeholder="https://…"
              />
            </label>
            <label className="block">
              Banner (URL)
              <input
                value={banner_url}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                placeholder="https://…"
              />
            </label>
            <p className="text-xs text-zinc-600">Podés pegar links de Cloudinary después de subir en Productos.</p>
          </div>
        )}
        {step === 4 && (
          <div className="text-sm text-zinc-300">
            <p>Revisá los datos y publicá tu tienda.</p>
            <ul className="mt-3 list-inside list-disc text-zinc-500">
              <li>{nombre}</li>
              <li>/{slug || slugify(nombre)}</li>
            </ul>
          </div>
        )}
      </div>

      {err && <p className="mt-4 text-sm text-red-400">{err}</p>}

      <div className="mt-6 flex justify-between gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-30"
        >
          Atrás
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 0 && !nombre.trim()) {
                setErr("El nombre es obligatorio");
                return;
              }
              if (step === 1 && !(slug || nombre).trim()) {
                setErr("Completá la URL o el nombre");
                return;
              }
              setErr(null);
              setStep((s) => s + 1);
            }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            disabled={loading || !nombre.trim()}
            onClick={() => void finish()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Publicar tienda"}
          </button>
        )}
      </div>
    </div>
  );
}
