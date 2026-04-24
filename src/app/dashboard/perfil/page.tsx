"use client";

import { useEffect, useState } from "react";

type Perfil = {
  email: string;
  nombre: string;
  telefono: string;
  direccion_envio_preferida: string;
  usaFallback?: boolean;
};

export default function DashboardPerfilPage() {
  const [perfil, setPerfil] = useState<Perfil>({
    email: "",
    nombre: "",
    telefono: "",
    direccion_envio_preferida: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/dashboard/perfil", { cache: "no-store" });
        const j = (await res.json()) as { data?: Perfil; error?: string };
        if (!active) return;
        if (!res.ok) {
          setMsg(j.error ?? "No pudimos cargar tu perfil");
          return;
        }
        if (j.data) setPerfil(j.data);
      } catch {
        if (active) setMsg("Error de red al cargar perfil");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: perfil.nombre,
          telefono: perfil.telefono,
          direccion_envio_preferida: perfil.direccion_envio_preferida,
        }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string; fallback?: boolean };
      if (!res.ok) {
        setMsg(j.error ?? "No se pudo guardar");
        return;
      }
      setMsg(j.fallback ? "Guardado en modo fallback (metadata de usuario)." : "Perfil actualizado.");
    } catch {
      setMsg("Error de red al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando perfil…</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Mi perfil</h1>
        <p className="mt-1 text-sm text-zinc-500">Datos personales para compras y contacto.</p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input value={perfil.email} disabled className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-700" />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Nombre
          <input
            value={perfil.nombre}
            onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Teléfono
          <input
            value={perfil.telefono}
            onChange={(e) => setPerfil((p) => ({ ...p, telefono: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Dirección de envío preferida
          <textarea
            rows={3}
            value={perfil.direccion_envio_preferida}
            onChange={(e) => setPerfil((p) => ({ ...p, direccion_envio_preferida: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
          />
        </label>
        {msg && <p className="text-sm text-amber-700">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white hover:bg-[#EA6C0A] disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </div>
  );
}

