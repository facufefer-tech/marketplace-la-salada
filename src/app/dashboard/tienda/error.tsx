"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardTiendaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("dashboard/tienda error:", error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
      <h2 className="text-lg font-bold text-rose-800">No pudimos cargar el editor de tienda</h2>
      <p className="mt-2 text-sm text-rose-700">
        Activamos modo de recuperación para que no se caiga el panel completo.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
        >
          Volver al inicio del panel
        </Link>
      </div>
      <p className="mt-4 text-xs text-zinc-500">Detalle técnico: {error.message || "Error desconocido"}</p>
    </div>
  );
}
