"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onUploaded: (secureUrl: string) => void;
  label?: string;
};

/** Aislado para no ejecutar next-cloudinary en SSR (evita errores de entorno / build). */
export function CloudinaryLogoUpload({ onUploaded, label = "Subir logo" }: Props) {
  const hasCloudName = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  if (!hasCloudName || !hasApiKey) {
    return (
      <button
        type="button"
        disabled
        title="Configurá NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_API_KEY para habilitar uploads"
        className="cursor-not-allowed rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-500"
      >
        {label} (deshabilitado)
      </button>
    );
  }
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{ sources: ["local"], maxFiles: 1, maxFileSize: 5000000 }}
      onSuccess={(result) => {
        const info = result?.info as { secure_url?: string } | undefined;
        if (info?.secure_url) onUploaded(info.secure_url);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
        >
          {label}
        </button>
      )}
    </CldUploadWidget>
  );
}
