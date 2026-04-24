import { MiTiendaForm } from "./MiTiendaForm";

export const dynamic = "force-dynamic";

export default function MiTiendaPage() {
  return (
    <div>
      <div className="mb-6 border-b border-zinc-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mi tienda</h1>
        <p className="mt-1 text-sm text-zinc-500">Logo, banner y descripción. Los cambios se guardan en el navegador (demo).</p>
      </div>
      <MiTiendaForm />
    </div>
  );
}
