export type Plan = "free" | "premium";

export type EnvioMetodos = {
  retiro: boolean;
  correo: boolean;
  oca: boolean;
  andreani: boolean;
};

export type AdminEstadoTienda = "pendiente" | "activa" | "suspendida";

export type Tienda = {
  id: string;
  owner_id: string | null;
  slug: string;
  nombre: string;
  descripcion: string | null;
  descripcion_html?: string | null;
  logo_url: string | null;
  banner_url: string | null;
  banner_text?: string | null;
  color_primario?: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  direccion: string | null;
  horarios?: string | null;
  mi_historia?: string | null;
  historia_foto_url?: string | null;
  envio_metodos?: EnvioMetodos | null;
  activa: boolean;
  admin_estado?: AdminEstadoTienda;
  plan: Plan;
  comision_pct: number;
  mp_access_token: string | null;
  created_at: string;
};

export type EstadoPublicacion = "publicado" | "borrador" | "agotado";

export type Producto = {
  id: string;
  tienda_id: string;
  nombre: string;
  sku?: string | null;
  marca?: string | null;
  descripcion: string | null;
  precio: number;
  precio_lista?: number | null;
  categoria: string | null;
  talle: string | null;
  color: string | null;
  stock: number;
  peso_gramos?: number | null;
  material?: string | null;
  genero?: string | null;
  temporada?: string | null;
  etiquetas?: string[] | null;
  seo_titulo?: string | null;
  seo_descripcion?: string | null;
  estado_publicacion?: EstadoPublicacion | null;
  foto_principal_index?: number;
  fotos: string[];
  activo: boolean;
  destacado: boolean;
  created_at: string;
  tiendas?: Pick<
    Tienda,
    "slug" | "nombre" | "logo_url" | "whatsapp" | "direccion" | "envio_metodos"
  > | null;
};

export type ProductVariant = {
  id: string;
  producto_id: string;
  talle: string;
  color: string;
  stock: number;
  precio_extra: number;
  precio_override: number | null;
  sku: string | null;
  activo: boolean;
  created_at: string;
};

export type EnvioConfigRow = {
  id: string;
  tienda_id: string;
  metodo: string;
  activo: boolean;
  precio: number;
  descripcion: string | null;
  tiempo_entrega: string | null;
};

export type PedidoItem = {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio_unit: number;
  subtotal: number;
};

export type Pedido = {
  id: string;
  tienda_id: string;
  comprador_email: string | null;
  items: PedidoItem[];
  total: number;
  comision_cobrada: number;
  mp_payment_id: string | null;
  estado: string;
  created_at: string;
};

export type Publicidad = {
  id: string;
  tienda_id: string | null;
  tipo: string | null;
  posicion: string | null;
  activa: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  monto_pagado: number | null;
};

export type DescuentoRow = {
  id: string;
  tienda_id: string;
  codigo: string | null;
  tipo: "porcentaje" | "fijo" | "auto";
  valor: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activo: boolean;
  usos: number;
  limite_usos: number | null;
  alcance: "todos" | "categoria" | "productos";
  categoria: string | null;
  producto_ids: string[] | null;
};

export type ResenaRow = {
  id: string;
  producto_id: string;
  tienda_id: string;
  comprador_email: string | null;
  nombre: string;
  estrellas: number;
  comentario: string | null;
  foto_url: string | null;
  aprobada: boolean;
  created_at: string;
};
