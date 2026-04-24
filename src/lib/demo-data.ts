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
  { id: "s1", slug: "urbanstyle-ba", nombre: "UrbanStyle BA", descripcion: "Ropa urbana y streetwear", owner: "Kevin Benítez", avatarUrl: "https://i.pravatar.cc/150?img=11", bannerUrl: "https://picsum.photos/seed/store1/1200/420", rating: 4.8, ventasMes: 312 },
  { id: "s2", slug: "moda-femenina-ceci", nombre: "Moda Femenina Ceci", descripcion: "Vestidos y blusas", owner: "Cecilia Ríos", avatarUrl: "https://i.pravatar.cc/150?img=32", bannerUrl: "https://picsum.photos/seed/store2/1200/420", rating: 4.9, ventasMes: 268 },
  { id: "s3", slug: "el-vaquero", nombre: "El Vaquero", descripcion: "Jeans y ropa de trabajo", owner: "Roberto Gómez", avatarUrl: "https://i.pravatar.cc/150?img=53", bannerUrl: "https://picsum.photos/seed/store3/1200/420", rating: 4.7, ventasMes: 227 },
  { id: "s4", slug: "kids-fashion", nombre: "Kids Fashion", descripcion: "Ropa infantil", owner: "Mariela Torres", avatarUrl: "https://i.pravatar.cc/150?img=46", bannerUrl: "https://picsum.photos/seed/store4/1200/420", rating: 4.8, ventasMes: 198 },
  { id: "s5", slug: "zapateria-belgrano", nombre: "Zapatería Belgrano", descripcion: "Calzado familiar", owner: "Ariel Sánchez", avatarUrl: "https://i.pravatar.cc/150?img=20", bannerUrl: "https://picsum.photos/seed/store5/1200/420", rating: 4.6, ventasMes: 184 },
  { id: "s6", slug: "glamour-night", nombre: "Glamour Night", descripcion: "Fiesta y eventos", owner: "Karen Valdez", avatarUrl: "https://i.pravatar.cc/150?img=28", bannerUrl: "https://picsum.photos/seed/store6/1200/420", rating: 4.9, ventasMes: 143 },
  { id: "s7", slug: "sport-total", nombre: "Sport Total", descripcion: "Ropa deportiva", owner: "Fernando Almada", avatarUrl: "https://i.pravatar.cc/150?img=15", bannerUrl: "https://picsum.photos/seed/store7/1200/420", rating: 4.7, ventasMes: 164 },
  { id: "s8", slug: "basicos-premium", nombre: "Básicos Premium", descripcion: "Remeras de calidad", owner: "Lucía Pereyra", avatarUrl: "https://i.pravatar.cc/150?img=39", bannerUrl: "https://picsum.photos/seed/store8/1200/420", rating: 4.8, ventasMes: 211 },
  { id: "s9", slug: "accesorios-wow", nombre: "Accesorios Wow", descripcion: "Carteras y bijou", owner: "Jesica Vera", avatarUrl: "https://i.pravatar.cc/150?img=31", bannerUrl: "https://picsum.photos/seed/store9/1200/420", rating: 4.6, ventasMes: 137 },
  { id: "s10", slug: "invierno-calido", nombre: "Invierno Cálido", descripcion: "Abrigos y camperas", owner: "Ezequiel Montenegro", avatarUrl: "https://i.pravatar.cc/150?img=67", bannerUrl: "https://picsum.photos/seed/store10/1200/420", rating: 4.8, ventasMes: 173 },
  { id: "s11", slug: "verano-eterno", nombre: "Verano Eterno", descripcion: "Playa y verano", owner: "Yanina Silva", avatarUrl: "https://i.pravatar.cc/150?img=25", bannerUrl: "https://picsum.photos/seed/store11/1200/420", rating: 4.9, ventasMes: 205 },
  { id: "s12", slug: "denim-co", nombre: "Denim & Co", descripcion: "Todo en jean", owner: "Leandro Quiroga", avatarUrl: "https://i.pravatar.cc/150?img=59", bannerUrl: "https://picsum.photos/seed/store12/1200/420", rating: 4.7, ventasMes: 191 },
  { id: "s13", slug: "ejecutiva-moda", nombre: "Ejecutiva Moda", descripcion: "Formal mujer", owner: "Soledad Medina", avatarUrl: "https://i.pravatar.cc/150?img=36", bannerUrl: "https://picsum.photos/seed/store13/1200/420", rating: 4.8, ventasMes: 121 },
  { id: "s14", slug: "street-kings", nombre: "Street Kings", descripcion: "Moda masculina urbana", owner: "Darío Villalba", avatarUrl: "https://i.pravatar.cc/150?img=68", bannerUrl: "https://picsum.photos/seed/store14/1200/420", rating: 4.6, ventasMes: 157 },
  { id: "s15", slug: "outlet-express", nombre: "Outlet Express", descripcion: "Saldos y ofertas", owner: "Noelia Páez", avatarUrl: "https://i.pravatar.cc/150?img=44", bannerUrl: "https://picsum.photos/seed/store15/1200/420", rating: 4.5, ventasMes: 289 },
];

