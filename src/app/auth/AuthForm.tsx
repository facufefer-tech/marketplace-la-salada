"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "registro">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMsg(error.message);
          return;
        }
        router.push(next);
        router.refresh();
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMsg(error.message);
        return;
      }
      if (data.session) {
        router.push(next);
        router.refresh();
        return;
      }
      setMsg("Revisá tu correo para confirmar la cuenta (si el proveedor lo exige).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Ingresá" : "Creá tu cuenta"}</h1>
      <p className="mt-2 text-sm text-zinc-500">Feriantes: después podés completar tu tienda en el panel.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm text-zinc-400">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Contraseña
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
        </label>
        {msg && <p className="text-sm text-amber-300">{msg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-black hover:bg-orange-400 disabled:opacity-50"
        >
          {loading ? "…" : mode === "login" ? "Entrar" : "Registrarme"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "registro" : "login")}
        className="mt-4 text-center text-sm text-accent hover:underline"
      >
        {mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Ingresá"}
      </button>

      <Link href="/" className="mt-8 text-center text-sm text-zinc-500 hover:text-white">
        Volver al marketplace
      </Link>
    </main>
  );
}
