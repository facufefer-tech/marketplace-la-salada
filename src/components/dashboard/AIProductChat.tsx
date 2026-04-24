"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function AIProductChat({ onParsed }: { onParsed: (rows: Record<string, unknown>[]) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Contame qué productos querés cargar: nombre, precio, categoría, talle, color y stock. Puedo interpretar listas o descripciones sueltas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    if (!input.trim()) return;
    setErr(null);
    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Error");
        setMessages((m) => [...m, { role: "assistant", content: "No pude responder. Revisá la API key de Anthropic." }]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.text ?? "" }]);
      if (Array.isArray(data.productos) && data.productos.length) {
        onParsed(data.productos as Record<string, unknown>[]);
      }
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="text-sm font-semibold text-white">Chat IA — carga en lenguaje natural</h3>
      <p className="mt-1 text-xs text-zinc-500">Modelo claude-haiku-4-5-20251001</p>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-accent" : "text-zinc-300"}>
            <span className="font-medium text-zinc-500">{m.role === "user" ? "Vos: " : "IA: "}</span>
            <span className="whitespace-pre-wrap">{m.content}</span>
          </div>
        ))}
        {loading && <p className="text-zinc-500">Pensando…</p>}
      </div>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      <div className="mt-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="Ej: 10 remeras lisas talle M negras a 4500 pesos…"
          className="min-w-0 flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void send()}
          className="shrink-0 self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
