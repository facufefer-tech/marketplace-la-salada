import { NuevoProductoForm } from "./NuevoProductoForm";

/** Evita prerender: CldUploadWidget exige env de Cloudinary en build */
export const dynamic = "force-dynamic";

export default function DashboardNuevoProductoPage() {
  return (
    <div className="max-w-3xl">
      <NuevoProductoForm />
    </div>
  );
}
