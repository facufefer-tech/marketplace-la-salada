"use client";

import Link from "next/link";

export default function ErrorEditarProducto() {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <h1 className="text-xl font-black text-rose-900">No pudimos abrir el editor de producto</h1>
      <p className="mt-2 text-sm text-rose-800">
        Ocurrio un problema inesperado. Reintenta en unos segundos.
      </p>
      <Link href="/dashboard/productos" className="mt-4 inline-block rounded-xl bg-[#F97316] px-4 py-2 font-bold text-white">
        Volver a productos
      </Link>
    </section>
  );
}
