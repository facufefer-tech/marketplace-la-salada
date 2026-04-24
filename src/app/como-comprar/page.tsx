import type { Metadata } from "next";
import { ComoComprarClient } from "./ComoComprarClient";

export const metadata: Metadata = {
  title: "Cómo comprar | La Salada",
  description: "Pasos para comprar en La Salada Marketplace y medios de pago disponibles.",
};

export default function ComoComprarPage() {
  return <ComoComprarClient />;
}
