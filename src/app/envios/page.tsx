import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y retiros | La Salada",
  description: "Métodos de envío y retiro disponibles en La Salada Marketplace.",
};

const opciones = [
  { t: "Retiro en el puesto", sub: "Gratis", d: "Coordiná día y horario con el feriante. Ideal si vivís cerca o pasás con frecuencia." },
  { t: "Correo Argentino", sub: "El feriante coordina", d: "Cada puesto ofrece envío nacional; plazos y costos se acuerdan por WhatsApp." },
  { t: "OCA", sub: "El feriante coordina", d: "Envíos a domicilio o sucursal. El monto y el embalaje los define la tienda." },
  { t: "Andreani", sub: "El feriante coordina", d: "Otra alternativa de mensajería; disponibilidad según lo que active cada vendedor." },
];

export default function EnviosPage() {
  return (
    <main className="container-shell py-10">
      <h1 className="text-3xl font-black text-white md:text-4xl">Envíos y retiros</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Cada feriante en La Salada configura <strong className="text-zinc-200">sus propios</strong> métodos de
        entrega. En la ficha de la tienda y en cada producto vas a ver qué ofrece ese puesto.
      </p>

      <ul className="mt-8 space-y-4">
        {opciones.map((o) => (
          <li
            key={o.t}
            className="rounded-2xl border border-zinc-800 bg-[#111] p-5 transition hover:border-orange-500/50"
          >
            <h2 className="text-xl font-bold text-white">{o.t}</h2>
            <p className="text-sm font-semibold text-orange-400">{o.sub}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{o.d}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-zinc-500">
        ¿Sos feriante?{" "}
        <Link href="/dashboard/tienda" className="text-orange-400 hover:underline">
          Activá tus métodos de envío
        </Link>{" "}
        en el panel.
      </p>
    </main>
  );
}
