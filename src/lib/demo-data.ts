import type { Producto } from "@/lib/types";

export type DemoStore = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
};

export type DemoProduct = Producto & {
  precioOriginal: number;
  descuentoPct: number;
  nuevo: boolean;
};

export const demoStores: DemoStore[] = [
  { id: "s1", slug: "urbanstyle-ba", nombre: "UrbanStyle BA", descripcion: "Ropa urbana y streetwear" },
  { id: "s2", slug: "moda-femenina-ceci", nombre: "Moda Femenina Ceci", descripcion: "Vestidos y blusas" },
  { id: "s3", slug: "el-vaquero", nombre: "El Vaquero", descripcion: "Jeans y ropa de trabajo" },
  { id: "s4", slug: "kids-fashion", nombre: "Kids Fashion", descripcion: "Ropa infantil" },
  { id: "s5", slug: "zapateria-belgrano", nombre: "Zapatería Belgrano", descripcion: "Calzado familiar" },
  { id: "s6", slug: "glamour-night", nombre: "Glamour Night", descripcion: "Fiesta y eventos" },
  { id: "s7", slug: "sport-total", nombre: "Sport Total", descripcion: "Ropa deportiva" },
  { id: "s8", slug: "basicos-premium", nombre: "Básicos Premium", descripcion: "Remeras de calidad" },
  { id: "s9", slug: "accesorios-wow", nombre: "Accesorios Wow", descripcion: "Carteras y bijou" },
  { id: "s10", slug: "invierno-calido", nombre: "Invierno Cálido", descripcion: "Abrigos y camperas" },
  { id: "s11", slug: "verano-eterno", nombre: "Verano Eterno", descripcion: "Playa y verano" },
  { id: "s12", slug: "denim-co", nombre: "Denim & Co", descripcion: "Todo en jean" },
  { id: "s13", slug: "ejecutiva-moda", nombre: "Ejecutiva Moda", descripcion: "Formal mujer" },
  { id: "s14", slug: "street-kings", nombre: "Street Kings", descripcion: "Moda masculina urbana" },
  { id: "s15", slug: "outlet-express", nombre: "Outlet Express", descripcion: "Saldos y ofertas" },
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

export const demoProducts: DemoProduct[] = names.map((n, i) => {
  const store = demoStores[i % demoStores.length];
  const price = 8000 + ((i * 1700) % 77000);
  const descuentoPct = 20 + (i % 5) * 10;
  const original = Math.round((price * (100 / (100 - descuentoPct))) / 100) * 100;
  return {
    id: `demo-${i + 1}`,
    tienda_id: store.id,
    nombre: n,
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
