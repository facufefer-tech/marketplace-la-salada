import { ImportarClient } from "./ImportarClient";

export default function ImportarPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Importar productos (CSV / Excel)</h1>
      <p className="mt-1 text-sm text-zinc-500">Descargá la plantilla, completá y subí. Validamos columna a columna.</p>
      <div className="mt-8">
        <ImportarClient />
      </div>
    </div>
  );
}
