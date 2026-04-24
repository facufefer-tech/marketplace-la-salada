import { NextRequest, NextResponse } from "next/server";

const COLUMNS = [
  "nombre",
  "sku",
  "descripcion",
  "categoria",
  "precio",
  "precio_mayorista",
  "precio_descuento",
  "tallas",
  "colores",
  "stock",
  "marca",
  "material",
  "genero",
  "peso_gramos",
  "foto_1_url",
  "foto_2_url",
  "foto_3_url",
  "etiquetas",
] as const;

const ROWS: Record<string, string[][]> = {
  general: [
    ["Remera básica", "REM-1001", "Algodón peinado", "Remeras", "12000", "9500", "9900", "S, M, L", "Negro, Blanco", "20", "MarcaX", "Algodón", "unisex", "220", "https://ejemplo.com/1.jpg", "", "", "verano,oferta"],
  ],
  remera: [
    ["Remera estampa", "REM-2201", "Modal", "Remeras", "15000", "11800", "13000", "S, M, L, XL", "Blanco, Negro", "10", "Urban", "Modal", "unisex", "180", "", "", "", "oversize"],
  ],
  pantalon: [
    ["Jean tiro alto", "PAN-3010", "Denim", "Pantalones", "25000", "21000", "", "28, 30, 32", "Azul", "5", "DenimCo", "Jean", "mujer", "450", "", "", "", "mom"],
  ],
  calzado: [
    ["Zapatilla urbana", "CAL-4402", "Sintético", "Calzado", "35000", "29000", "30000", "39, 40, 41, 42", "Negro, Blanco", "8", "Steps", "Cuero ecológico", "unisex", "800", "", "", "", "running"],
  ],
};

function escapeCell(c: string) {
  if (c.includes(",") || c.includes('"') || c.includes("\n")) {
    return `"${c.replace(/"/g, '""')}"`;
  }
  return c;
}

export async function GET(req: NextRequest) {
  const tipo = new URL(req.url).searchParams.get("tipo") ?? "general";
  const rows = ROWS[tipo] ?? ROWS.general;
  const line = (r: string[]) => r.map(escapeCell).join(",");
  const body = [COLUMNS.join(","), ...rows.map(line)].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="plantilla-${tipo}.csv"`,
    },
  });
}
