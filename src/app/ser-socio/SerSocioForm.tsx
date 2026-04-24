"use client";

import { useState } from "react";

const categorias = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Todo"];

export function SerSocioForm() {
  const [form, setForm] = useState({
    nombre_tienda: "",
    dueno: "",
    whatsapp: "",
    email: "",
    ubicacion: "",
    categoria: "Remeras",
    cantidad_productos: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/socios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "No se pudo enviar");
        return;
      }
      setMsg("Solicitud enviada. Tu tienda quedó en estado pendiente para revisión.");
      setForm({
        nombre_tienda: "",
        dueno: "",
        whatsapp: "",
        email: "",
        ubicacion: "",
        categoria: "Remeras",
        cantidad_productos: "",
      });
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-zinc-700 bg-[#111111] p-5 shadow-sm">
      <h2 className="text-2xl font-extrabold">Formulario para feriantes</h2>
      <input
        required
        placeholder="Nombre del puesto/tienda"
        value={form.nombre_tienda}
        onChange={(e) => setForm((s) => ({ ...s, nombre_tienda: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      <input
        required
        placeholder="Nombre y apellido del dueño"
        value={form.dueno}
        onChange={(e) => setForm((s) => ({ ...s, dueno: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      <input
        required
        placeholder="WhatsApp"
        value={form.whatsapp}
        onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      <input
        required
        placeholder="Ubicación (barrio/localidad)"
        value={form.ubicacion}
        onChange={(e) => setForm((s) => ({ ...s, ubicacion: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      <select
        value={form.categoria}
        onChange={(e) => setForm((s) => ({ ...s, categoria: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      >
        {categorias.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <input
        required
        placeholder="Cantidad aproximada de productos"
        value={form.cantidad_productos}
        onChange={(e) => setForm((s) => ({ ...s, cantidad_productos: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2"
      />
      {err && <p className="text-sm text-red-400">{err}</p>}
      {msg && <p className="text-sm text-emerald-400">{msg}</p>}
      <button
        disabled={loading}
        className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Quiero ser socio"}
      </button>
    </form>
  );
}
