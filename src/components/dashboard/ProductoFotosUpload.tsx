"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  fotos: string[];
  onChange: (urls: string[]) => void;
  max?: number;
};

export function ProductoFotosUpload({ fotos, onChange, max = 4 }: Props) {
  const canAdd = fotos.length < max;
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{ sources: ["local"], multiple: true, maxFiles: max - fotos.length }}
      onSuccess={(result) => {
        const info = result?.info as { secure_url?: string } | undefined;
        if (info?.secure_url) {
          onChange([...fotos, info.secure_url].slice(0, max));
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => open()}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm disabled:opacity-40"
        >
          Subir fotos
        </button>
      )}
    </CldUploadWidget>
  );
}
