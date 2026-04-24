-- Extensión
create extension if not exists "pgcrypto";

-- TIENDAS
create table if not exists public.tiendas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  slug text unique not null,
  nombre text not null,
  descripcion text,
  descripcion_larga text,
  logo_url text,
  banner_url text,
  color_principal text default '#F97316',
  banner_texto text,
  whatsapp text,
  facebook text,
  tiktok text,
  instagram text,
  horarios text,
  activa boolean not null default true,
  plan text not null default 'free' check (plan in ('free','premium')),
  comision_pct numeric(5,2) not null default 5.00,
  mp_access_token text,
  created_at timestamptz not null default now()
);

-- PRODUCTOS
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas(id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(12,2) not null,
  precio_mayorista numeric(12,2),
  precio_promocional numeric(12,2),
  categoria text,
  sku text,
  tallas text[] default '{}',
  colores text[] default '{}',
  stock integer not null default 0,
  fotos text[] not null default '{}',
  activo boolean not null default true,
  destacado boolean not null default false,
  envio_gratis boolean default false,
  created_at timestamptz not null default now()
);

-- PEDIDOS
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas(id) on delete cascade,
  comprador_email text,
  comprador_nombre text,
  comprador_telefono text,
  direccion_envio text,
  items jsonb not null default '[]',
  total numeric(12,2) not null,
  comision_cobrada numeric(12,2) not null default 0,
  mp_payment_id text,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

-- PERFILES
create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  telefono text,
  direccion text,
  created_at timestamptz not null default now()
);

-- ÍNDICES
create index if not exists tiendas_owner_idx on public.tiendas(owner_id);
create index if not exists tiendas_slug_idx on public.tiendas(slug);
create index if not exists productos_tienda_idx on public.productos(tienda_id);
create index if not exists productos_activo_idx on public.productos(activo, created_at desc);
create index if not exists pedidos_tienda_idx on public.pedidos(tienda_id, created_at desc);

-- RLS
alter table public.tiendas enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.perfiles enable row level security;

drop policy if exists "tiendas_public_read" on public.tiendas;
drop policy if exists "productos_public_read" on public.productos;
drop policy if exists "tiendas_owner_all" on public.tiendas;
drop policy if exists "productos_owner_manage" on public.productos;
drop policy if exists "pedidos_owner_read" on public.pedidos;
drop policy if exists "pedidos_insert_api" on public.pedidos;
drop policy if exists "perfiles_own" on public.perfiles;

create policy "tiendas_public_read" on public.tiendas for select using (activa = true);
create policy "productos_public_read" on public.productos for select using (activo = true);
create policy "tiendas_owner_all" on public.tiendas for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "productos_owner_manage" on public.productos for all
  using (exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid()))
  with check (exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid()));
create policy "pedidos_owner_read" on public.pedidos for select
  using (exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid()));
create policy "pedidos_insert_api" on public.pedidos for insert with check (true);
create policy "perfiles_own" on public.perfiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- TIENDA DEMO
insert into public.tiendas (id, slug, nombre, descripcion, descripcion_larga, color_principal, whatsapp, horarios, activa, plan)
values ('a0000000-0000-0000-0000-000000000001', 'moda-la-salada-demo', 'Moda La Salada', 'Ropa mayorista y minorista directa de feria.', 'Somos feriantes de La Salada con más de 10 años de experiencia. Vendemos ropa de calidad a precios de feria, mayorista y minorista. Envíos a todo el país.', '#F97316', '5491112345678', 'Lun a Dom 8 a 20hs', true, 'premium')
on conflict (slug) do nothing;

