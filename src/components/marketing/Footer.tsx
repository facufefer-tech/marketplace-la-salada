"use client";

import Link from "next/link";
import { NewsletterWidget } from "@/components/marketing/NewsletterWidget";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-[#E0E0E0] bg-[#1A1A1A]">
      <div className="container-shell py-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
          <Link href="/" className="hover:text-white">Inicio</Link>
          <span>|</span>
          <Link href="/feriantes" className="hover:text-white">Tiendas</Link>
          <span>|</span>
          <Link href="/como-comprar" className="hover:text-white">Cómo comprar</Link>
          <span>|</span>
          <Link href="/para-feriantes" className="hover:text-white">Para feriantes</Link>
          <span>|</span>
          <Link href="mailto:contacto@lasalada.ar" className="hover:text-white">Contacto</Link>
        </div>
        <div className="mt-6 max-w-md">
          <NewsletterWidget />
        </div>
        <p className="mt-6 text-sm text-zinc-400">
          Marketplace La Salada © 2025 — Hecho en Buenos Aires 🇦🇷
        </p>
      </div>
    </footer>
  );
}
