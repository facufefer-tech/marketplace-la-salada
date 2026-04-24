"use client";

import { useState } from "react";

export function NewsletterWidget() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setMsg(j.error ?? "Error");
        return;
      }
      setMsg("¡Listo! Te avisamos ofertas.");
      setEmail("");
      setNombre("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <h3 className="text-sm font-bold uppercase tracking-wide text-white">Suscribite a ofertas</h3>
      <p className="text-xs text-zinc-500">Novedades y descuentos (sin spam).</p>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
      />
      {msg && <p className="text-xs text-emerald-400">{msg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-black"
      >
        {loading ? "…" : "Suscribirme"}
      </button>
    </form>
  );
}
