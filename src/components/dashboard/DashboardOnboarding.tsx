"use client";

type Props = {
  hasLogo: boolean;
  hasDescripcion: boolean;
  productCount: number;
  hasMercadoPago: boolean;
};

function stepDone(n: number, p: Props): boolean {
  if (n === 1) return true;
  if (n === 2) return p.hasLogo && p.hasDescripcion;
  if (n === 3) return p.productCount > 0;
  if (n === 4) return p.hasMercadoPago;
  if (n === 5) return p.hasLogo && p.hasDescripcion && p.productCount > 0 && p.hasMercadoPago;
  return false;
}

const labels = [
  "Cuenta creada",
  "Completá tu tienda (logo, descripción)",
  "Cargá tu primer producto",
  "Conectá MercadoPago",
  "¡Listo para vender!",
];

export function DashboardOnboarding(props: Props) {
  return (
    <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 md:p-5">
      <p className="text-sm font-bold text-zinc-900">Progreso de puesta en marcha</p>
      <ol className="mt-3 space-y-2">
        {labels.map((label, i) => {
          const n = i + 1;
          const done = stepDone(n, props);
          return (
            <li key={n} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-lg leading-none text-orange-500">{done ? "✅" : "⬜"}</span>
              <span className={done ? "text-zinc-600 line-through" : "font-medium text-zinc-900"}>
                {n}. {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
