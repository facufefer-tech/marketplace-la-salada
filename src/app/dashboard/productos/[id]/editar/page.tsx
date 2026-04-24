import Link from "next/link";
import { notFound } from "next/navigation";
import { EditarProductoForm } from "@/components/dashboard/EditarProductoForm";
import { getDemoProductById } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default function EditarProductoPage({ params }: Props) {
  const id = decodeURIComponent(params.id);
  const base = getDemoProductById(id);
  if (!base) notFound();

  return (
    <div>
      <div className="mb-8 border-b border-zinc-100 pb-6">
        <Link href="/dashboard/productos" className="text-sm font-medium text-orange-600 hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900">Editar producto</h1>
        <p className="mt-1 text-sm text-zinc-500">SKU demo: {base.id}</p>
      </div>
      <EditarProductoForm base={base} />
    </div>
  );
}
