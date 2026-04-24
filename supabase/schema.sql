-- Marketplace La Salada — ejecutar en Supabase SQL Editor
-- Extensiones
create extension if not exists "pgcrypto";

-- Tiendas (owner_id vincula al feriante en auth.users)
create table public.tiendas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  slug text unique not null,
  nombre text not null,
  descripcion text,
  logo_url text,
  banner_url text,
  activa boolean not null default true,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  comision_pct numeric(5, 2) not null default 5.00,
  mp_access_token text,
  created_at timestamptz not null default now()
);

create index tiendas_owner_idx on public.tiendas (owner_id);
create index tiendas_slug_idx on public.tiendas (slug);
create index tiendas_activa_idx on public.tiendas (activa) where activa = true;

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(12, 2) not null,
  categoria text,
  talle text,
  color text,
  stock integer not null default 0,
  fotos text[] not null default '{}',
  activo boolean not null default true,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

create index productos_tienda_idx on public.productos (tienda_id);
create index productos_activo_destacado_idx on public.productos (activo, destacado, created_at desc);

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.tiendas (id) on delete cascade,
  comprador_email text,
  items jsonb not null default '[]',
  total numeric(12, 2) not null,
  comision_cobrada numeric(12, 2) not null default 0,
  mp_payment_id text,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create index pedidos_tienda_idx on public.pedidos (tienda_id, created_at desc);

create table public.publicidad (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid references public.tiendas (id) on delete cascade,
  tipo text,
  posicion text,
  activa boolean not null default true,
  fecha_inicio date,
  fecha_fin date,
  monto_pagado numeric(12, 2)
);

-- RLS
alter table public.tiendas enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.publicidad enable row level security;

-- Lectura pública: tiendas y productos activos
create policy "tiendas_public_read"
  on public.tiendas for select
  using (activa = true);

create policy "productos_public_read"
  on public.productos for select
  using (
    activo = true
    and exists (select 1 from public.tiendas t where t.id = tienda_id and t.activa = true)
  );

-- Feriante: su tienda
create policy "tiendas_owner_all"
  on public.tiendas for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Productos de la tienda del feriante
create policy "productos_owner_manage"
  on public.productos for all
  using (
    exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid())
  );

-- Pedidos: el feriante ve los de su tienda; insert público para checkout (anon) opcional
create policy "pedidos_owner_read"
  on public.pedidos for select
  using (
    exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid())
  );

create policy "pedidos_owner_update"
  on public.pedidos for update
  using (
    exists (select 1 from public.tiendas t where t.id = tienda_id and t.owner_id = auth.uid())
  );

-- Inserción de pedidos desde API con service role; si usás cliente anon, descomentá:
-- create policy "pedidos_anon_insert" on public.pedidos for insert with check (true);

create policy "publicidad_admin_all"
  on public.publicidad for all
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Realtime (habilitar en dashboard Supabase para pedidos/productos si hace falta)
alter publication supabase_realtime add table public.pedidos;
