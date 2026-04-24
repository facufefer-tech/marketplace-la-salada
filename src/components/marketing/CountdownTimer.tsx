"use client";

import { useEffect, useState } from "react";

export function CountdownTimer() {
  const [seconds, setSeconds] = useState(17 * 3600 + 45 * 60);
  useEffect(() => {
    const t = setInterval(() => setSeconds((v) => (v > 0 ? v - 1 : 17 * 3600 + 45 * 60)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return (
    <section className="rounded-2xl border border-red-500/40 bg-[#1a0f10] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-red-400">Ofertas del día</p>
          <h3 className="text-xl font-black text-white">Terminan en {h}:{m}:{s}</h3>
        </div>
        <button className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600">Ver todas</button>
      </div>
    </section>
  );
}
