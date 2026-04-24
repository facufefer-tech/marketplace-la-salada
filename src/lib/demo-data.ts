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

export const demoStores: DemoStore[] = [
  { id: "s1", slug: "urbanstyle-ba", nombre: "UrbanStyle BA", descripcion: "Streetwear urbano para hombre y mujer.", owner: "Kevin Benítez", avatarUrl: "https://i.pravatar.cc/150?img=11", bannerUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80", rating: 4.8, ventasMes: 312 },
  { id: "s2", slug: "moda-femenina-ceci", nombre: "Ceci Studio", descripcion: "Moda femenina diaria y de oficina.", owner: "Cecilia Ríos", avatarUrl: "https://i.pravatar.cc/150?img=32", bannerUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80", rating: 4.9, ventasMes: 268 },
  { id: "s3", slug: "el-vaquero", nombre: "Vaquero Pro", descripcion: "Jean, gabardina y trabajo pesado.", owner: "Roberto Gómez", avatarUrl: "https://i.pravatar.cc/150?img=53", bannerUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80", rating: 4.7, ventasMes: 227 },
  { id: "s4", slug: "kids-fashion", nombre: "Kids Trend", descripcion: "Ropa infantil cómoda y colorida.", owner: "Mariela Torres", avatarUrl: "https://i.pravatar.cc/150?img=46", bannerUrl: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80", rating: 4.8, ventasMes: 198 },
  { id: "s5", slug: "zapateria-belgrano", nombre: "Belgrano Steps", descripcion: "Calzado urbano para toda la familia.", owner: "Ariel Sánchez", avatarUrl: "https://i.pravatar.cc/150?img=20", bannerUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80", rating: 4.6, ventasMes: 184 },
  { id: "s6", slug: "glamour-night", nombre: "Glam Night Label", descripcion: "Looks de noche y eventos.", owner: "Karen Valdez", avatarUrl: "https://i.pravatar.cc/150?img=28", bannerUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80", rating: 4.9, ventasMes: 143 },
  { id: "s7", slug: "sport-total", nombre: "SportPeak", descripcion: "Prendas técnicas deportivas.", owner: "Fernando Almada", avatarUrl: "https://i.pravatar.cc/150?img=15", bannerUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80", rating: 4.7, ventasMes: 164 },
  { id: "s8", slug: "basicos-premium", nombre: "BaseLab", descripcion: "Básicos premium en algodón.", owner: "Lucía Pereyra", avatarUrl: "https://i.pravatar.cc/150?img=39", bannerUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80", rating: 4.8, ventasMes: 211 },
  { id: "s9", slug: "accesorios-wow", nombre: "WOW Bags", descripcion: "Accesorios y marroquinería.", owner: "Jesica Vera", avatarUrl: "https://i.pravatar.cc/150?img=31", bannerUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80", rating: 4.6, ventasMes: 137 },
  { id: "s10", slug: "invierno-calido", nombre: "Invierno Norte", descripcion: "Abrigos, paños y camperas.", owner: "Ezequiel Montenegro", avatarUrl: "https://i.pravatar.cc/150?img=67", bannerUrl: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80", rating: 4.8, ventasMes: 173 },
  { id: "s11", slug: "verano-eterno", nombre: "Summer Loop", descripcion: "Colección verano y playa.", owner: "Yanina Silva", avatarUrl: "https://i.pravatar.cc/150?img=25", bannerUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80", rating: 4.9, ventasMes: 205 },
  { id: "s12", slug: "denim-co", nombre: "Denim Republic", descripcion: "Especialistas en denim.", owner: "Leandro Quiroga", avatarUrl: "https://i.pravatar.cc/150?img=59", bannerUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80", rating: 4.7, ventasMes: 191 },
  { id: "s13", slug: "ejecutiva-moda", nombre: "Exec Femme", descripcion: "Sastrería moderna femenina.", owner: "Soledad Medina", avatarUrl: "https://i.pravatar.cc/150?img=36", bannerUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80", rating: 4.8, ventasMes: 121 },
  { id: "s14", slug: "street-kings", nombre: "Kings Dept", descripcion: "Moda masculina urbana.", owner: "Darío Villalba", avatarUrl: "https://i.pravatar.cc/150?img=68", bannerUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80", rating: 4.6, ventasMes: 157 },
  { id: "s15", slug: "outlet-express", nombre: "Outlet Flash", descripcion: "Saldos y oportunidades.", owner: "Noelia Páez", avatarUrl: "https://i.pravatar.cc/150?img=44", bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80", rating: 4.5, ventasMes: 289 },
];

const talles = ["XS", "S", "M", "L", "XL", "XXL"];
const colores = ["Negro", "Blanco", "Azul", "Rojo", "Verde", "Gris", "Beige"];

const photoByCategory: Record<string, string[]> = {
  Remeras: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=900&q=80",
  ],
  Pantalones: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
  ],
  Vestidos: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  ],
  Calzado: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  ],
  Accesorios: [
    "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  ],
  Abrigos: [
    "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1548624313-0396c75f5e34?auto=format&fit=crop&w=900&q=80",
  ],
  Deportivo: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
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
