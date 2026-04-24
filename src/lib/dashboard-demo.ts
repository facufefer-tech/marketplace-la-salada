/** Modo prueba: panel sin autenticación real */
export const DASHBOARD_DEMO = {
  usuario: "Facu Demo",
  tienda: "Tienda Demo",
  slug: "tienda-demo",
} as const;

/** UUID inválido para consultas: devuelve lista vacía sin tocar RLS con datos ajenos */
export const TIENDA_ID_VACIO_PRUEBA = "00000000-0000-0000-0000-000000000000";
