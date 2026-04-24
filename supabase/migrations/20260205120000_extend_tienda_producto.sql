-- Ejecutar en Supabase SQL Editor si aún no tenés estas columnas
alter table public.tiendas add column if not exists whatsapp text;
alter table public.tiendas add column if not exists instagram text;
alter table public.tiendas add column if not exists direccion text;
alter table public.tiendas add column if not exists envio_metodos jsonb not null default '{"retiro": true, "correo": false, "oca": false, "andreani": false}'::jsonb;

alter table public.productos add column if not exists marca text;
alter table public.productos add column if not exists precio_lista numeric(12, 2);

comment on column public.tiendas.envio_metodos is 'Métodos de envío activos: retiro, correo, oca, andreani (boolean)';
