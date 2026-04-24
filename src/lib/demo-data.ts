import type { Producto } from "@/lib/types";

export type DemoStore = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  owner: string;
  avatarUrl: string;
  bannerUrl: string;
  rating: number;
  ventasMes: number;
};

export type DemoProduct = Producto & {
  precioOriginal: number;
  descuentoPct: number;
  nuevo: boolean;
  precio_mayorista?: number;
};

const imagenesMercado = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
  "https://images.unsplash.com/photo-1573408301185-9519f94f8be5?w=800",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
];

export const demoStores: DemoStore[] = [
  { id: "s1", slug: "urbanstyle-ba", nombre: "UrbanStyle BA", descripcion: "Streetwear urbano para hombre y mujer.", owner: "Kevin Benítez", avatarUrl: "https://i.pravatar.cc/150?img=11", bannerUrl: imagenesMercado[0], rating: 4.8, ventasMes: 312 },
  { id: "s2", slug: "moda-femenina-ceci", nombre: "Ceci Studio", descripcion: "Moda femenina diaria y de oficina.", owner: "Cecilia Ríos", avatarUrl: "https://i.pravatar.cc/150?img=32", bannerUrl: imagenesMercado[1], rating: 4.9, ventasMes: 268 },
  { id: "s3", slug: "el-vaquero", nombre: "Vaquero Pro", descripcion: "Jean, gabardina y trabajo pesado.", owner: "Roberto Gómez", avatarUrl: "https://i.pravatar.cc/150?img=53", bannerUrl: imagenesMercado[2], rating: 4.7, ventasMes: 227 },
  { id: "s4", slug: "kids-fashion", nombre: "Kids Trend", descripcion: "Ropa infantil cómoda y colorida.", owner: "Mariela Torres", avatarUrl: "https://i.pravatar.cc/150?img=46", bannerUrl: imagenesMercado[3], rating: 4.8, ventasMes: 198 },
  { id: "s5", slug: "zapateria-belgrano", nombre: "Belgrano Steps", descripcion: "Calzado urbano para toda la familia.", owner: "Ariel Sánchez", avatarUrl: "https://i.pravatar.cc/150?img=20", bannerUrl: imagenesMercado[4], rating: 4.6, ventasMes: 184 },
  { id: "s6", slug: "glamour-night", nombre: "Glam Night Label", descripcion: "Looks de noche y eventos.", owner: "Karen Valdez", avatarUrl: "https://i.pravatar.cc/150?img=28", bannerUrl: imagenesMercado[5], rating: 4.9, ventasMes: 143 },
  { id: "s7", slug: "sport-total", nombre: "SportPeak", descripcion: "Prendas técnicas deportivas.", owner: "Fernando Almada", avatarUrl: "https://i.pravatar.cc/150?img=15", bannerUrl: imagenesMercado[0], rating: 4.7, ventasMes: 164 },
  { id: "s8", slug: "basicos-premium", nombre: "BaseLab", descripcion: "Básicos premium en algodón.", owner: "Lucía Pereyra", avatarUrl: "https://i.pravatar.cc/150?img=39", bannerUrl: imagenesMercado[1], rating: 4.8, ventasMes: 211 },
  { id: "s9", slug: "accesorios-wow", nombre: "WOW Bags", descripcion: "Accesorios y marroquinería.", owner: "Jesica Vera", avatarUrl: "https://i.pravatar.cc/150?img=31", bannerUrl: imagenesMercado[2], rating: 4.6, ventasMes: 137 },
  { id: "s10", slug: "invierno-calido", nombre: "Invierno Norte", descripcion: "Abrigos, paños y camperas.", owner: "Ezequiel Montenegro", avatarUrl: "https://i.pravatar.cc/150?img=67", bannerUrl: imagenesMercado[3], rating: 4.8, ventasMes: 173 },
  { id: "s11", slug: "verano-eterno", nombre: "Summer Loop", descripcion: "Colección verano y playa.", owner: "Yanina Silva", avatarUrl: "https://i.pravatar.cc/150?img=25", bannerUrl: imagenesMercado[4], rating: 4.9, ventasMes: 205 },
  { id: "s12", slug: "denim-co", nombre: "Denim Republic", descripcion: "Especialistas en denim.", owner: "Leandro Quiroga", avatarUrl: "https://i.pravatar.cc/150?img=59", bannerUrl: imagenesMercado[5], rating: 4.7, ventasMes: 191 },
  { id: "s13", slug: "ejecutiva-moda", nombre: "Exec Femme", descripcion: "Sastrería moderna femenina.", owner: "Soledad Medina", avatarUrl: "https://i.pravatar.cc/150?img=36", bannerUrl: imagenesMercado[0], rating: 4.8, ventasMes: 121 },
  { id: "s14", slug: "street-kings", nombre: "Kings Dept", descripcion: "Moda masculina urbana.", owner: "Darío Villalba", avatarUrl: "https://i.pravatar.cc/150?img=68", bannerUrl: imagenesMercado[1], rating: 4.6, ventasMes: 157 },
  { id: "s15", slug: "outlet-express", nombre: "Outlet Flash", descripcion: "Saldos y oportunidades.", owner: "Noelia Páez", avatarUrl: "https://i.pravatar.cc/150?img=44", bannerUrl: imagenesMercado[5], rating: 4.5, ventasMes: 289 },
];

