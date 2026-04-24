-- ============================================================================
-- FASE 2 – Marketplace La Salada
-- Ejecutar en Supabase → SQL Editor (completo de una vez)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- TIENDAS
-- ---------------------------------------------------------------------------
alter table public.tiendas add column if not exists facebook text;
alter table public.tiendas add column if not exists tiktok text;
alter table public.tiendas add column if not exists color_primario text default '#f97316';
alter table public.tiendas add column if not exists banner_text text;
alter table public.tiendas add column if not exists descripcion_html text;
alter table public.tiendas add column if not exists horarios text;
alter table public.tiendas add column if not exists mi_historia text;
alter table public.tiendas add column if not exists historia_foto_url text;
alter table public.tiendas add column if not exists admin_estado text not null default 'activa';
alter table public.tiendas drop constraint if exists tiendas_admin_estado_check;
alter table public.tiendas add constraint tiendas_admin_estado_check check (admin_estado in ('pendiente', 'activa', 'suspendida'));

-- ---------------------------------------------------------------------------
-- PRODUCTOS
-- ---------------------------------------------------------------------------
alter table public.productos add column if not exists sku text;
alter table public.productos add column if not exists peso_gramos integer;
alter table public.productos add column if not exists material text;
alter table public.productos add column if not exists genero text;
alter table public.productos add column if not exists temporada text;
alter table public.productos add column if not exists etiquetas text[] default array[]::text[];
alter table public.productos add column if not exists seo_titulo text;
alter table public.productos add column if not exists seo_descripcion text;
alter table public.productos add column if not exists estado_publicacion text not null default 'publicado';
alter table public.productos drop constraint if exists productos_estado_publicacion_check;
alter table public.productos add constraint productos_estado_publicacion_check check (estado_publicacion in ('publicado', 'borrador', 'agotado'));
alter table public.productos add column if not exists foto_principal_index integer not null default 0;

-- ---------------------------------------------------------------------------
-- TABLAS NUEVAS
-- ---------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  talle text not null default 'Único',
  color text not null default 'Único',
  stock integer not null default 0,
  precio_extra numeric(12,2) not null default 0,
  precio_override numeric(12,2),
  sku text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (producto_id, talle, color)
);
create index if not exists idx_product_variants_producto on public.product_variants(producto_id);

create table if not exists public.envios_config (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas(id) on delete cascade,
  metodo text not null,
  activo boolean not null default true,
  precio numeric(12,2) not null default 0,
  descripcion text,
  tiempo_entrega text,
  unique (tienda_id, metodo)
);
create index if not exists idx_envios_tienda on public.envios_config(tienda_id);

create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre text,
  activo boolean not null default true,
  tiendas_seguidas uuid[] default array[]::uuid[],
  created_at timestamptz not null default now(),
  unique (email)
);
create index if not exists idx_newsletters_email on public.newsletters(lower(email));

create table if not exists public.descuentos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas(id) on delete cascade,
  codigo text,
  tipo text not null,
  valor numeric(12,2) not null,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  activo boolean not null default true,
  usos integer not null default 0,
  limite_usos integer,
  alcance text not null default 'todos',
  categoria text,
  producto_ids uuid[] default null,
  created_at timestamptz not null default now()
);
alter table public.descuentos drop constraint if exists descuentos_tipo_check;
alter table public.descuentos add constraint descuentos_tipo_check check (tipo in ('porcentaje', 'fijo', 'auto'));
alter table public.descuentos drop constraint if exists descuentos_alcance_check;
alter table public.descuentos add constraint descuentos_alcance_check check (alcance in ('todos', 'categoria', 'productos'));
create index if not exists idx_descuentos_tienda on public.descuentos(tienda_id);

create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  tienda_id uuid not null references public.tiendas(id) on delete cascade,
  comprador_email text,
  nombre text not null,
  estrellas smallint not null,
  comentario text,
  foto_url text,
  aprobada boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.resenas drop constraint if exists resenas_estrellas_check;
alter table public.resenas add constraint resenas_estrellas_check check (estrellas between 1 and 5);
create index if not exists idx_resenas_producto on public.resenas(producto_id);
create index if not exists idx_resenas_tienda on public.resenas(tienda_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.product_variants enable row level security;
alter table public.envios_config enable row level security;
alter table public.newsletters enable row level security;
alter table public.descuentos enable row level security;
alter table public.resenas enable row level security;

drop policy if exists "variantes_select_public" on public.product_variants;
drop policy if exists "variantes_owner" on public.product_variants;
create policy "variantes_select_public" on public.product_variants for select using (
  exists (
    select 1 from public.productos p
    join public.tiendas t on t.id = p.tienda_id
    where p.id = product_variants.producto_id and p.activo = true and t.activa = true
  )
);
create policy "variantes_owner" on public.product_variants for all using (
  exists (
    select 1 from public.productos p
    join public.tiendas t on t.id = p.tienda_id
    where p.id = product_variants.producto_id and t.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.productos p
    join public.tiendas t on t.id = p.tienda_id
    where p.id = product_variants.producto_id and t.owner_id = auth.uid()
  )
);

drop policy if exists "envios_select" on public.envios_config;
drop policy if exists "envios_owner" on public.envios_config;
create policy "envios_select" on public.envios_config for select using (true);
create policy "envios_owner" on public.envios_config for all using (
  exists (select 1 from public.tiendas t where t.id = envios_config.tienda_id and t.owner_id = auth.uid())
) with check (
  exists (select 1 from public.tiendas t where t.id = envios_config.tienda_id and t.owner_id = auth.uid())
);

drop policy if exists "newsletter_insert" on public.newsletters;
create policy "newsletter_insert" on public.newsletters for insert with check (true);

drop policy if exists "descuentos_read" on public.descuentos;
drop policy if exists "descuentos_owner" on public.descuentos;
create policy "descuentos_read" on public.descuentos for select using (true);
create policy "descuentos_owner" on public.descuentos for all using (
  exists (select 1 from public.tiendas t where t.id = descuentos.tienda_id and t.owner_id = auth.uid())
) with check (
  exists (select 1 from public.tiendas t where t.id = descuentos.tienda_id and t.owner_id = auth.uid())
);

drop policy if exists "resenas_select_public" on public.resenas;
drop policy if exists "resenas_insert" on public.resenas;
drop policy if exists "resenas_update_owner" on public.resenas;
create policy "resenas_select_public" on public.resenas for select using (aprobada = true);
create policy "resenas_insert" on public.resenas for insert with check (true);
create policy "resenas_update_owner" on public.resenas for update using (
  exists (select 1 from public.tiendas t where t.id = resenas.tienda_id and t.owner_id = auth.uid())
);
create policy "resenas_select_owner" on public.resenas for select using (
  exists (select 1 from public.tiendas t where t.id = resenas.tienda_id and t.owner_id = auth.uid())
);