const names = [
  "Remera oversize estampada", "Jean mom tiro alto", "Vestido midi floreado", "Zapatilla urbana cuero",
  "Riñonera premium", "Campera puffer corta", "Buzo canguro frizado", "Calza deportiva compresión",
  "Top básico ribb", "Pantalón cargo unisex", "Blusa manga globo", "Short denim elastizado",
  "Botita caña corta", "Cartera bandolera", "Abrigo paño largo", "Jogger rustico",
  "Remera lisa premium", "Jean recto clásico", "Vestido satén fiesta", "Sandalia plataforma",
  "Gorra trucker", "Campera bomber", "Conjunto deportivo", "Musculosa dry-fit",
  "Sweater cuello alto", "Pantalón sastrero", "Blazer entallado", "Oxford charol",
  "Cinturón hebilla", "Tapado lana", "Bikini tiro alto", "Malla enteriza",
  "Camisa denim", "Chaleco puffer", "Remera crop", "Pantalón palazzo",
  "Vestido largo escote V", "Zapatilla running", "Mochila urbana", "Campera softshell",
  "Buzo estampado", "Jean skinny", "Pollera tableada", "Sandalia taco medio",
  "Lentes retro", "Piloto impermeable", "Bermuda gabardina", "Traje mujer slim",
  "Camisa overshirt", "Remera outlet 2x1",
];

const cats = ["Remeras", "Pantalones", "Vestidos", "Calzado", "Accesorios", "Abrigos", "Deportivo"];
const talles = ["XS", "S", "M", "L", "XL", "XXL"];
const colores = ["Negro", "Blanco", "Azul", "Rojo", "Verde", "Gris", "Beige"];
const marcas = [
  "URBX", "Ceci Studio", "Vaquero Pro", "MiniTrend", "Belgrano Steps",
  "Glam Night Label", "SportPeak", "BaseLab", "WOW Bags", "Invierno Norte",
  "Summer Loop", "Denim Republic", "Exec Femme", "Kings Dept", "Outlet Flash",
];

export const demoProducts: DemoProduct[] = names.map((n, i) => {
  const store = demoStores[i % demoStores.length];
  const price = 8000 + ((i * 1700) % 77000);
  const descuentoPct = 20 + (i % 5) * 10;
  const original = Math.round((price * (100 / (100 - descuentoPct))) / 100) * 100;
  return {
    id: `demo-${i + 1}`,
    tienda_id: store.id,
    nombre: n,
    marca: marcas[i % marcas.length],
    descripcion: `${n} ideal para uso diario con excelente relación precio-calidad.`,
    precio: price,
    categoria: cats[i % cats.length],
    talle: talles[i % talles.length],
    color: colores[i % colores.length],
    stock: 5 + (i % 25),
    fotos: [`https://picsum.photos/400/500?random=${i + 1}`],
    activo: true,
    destacado: i % 7 === 0,
    created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    tiendas: { slug: store.slug, nombre: store.nombre, logo_url: null },
    precioOriginal: original,
    descuentoPct,
    nuevo: i % 6 === 0,
  };
});
