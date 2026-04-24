import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    n: 1,
    title: "Registro como socio",
    text: "El feriante completa el formulario en la página de socios: datos del puesto, contacto y categoría. Queda registrado para dar de alta su marca en el marketplace.",
    href: "/ser-socio",
    cta: "Ir a registro de socio",
    mockSrc: "https://images.unsplash.com/photo-1521737711867-e3b75d66c0d0?auto=format&fit=crop&w=800&q=80",
    mockAlt: "Equipo de trabajo y negocio",
  },
  {
    n: 2,
    title: "Panel y métricas",
    text: "Al ingresar al dashboard ve ventas, pedidos y el estado de su tienda en un vistazo claro, con números grandes y navegación simple (estilo tienda online profesional).",
    href: "/dashboard",
    cta: "Abrir panel demo",
    mockSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    mockAlt: "Métricas y panel",
  },
  {
    n: 3,
    title: "Cargar un producto con fotos",
    text: "Sube imágenes reales, precios, talles, colores y descripción. El sistema prepara la ficha para publicar en el catálogo (integración con almacenamiento de imágenes).",
    href: "/dashboard/productos/nuevo",
    cta: "Cargar producto (demo)",
    mockSrc: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    mockAlt: "Prenda y carga de producto",
  },
  {
    n: 4,
    title: "Visible en el marketplace",
    text: "El producto pasa a formar parte del listado: los compradores buscan, filtran por categoría y agregan al carrito, todo con la misma experiencia de un e-commerce multimarca.",
    href: "/",
    cta: "Ver marketplace",
    mockSrc: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    mockAlt: "Showroom y vitrina",
  },
];

export const metadata = {
  title: "Demo feriante | La Salada",
  description: "Cómo un feriante publica en La Salada en 4 pasos.",
};

export default function DemoFeriantePage() {
  return (
    <main className="bg-[#0a0a0a] pb-16 pt-8 text-zinc-100">
      <div className="container-shell max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Recorrido para clientes</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tu marca en 4 pasos</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Flujo de demostración: desde el alta de socio hasta ver la publicación en el listado. Ideal para mostrar a feriantes y comercios cómo operan dentro de La Salada.
        </p>

        <ol className="mt-12 space-y-12">
          {steps.map((s) => (
            <li key={s.n} className="grid gap-6 md:grid-cols-2 md:items-center">
              <div
                className={
                  s.n % 2 === 0 ? "order-1 md:order-2" : "order-1"
                }
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
                  <Image src={s.mockSrc} alt={s.mockAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                  <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-black">
                    {s.n}
                  </div>
                </div>
              </div>
              <div className={s.n % 2 === 0 ? "order-2 md:order-1" : "order-2"}>
                <h2 className="text-2xl font-black text-white">
                  <span className="text-orange-400">0{s.n}.</span> {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.text}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  {s.cta} →
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-zinc-500">
          ¿Listo para vender?{" "}
          <Link href="/ser-socio" className="font-semibold text-orange-400 hover:underline">
            Completá el registro
          </Link>{" "}
          o{" "}
          <Link href="/auth" className="font-semibold text-orange-400 hover:underline">
            iniciá sesión
          </Link>{" "}
          si ya tenés cuenta.
        </div>
      </div>
    </main>
  );
}
