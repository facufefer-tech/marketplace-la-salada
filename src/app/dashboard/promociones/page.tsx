import { PromocionesClient } from "./PromocionesClient";

export default function PromocionesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Promociones y códigos</h1>
      <p className="text-sm text-zinc-500">Creá descuentos para checkout (cupón) o automáticos.</p>
      <div className="mt-6">
        <PromocionesClient />
      </div>
    </div>
  );
}