const catalogItems = [
  { nombre: "Remera básica blanca", categoria: "Remeras", foto: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", descripcion: "Algodón suave, corte clásico para venta minorista y mayorista.", precio: 12000, precioMayorista: 9500, talle: "S, M, L, XL", color: "Blanco", stock: 26 },
  { nombre: "Remera negra cuello redondo", categoria: "Remeras", foto: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400", descripcion: "Modelo urbano de alta rotación en feria.", precio: 13500, precioMayorista: 10500, talle: "M, L, XL", color: "Negro", stock: 22 },
  { nombre: "Remera estampada urbana", categoria: "Remeras", foto: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", descripcion: "Estampa frontal para público joven.", precio: 14800, precioMayorista: 11600, talle: "S, M, L", color: "Gris", stock: 19 },
  { nombre: "Remera oversize", categoria: "Remeras", foto: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400", descripcion: "Calce amplio, tendencia oversize.", precio: 15500, precioMayorista: 12400, talle: "M, L, XL", color: "Beige", stock: 17 },

  { nombre: "Jean recto clásico", categoria: "Pantalones", foto: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", descripcion: "Denim resistente y tiro medio.", precio: 28500, precioMayorista: 23500, talle: "38, 40, 42, 44", color: "Azul", stock: 18 },
  { nombre: "Jean skinny", categoria: "Pantalones", foto: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", descripcion: "Jean elastizado con ajuste slim.", precio: 27900, precioMayorista: 22900, talle: "36, 38, 40, 42", color: "Azul oscuro", stock: 14 },
  { nombre: "Pantalón cargo", categoria: "Pantalones", foto: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", descripcion: "Bolsillos laterales, estilo urbano.", precio: 31000, precioMayorista: 25800, talle: "M, L, XL", color: "Verde oliva", stock: 16 },
  { nombre: "Jogging deportivo", categoria: "Pantalones", foto: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", descripcion: "Frisa liviana para uso diario.", precio: 21000, precioMayorista: 17000, talle: "S, M, L, XL", color: "Gris", stock: 24 },

  { nombre: "Vestido floral", categoria: "Vestidos", foto: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", descripcion: "Vestido liviano estampado para primavera-verano.", precio: 24500, precioMayorista: 19800, talle: "S, M, L", color: "Floral", stock: 13 },
  { nombre: "Vestido negro básico", categoria: "Vestidos", foto: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400", descripcion: "Modelo versátil de salida y uso diario.", precio: 25900, precioMayorista: 20800, talle: "S, M, L", color: "Negro", stock: 11 },
  { nombre: "Vestido casual de feria", categoria: "Vestidos", foto: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", descripcion: "Corte cómodo y buena rotación.", precio: 23800, precioMayorista: 18900, talle: "M, L", color: "Estampado", stock: 12 },
  { nombre: "Vestido midi urbano", categoria: "Vestidos", foto: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400", descripcion: "Caída suave para venta de temporada.", precio: 26800, precioMayorista: 21400, talle: "S, M, L", color: "Negro", stock: 10 },

  { nombre: "Zapatilla deportiva", categoria: "Calzado", foto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", descripcion: "Running liviana para uso urbano.", precio: 42000, precioMayorista: 36000, talle: "38, 39, 40, 41, 42", color: "Rojo", stock: 15 },
  { nombre: "Zapatilla urbana", categoria: "Calzado", foto: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", descripcion: "Diseño urbano clásico para stock fijo.", precio: 39500, precioMayorista: 33500, talle: "37, 38, 39, 40, 41", color: "Blanco", stock: 18 },
  { nombre: "Zapatilla deportiva negra", categoria: "Calzado", foto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", descripcion: "Versión oscura de alta salida.", precio: 40900, precioMayorista: 34900, talle: "39, 40, 41, 42", color: "Negro", stock: 14 },
  { nombre: "Zapatilla urbana blanca", categoria: "Calzado", foto: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", descripcion: "Perfil casual para outfits diarios.", precio: 39800, precioMayorista: 33800, talle: "36, 37, 38, 39, 40", color: "Blanco", stock: 17 },

  { nombre: "Cinturón cuero", categoria: "Accesorios", foto: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400", descripcion: "Accesorio básico de alta demanda.", precio: 9800, precioMayorista: 7600, talle: "Único", color: "Marrón", stock: 30 },
  { nombre: "Cartera de mano", categoria: "Accesorios", foto: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", descripcion: "Cartera compacta para venta minorista.", precio: 17500, precioMayorista: 13900, talle: "Único", color: "Negro", stock: 21 },
  { nombre: "Cartera de mano beige", categoria: "Accesorios", foto: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", descripcion: "Variante neutra para combo mayorista.", precio: 17900, precioMayorista: 14200, talle: "Único", color: "Beige", stock: 19 },
] as const;

export function getDemoStoreBySlug(slug: string) {
  return demoStores.find((s) => s.slug === slug);
}

export const demoProducts: DemoProduct[] = catalogItems.map((item, i) => {
  const store = demoStores[i % demoStores.length];
  const descuentoPct = 12 + (i % 4) * 4;
  const original = Math.round((item.precio * (100 / (100 - descuentoPct))) / 100) * 100;
  const wa = `+549115555${String(1000 + (i % 9000)).slice(-4)}`;
  const envio_metodos = { retiro: true, correo: i % 3 !== 0, oca: i % 2 === 0, andreani: i % 4 === 0 };
  return {
    id: `demo-${i + 1}`,
    tienda_id: store.id,
    nombre: item.nombre,
    marca: store.nombre,
    descripcion: item.descripcion,
    precio: item.precio,
    precio_lista: original,
    precio_mayorista: item.precioMayorista,
    categoria: item.categoria,
    talle: item.talle,
    color: item.color,
    stock: item.stock,
    fotos: [item.foto],
    activo: true,
    destacado: i % 6 === 0,
    created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    tiendas: {
      slug: store.slug,
      nombre: store.nombre,
      logo_url: null,
      whatsapp: wa,
      direccion: "La Salada — Colectora Oeste (demo)",
      envio_metodos,
    },
    precioOriginal: original,
    descuentoPct,
    nuevo: i % 5 === 0,
  };
});

export function getDemoProductById(id: string): DemoProduct | undefined {
  return demoProducts.find((p) => p.id === id);
}

export const demoProductsTiendaDemo = demoProducts;
