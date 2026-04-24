import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/marketing/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "La Salada — Marketplace",
  description: "Negro profundo, naranja neón y experiencia simple para vender en todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-[#0a0a0a] text-zinc-100 antialiased">
        <Suspense fallback={<div className="h-14 border-b border-zinc-800 bg-[#111111]" />}>
          <Header />
        </Suspense>
        <div className="min-h-[60vh] pb-20 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <ToastProvider />
      </body>
    </html>
  );
}
