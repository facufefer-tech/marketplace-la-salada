"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: string;
  message: string;
  kind: "success" | "error" | "info";
};

declare global {
  interface WindowEventMap {
    "app:toast": CustomEvent<{ message: string; kind?: ToastItem["kind"] }>;
  }
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: WindowEventMap["app:toast"]) {
      const id = crypto.randomUUID();
      const next: ToastItem = {
        id,
        message: event.detail.message,
        kind: event.detail.kind ?? "info",
      };
      setToasts((prev) => [...prev, next]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    }
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[60] flex w-[min(90vw,360px)] flex-col gap-2 sm:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`fade-in-up rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            t.kind === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : t.kind === "error"
                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                : "border-zinc-700 bg-zinc-900/95 text-zinc-100"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
