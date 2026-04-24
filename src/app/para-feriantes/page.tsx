import type { Metadata } from "next";
import { ParaFeriantesClient } from "./ParaFeriantesClient";

export const metadata: Metadata = {
  title: "Para feriantes | La Salada",
  description: "Creá tu tienda online en La Salada Marketplace y calculá tus ganancias.",
};

export default function ParaFeriantesPage() {
  return <ParaFeriantesClient />;
}
