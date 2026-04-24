import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "La Salada — Marketplace",
  description: "Marketplace de moda mayorista y minorista de Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-zinc-900 antialiased">
        <Suspense fallback={<div className="h-14 border-b border-zinc-200 bg-white" />}>
          <Header />
        </Suspense>
        <div className="min-h-[60vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