-- PRODUCTOS DEMO REALES
insert into public.productos (tienda_id, nombre, descripcion, precio, precio_mayorista, categoria, sku, tallas, colores, stock, fotos, activo, destacado) values
('a0000000-0000-0000-0000-000000000001','Remera básica algodón','100% algodón peinado, corte recto.',8500,6800,'Remeras','REM-001',ARRAY['S','M','L','XL'],ARRAY['Blanco','Negro','Gris'],50,ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Remera oversize estampada','Oversize con estampa urbana, tendencia temporada.',11000,8800,'Remeras','REM-002',ARRAY['S','M','L','XL','XXL'],ARRAY['Negro','Blanco'],30,ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Remera cuello V slim','Entallada cuello V, tela suave al tacto.',9500,7600,'Remeras','REM-003',ARRAY['S','M','L'],ARRAY['Blanco','Rosa','Celeste'],40,ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Remera manga larga rayada','Manga larga rayas horizontales, muy combinable.',10500,8400,'Remeras','REM-004',ARRAY['S','M','L','XL'],ARRAY['Azul/Blanco','Negro/Gris'],25,ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Jean recto clásico','Corte recto tiro medio, el básico que no puede faltar.',18500,14800,'Pantalones','PAN-001',ARRAY['36','38','40','42','44'],ARRAY['Azul oscuro','Negro'],35,ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Jean skinny elastizado','Con lycra, muy cómodo, queda perfecto en todas las figuras.',19500,15600,'Pantalones','PAN-002',ARRAY['36','38','40','42'],ARRAY['Azul','Negro','Gris'],28,ARRAY['https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Pantalón cargo gabardina','Bolsillos laterales, tela gabardina resistente.',22000,17600,'Pantalones','PAN-003',ARRAY['38','40','42','44','46'],ARRAY['Beige','Verde militar','Negro'],20,ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Jogging deportivo frisa','Con puño, tela frisa suave, ideal para el frío.',16000,12800,'Pantalones','PAN-004',ARRAY['S','M','L','XL'],ARRAY['Negro','Gris','Azul marino'],45,ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Vestido floral verano','Liviano con estampa floral, perfecto para el calor.',21000,16800,'Vestidos','VES-001',ARRAY['S','M','L','XL'],ARRAY['Floral rosa','Floral azul'],22,ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Vestido negro básico','El clásico negro para todo. Tela crepé.',19500,15600,'Vestidos','VES-002',ARRAY['S','M','L'],ARRAY['Negro'],18,ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Vestido midi estampado','Largo a la rodilla, manga corta, tela liviana.',23000,18400,'Vestidos','VES-003',ARRAY['S','M','L','XL'],ARRAY['Multicolor','Verde'],15,ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Enterito jean','Con tiradores regulables, muy de moda.',25000,20000,'Vestidos','VES-004',ARRAY['S','M','L'],ARRAY['Azul claro','Azul oscuro'],12,ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Zapatilla deportiva running','Liviana con suela amortiguada, para deporte y calle.',35000,28000,'Calzado','CAL-001',ARRAY['36','37','38','39','40','41'],ARRAY['Blanco','Negro','Gris'],30,ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Zapatilla urbana cuero eco','Cuero ecológico, estilo casual.',32000,25600,'Calzado','CAL-002',ARRAY['36','37','38','39','40','41','42'],ARRAY['Blanco','Negro'],25,ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Sandalia de tiras','Tiras cruzadas, cómoda para el verano.',18000,14400,'Calzado','CAL-003',ARRAY['35','36','37','38','39','40'],ARRAY['Beige','Negro','Blanco'],40,ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Bota cuero invierno','Caña media, cuero eco, suela antideslizante.',48000,38400,'Calzado','CAL-004',ARRAY['35','36','37','38','39','40'],ARRAY['Negro','Marrón'],15,ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Cinturón cuero trenzado','Hebilla dorada, talle único ajustable.',7500,6000,'Accesorios','ACC-001',ARRAY['Único'],ARRAY['Marrón','Negro'],60,ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400'],true,false),
('a0000000-0000-0000-0000-000000000001','Cartera de mano','Cuero ecológico, ideal para salir.',15000,12000,'Accesorios','ACC-002',ARRAY['Único'],ARRAY['Negro','Beige','Rojo'],35,ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],true,true),
('a0000000-0000-0000-0000-000000000001','Gorra visera plana','Snapback tela combinada, estilo urbano.',9000,7200,'Accesorios','ACC-003',ARRAY['Único'],ARRAY['Negro','Azul','Rojo'],50,ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400'],true,false);
