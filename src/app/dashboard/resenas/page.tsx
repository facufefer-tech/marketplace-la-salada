import { ResenasPanel } from "./ResenasPanel";

export default function ResenasPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Reseñas</h1>
      <p className="text-sm text-zinc-500">Aprobá o rechazá opiniones de tus productos.</p>
      <div className="mt-6">
        <ResenasPanel />
      </div>
    </div>
  );
}
