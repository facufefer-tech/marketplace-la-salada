import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "La Salada — Marketplace",
  description: "Marketplace de feriantes. Indumentaria y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-zinc-950 text-zinc-100 antialiased">
        <Suspense fallback={<div className="h-14 border-b border-zinc-800 bg-zinc-950" />}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
