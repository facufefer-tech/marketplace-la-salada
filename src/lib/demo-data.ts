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

const talles = ["XS", "S", "M", "L", "XL", "XXL"];
const colores = ["Negro", "Blanco", "Azul", "Rojo", "Verde", "Gris", "Beige"];

const photoByCategory: Record<string, string[]> = {
  Remeras: [
    imagenesMercado[0],
    imagenesMercado[2],
  ],
  Pantalones: [
    imagenesMercado[3],
    imagenesMercado[1],
  ],
  Vestidos: [
    imagenesMercado[4],
    imagenesMercado[5],
  ],
  Calzado: [
    imagenesMercado[1],
    imagenesMercado[2],
  ],
  Accesorios: [
    imagenesMercado[5],
    imagenesMercado[3],
  ],
  Abrigos: [
    imagenesMercado[4],
    imagenesMercado[0],
  ],
  Deportivo: [
    imagenesMercado[2],
    imagenesMercado[1],
  ],
};

const catalogItems: Array<{ nombre: string; categoria: keyof typeof photoByCategory }> = [
  { nombre: "Remera oversize estampada", categoria: "Remeras" },
  { nombre: "Remera básica cuello redondo", categoria: "Remeras" },
  { nombre: "Top crop rib slim", categoria: "Remeras" },
  { nombre: "Musculosa algodón premium", categoria: "Remeras" },
  { nombre: "Remera boxy manga corta", categoria: "Remeras" },
  { nombre: "Jean mom tiro alto", categoria: "Pantalones" },
  { nombre: "Jean recto clásico", categoria: "Pantalones" },
  { nombre: "Pantalón cargo gabardina", categoria: "Pantalones" },
  { nombre: "Jogger frisa premium", categoria: "Pantalones" },
  { nombre: "Pantalón sastrero wide leg", categoria: "Pantalones" },
  { nombre: "Vestido midi floreado", categoria: "Vestidos" },
  { nombre: "Vestido satén fiesta", categoria: "Vestidos" },
  { nombre: "Vestido largo escote V", categoria: "Vestidos" },
  { nombre: "Vestido camisero lino", categoria: "Vestidos" },
  { nombre: "Vestido casual de punto", categoria: "Vestidos" },
  { nombre: "Zapatilla urbana cuero", categoria: "Calzado" },
  { nombre: "Sandalia plataforma", categoria: "Calzado" },
  { nombre: "Botita caña corta", categoria: "Calzado" },
  { nombre: "Zapatilla running liviana", categoria: "Calzado" },
  { nombre: "Mocasín urbano flexible", categoria: "Calzado" },
  { nombre: "Riñonera premium", categoria: "Accesorios" },
  { nombre: "Cartera bandolera mini", categoria: "Accesorios" },
  { nombre: "Mochila urbana reforzada", categoria: "Accesorios" },
  { nombre: "Cinturón cuero ecológico", categoria: "Accesorios" },
  { nombre: "Lentes de sol retro", categoria: "Accesorios" },
  { nombre: "Campera puffer corta", categoria: "Abrigos" },
  { nombre: "Abrigo paño largo", categoria: "Abrigos" },
  { nombre: "Tapado lana premium", categoria: "Abrigos" },
  { nombre: "Campera bomber clásica", categoria: "Abrigos" },
  { nombre: "Piloto impermeable", categoria: "Abrigos" },
  { nombre: "Calza deportiva compresión", categoria: "Deportivo" },
  { nombre: "Conjunto deportivo dry-fit", categoria: "Deportivo" },
  { nombre: "Musculosa training", categoria: "Deportivo" },
  { nombre: "Buzo deportivo cierre medio", categoria: "Deportivo" },
  { nombre: "Short running técnico", categoria: "Deportivo" },
  { nombre: "Remera básica lisa", categoria: "Remeras" },
  { nombre: "Remera manga larga modal", categoria: "Remeras" },
  { nombre: "Jean skinny elastizado", categoria: "Pantalones" },
  { nombre: "Pantalón palazzo crepe", categoria: "Pantalones" },
  { nombre: "Vestido noche brillo", categoria: "Vestidos" },
  { nombre: "Vestido mini volados", categoria: "Vestidos" },
  { nombre: "Borcego urbano", categoria: "Calzado" },
  { nombre: "Sandalia taco medio", categoria: "Calzado" },
  { nombre: "Billetera compacta", categoria: "Accesorios" },
  { nombre: "Gorra trucker", categoria: "Accesorios" },
  { nombre: "Chaleco puffer", categoria: "Abrigos" },
  { nombre: "Campera softshell", categoria: "Abrigos" },
  { nombre: "Top deportivo seamless", categoria: "Deportivo" },
  { nombre: "Jogger deportivo slim", categoria: "Deportivo" },
  { nombre: "Remera outlet 2x1", categoria: "Remeras" },
];

export function getDemoStoreBySlug(slug: string) {
  return demoStores.find((s) => s.slug === slug);
}

export const demoProducts: DemoProduct[] = catalogItems.map((item, i) => {
  const store = demoStores[i % demoStores.length];
  const price = 9000 + ((i * 1900) % 76000);
  const descuentoPct = 20 + (i % 5) * 10;
  const original = Math.round((price * (100 / (100 - descuentoPct))) / 100) * 100;
  const categoryPhotos = photoByCategory[item.categoria];
  const photo = categoryPhotos[i % categoryPhotos.length];
  const photo2 = categoryPhotos[(i + 1) % categoryPhotos.length];
  const wa = `+549115555${String(1000 + (i % 9000)).slice(-4)}`;
  const envio_metodos = {
    retiro: true,
    correo: i % 3 !== 0,
    oca: i % 2 === 0,
    andreani: i % 4 === 0,
  };
  return {
    id: `demo-${i + 1}`,
    tienda_id: store.id,
    nombre: item.nombre,
    marca: store.nombre,
    descripcion: `${item.nombre} con moldería argentina, tela seleccionada y terminaciones reforzadas. Ideal para venta minorista y mayorista con alta rotación.`,
    precio: price,
    precio_lista: original,
    categoria: item.categoria,
    talle: talles[i % talles.length],
    color: colores[i % colores.length],
    stock: 5 + (i % 25),
    fotos: [photo, photo2],
    activo: true,
    destacado: i % 7 === 0,
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
    nuevo: i % 6 === 0,
  };
});

export function getDemoProductById(id: string): DemoProduct | undefined {
  return demoProducts.find((p) => p.id === id);
}

/** Mismos 50 productos demo del sitio, para el panel de Tienda Demo */
export const demoProductsTiendaDemo = demoProducts;
