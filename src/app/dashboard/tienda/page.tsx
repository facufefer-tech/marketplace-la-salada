import { MiTiendaForm } from "./MiTiendaForm";

export default function MiTiendaPage() {
  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mi tienda</h1>
        <p className="mt-1 text-sm text-zinc-500">Datos de demostración: se guardan solo en el navegador (localStorage).</p>
      </div>
      <MiTiendaForm />
    </div>
  );
}
