import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Faltan credenciales Cloudinary" }, { status: 500 });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  let body: { paramsToSign?: Record<string, string | number> } = {};
  try {
    body = await req.json();
  } catch {
    /* next-cloudinary puede enviar vacío */
  }

  const paramsToSign: Record<string, string | number> = {
    folder: "marketplace-la-salada/productos",
    timestamp: Math.round(Date.now() / 1000),
    ...body.paramsToSign,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    signature,
    api_key: apiKey,
    cloud_name: cloudName,
    timestamp: paramsToSign.timestamp,
  });
}
