import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/marketing/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "La Salada — Marketplace",
  description: "Marketplace de La Salada: moda mayorista y minorista con envío a todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-[#1A1A1A] antialiased">
        <Suspense fallback={<div className="h-14 border-b border-[#E0E0E0] bg-white" />}>
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
