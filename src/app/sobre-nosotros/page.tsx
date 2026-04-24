import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros | La Salada",
  description: "Conocé la historia, visión y valores de La Salada Marketplace.",
};

export default function SobreNosotrosPage() {
  return (
    <main className="bg-[#0a0a0a]">
      <section className="bg-[linear-gradient(120deg,#000,#1f2937,#f97316)] py-20 text-white">
        <div className="container-shell">
          <h1 className="text-4xl font-black sm:text-5xl">Sobre La Salada Marketplace</h1>
          <p className="mt-3 max-w-2xl text-zinc-200">
            Llevamos la lógica de las grandes marcas de moda a una plataforma simple para feriantes reales.
          </p>
        </div>
      </section>
      <section className="container-shell space-y-8 py-10 text-zinc-200">
        <article>
          <h2 className="text-3xl font-black text-white">Nuestra historia</h2>
          <p className="mt-2 text-zinc-300">
            La Salada nació en el corazón del conurbano bonaerense como el mercado de moda más grande de Latinoamérica.
            Hoy transformamos esa potencia en un marketplace digital para que cada marca tenga su propia página sin
            depender de conocimientos técnicos.
          </p>
        </article>
        <article>
          <h2 className="text-3xl font-black text-white">Nuestra visión</h2>
          <p className="mt-2 text-zinc-300">
            Ser la plataforma de moda más accesible y federal de Argentina, conectando marcas emergentes con
            compradores de todo el país, con una experiencia comparable a grandes ecommerces internacionales.
          </p>
        </article>
        <article>
          <h2 className="text-3xl font-black text-white">Nuestros valores</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Accesibilidad", "Comunidad", "Transparencia", "Innovación"].map((v) => (
              <div key={v} className="rounded-2xl border border-zinc-700 bg-[#111111] p-4">
                <p className="text-lg font-black text-white">{v}</p>
              </div>
            ))}
          </div>
        </article>
        <article>
          <h2 className="text-3xl font-black text-white">Números que nos enorgullecen</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {["+500 feriantes", "+50.000 productos", "+100.000 compradores", "3 países"].map((n) => (
              <div key={n} className="rounded-2xl bg-orange-500 p-4 text-white">
                <p className="text-xl font-black">{n}</p>
              </div>
            ))}
          </div>
        </article>
        <article>
          <h2 className="text-3xl font-black text-white">Qué ofrecemos a las marcas</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-700 bg-[#111111] p-4">
              <p className="font-black text-white">Portal propio por marca</p>
              <p className="mt-2 text-sm text-zinc-300">Cada cliente tiene URL propia tipo `midominio.com/tu-marca` con catálogo, oferta y contacto.</p>
            </div>
            <div className="rounded-2xl border border-zinc-700 bg-[#111111] p-4">
              <p className="font-black text-white">Carga simple con plantillas</p>
              <p className="mt-2 text-sm text-zinc-300">Plantillas CSV y tutoriales PDF para cargar stock, talles, colores e imágenes sin complejidad.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
