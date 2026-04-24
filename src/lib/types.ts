export type Plan = "free" | "premium";

export type Tienda = {
  id: string;
  owner_id: string | null;
  slug: string;
  nombre: string;
  descripcion: string | null;
  logo_url: string | null;
  banner_url: string | null;
  activa: boolean;
  plan: Plan;
  comision_pct: number;
  mp_access_token: string | null;
  created_at: string;
};

export type Producto = {
  id: string;
  tienda_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string | null;
  talle: string | null;
  color: string | null;
  stock: number;
  fotos: string[];
  activo: boolean;
  destacado: boolean;
  created_at: string;
  tiendas?: Pick<Tienda, "slug" | "nombre" | "logo_url"> | null;
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
