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
    </footer>
  );
}
