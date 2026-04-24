export default function SerSocioPage() {
  return (
    <main>
      <section className="bg-gradient-to-r from-zinc-900 to-orange-600 py-16 text-white">
        <div className="container-shell">
          <h1 className="text-4xl font-black sm:text-5xl">Vendé tu ropa en el marketplace más grande de Argentina</h1>
        </div>
      </section>
      <section className="container-shell space-y-10 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {["Tu propia tienda online", "Panel de gestión fácil", "Pagos automáticos con MercadoPago"].map((b) => (
            <div key={b} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold">{b}</h2>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm font-bold text-zinc-500">FREE</p>
            <p className="text-3xl font-black">$0</p>
            <p className="text-sm text-zinc-600">Hasta 50 productos</p>
          </div>
          <div className="rounded-2xl border-2 border-orange-500 p-5">
            <p className="text-sm font-bold text-orange-500">PREMIUM</p>
            <p className="text-3xl font-black">$3.000/mes</p>
            <p className="text-sm text-zinc-600">Productos ilimitados + posicionamiento destacado</p>
          </div>
        </div>
        <form className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-extrabold">Formulario para feriantes</h2>
          <input placeholder="Nombre y apellido" className="w-full rounded-xl border border-zinc-300 px-3 py-2" />
          <input placeholder="Email" className="w-full rounded-xl border border-zinc-300 px-3 py-2" />
          <textarea placeholder="Contanos qué vendés" className="w-full rounded-xl border border-zinc-300 px-3 py-2" rows={4} />
          <button className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">Quiero sumarme</button>
        </form>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "“Tripliqué mis ventas en 2 meses.” — Carla, Moda Femenina",
            "“El panel es simple y rápido.” — Darío, Street Kings",
            "“Cobro seguro y despacho sin vueltas.” — Yanina, Verano Eterno",
          ].map((t) => (
            <blockquote key={t} className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700">{t}</blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
