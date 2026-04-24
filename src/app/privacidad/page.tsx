export default function PrivacidadPage() {
  return (
    <main className="container-shell space-y-6 py-10 text-zinc-200">
      <h1 className="text-4xl font-black text-white">Política de privacidad</h1>
      <p className="text-zinc-300">
        En La Salada Marketplace protegemos los datos personales de compradores y marcas conforme a la Ley 25.326,
        normativa vigente en Argentina y principios de minimización y seguridad de datos.
      </p>
      <section className="space-y-4 rounded-2xl border border-zinc-700 bg-[#111111] p-5 text-sm text-zinc-300">
        <h2 className="text-xl font-extrabold text-white">1. Datos que recolectamos</h2>
        <p>Recolectamos datos de registro, contacto, transacciones y navegación para poder brindar el servicio de compra y venta.</p>
        <h2 className="text-xl font-extrabold text-white">2. Uso de la información</h2>
        <p>Utilizamos los datos para procesar pedidos, prevenir fraude, mejorar la experiencia y comunicar novedades relevantes.</p>
        <h2 className="text-xl font-extrabold text-white">3. Seguridad y almacenamiento</h2>
        <p>Aplicamos medidas técnicas y organizativas para proteger la información, incluyendo cifrado y controles de acceso.</p>
        <h2 className="text-xl font-extrabold text-white">4. Derechos del usuario</h2>
        <p>Podés solicitar acceso, rectificación, actualización o supresión de tus datos escribiendo a privacidad@lasalada.ar.</p>
        <h2 className="text-xl font-extrabold text-white">5. Cookies</h2>
        <p>Usamos cookies para sesiones, métricas y personalización de contenido. Podés gestionarlas en tu navegador.</p>
        <h2 className="text-xl font-extrabold text-white">6. Cambios en esta política</h2>
        <p>Podemos actualizar esta política periódicamente. Publicaremos siempre la versión vigente en esta página.</p>
        <h2 className="text-xl font-extrabold text-white">7. Contacto legal</h2>
        <p>Para consultas legales, privacidad o ejercicio de derechos ARCO escribí a privacidad@lasalada.ar.</p>
        <h2 className="text-xl font-extrabold text-white">8. Transferencias y terceros</h2>
        <p>
          Podemos trabajar con proveedores de infraestructura, pagos y analítica (por ejemplo, hosting y pasarelas de pago),
          siempre bajo cláusulas de confidencialidad y uso restringido.
        </p>
      </section>
    </main>
  );
}
