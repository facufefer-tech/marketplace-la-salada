"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onUploaded: (secureUrl: string) => void;
  label?: string;
};

/** Aislado para no ejecutar next-cloudinary en SSR (evita errores de entorno / build). */
export function CloudinaryLogoUpload({ onUploaded, label = "Subir logo" }: Props) {
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
