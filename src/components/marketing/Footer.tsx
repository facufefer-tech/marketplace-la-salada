"use client";

import Link from "next/link";
import { NewsletterWidget } from "@/components/marketing/NewsletterWidget";

const cols = [
  {
    title: "Marketplace",
    links: [
      { href: "/sobre-nosotros", label: "Sobre nosotros" },
      { href: "/como-comprar", label: "Cómo comprar" },
      { href: "/ser-socio", label: "Convertite en socio" },
      { href: "/demo-feriante", label: "Demo feriante (4 pasos)" },
      { href: "/privacidad", label: "Política de privacidad" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/como-comprar", label: "Preguntas frecuentes" },
      { href: "/auth", label: "Mi cuenta" },
      { href: "/dashboard", label: "Panel feriante" },
      { href: "mailto:contacto@lasalada.ar", label: "Contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-14 border-t border-zinc-800 bg-[#0c0c0c]">
      <div className="container-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-white">
            La <span className="text-orange-500">Salada</span>
          </p>
          <p className="mt-3 text-sm text-zinc-400">
            Moda mayorista y minorista con precios reales de feria para toda Argentina.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-zinc-400 hover:text-orange-500">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <NewsletterWidget />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Redes sociales</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>@lasalada.marketplace</li>
            <li>facebook.com/lasalada</li>
            <li>TikTok: @lasalada.oficial</li>
            <li>WhatsApp: +54 9 11 5555-9876</li>
          </ul>
        </div>
      </div>
      <div className="container-shell grid gap-4 border-t border-zinc-800 pb-10 pt-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="mb-2 text-sm font-bold text-white">Mapa de La Salada</p>
          <iframe
            title="Mapa La Salada"
            src="https://www.google.com/maps?q=La+Salada+Buenos+Aires&output=embed"
            className="h-44 w-full rounded-xl border border-zinc-700"
            loading="lazy"
          />
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          <p className="font-bold text-white">Centro de ayuda</p>
          <p className="mt-2">Atención por WhatsApp de lunes a sábado de 8:00 a 19:00.</p>
          <p className="mt-1">Soporte para compradores y feriantes en una sola plataforma.</p>
          <p className="mt-4 text-xs text-zinc-500">© {new Date().getFullYear()} La Salada Marketplace.</p>
        </div>
      </div>
    </footer>
  );
}
