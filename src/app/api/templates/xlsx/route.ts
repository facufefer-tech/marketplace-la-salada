import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const wb = XLSX.utils.book_new();
  const productos = [
    [
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
    ],
    ["Ej: Remera", "REM-0001", "Texto", "Remeras", "10000", "8000", "8500", "M, L", "Rojo, Negro", "10", "Marca", "Algodón", "unisex", "200", "", "", "", "tag1, tag2"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(productos);
  const instr = XLSX.utils.aoa_to_sheet([
    ["Instrucciones La Salada — importación masiva"],
    [""],
    ["1) Completá la hoja 'productos' (una fila = un producto)."],
    ["2) precio: precio de lista; precio_descuento: precio final con descuento (opcional)."],
    ["3) Subí el .xlsx en /dashboard/importar y revisá el preview."],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "productos");
  XLSX.utils.book_append_sheet(wb, instr, "instrucciones");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="plantilla-la-salada.xlsx"',
    },
  });
}
