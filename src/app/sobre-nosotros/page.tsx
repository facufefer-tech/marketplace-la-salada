export default function SobreNosotrosPage() {
  return (
    <main className="bg-[#0a0a0a]">
      <section className="bg-[linear-gradient(120deg,#000,#1f2937,#f97316)] py-20 text-white">
        <div className="container-shell">
          <h1 className="text-4xl font-black sm:text-5xl">Sobre La Salada Marketplace</h1>
          <p className="mt-3 max-w-2xl text-zinc-200">La experiencia de la feria más grande de Latinoamérica, ahora en digital.</p>
        </div>
      </section>
      <section className="container-shell space-y-8 py-10 text-zinc-200">
        <article>
          <h2 className="text-3xl font-black text-white">Nuestra historia</h2>
          <p className="mt-2 text-zinc-300">La Salada nació en el corazón del conurbano bonaerense como el mercado de moda más grande de Latinoamérica. Hoy llevamos esa experiencia al mundo digital para que puedas acceder a los mejores precios desde cualquier lugar del país.</p>
        </article>
        <article>
          <h2 className="text-3xl font-black text-white">Nuestra visión</h2>
          <p className="mt-2 text-zinc-300">Ser la plataforma de moda más accesible y federal de Argentina, conectando a miles de feriantes con millones de compradores.</p>
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
      </section>
    </main>
  );
}
