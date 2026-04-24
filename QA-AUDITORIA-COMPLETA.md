# QA técnico completo - Marketplace La Salada

Fecha: 2026-04-24

## Resumen ejecutivo
- Se auditó código real de páginas, APIs, flujos críticos, variables de entorno y schema.
- Había 5 gaps críticos de experiencia/flujo (ruta `/checkout`, alias `/tiendas`, fallback de tienda inexistente, errores silenciosos en formularios, home sin intento de carga real).
- Esos fixes críticos ya fueron aplicados y el proyecto compila correctamente (`npm run build` OK).

## PARTE 1 — Auditoría de páginas y contenido

### `/`
- **Sin datos Supabase:** ahora intenta carga real (`/api/productos`) y cae a `demoProducts` si no hay datos o falla.
- **Carga:** sí, skeleton/estado de carga en catálogo.
- **Errores Supabase:** sí, tolerante (fallback demo).

### `/tiendas`
- **Sin datos Supabase:** redirige a `/feriantes` (contenido demo realista).
- **Carga:** no aplica.
- **Errores Supabase:** no aplica (redirect server).

### `/[slug]`
- **Sin datos Supabase:** si hay demo para slug, usa demo; si no existe, muestra estado profesional “tienda en preparación / no encontrada” (sin página de error dura).
- **Carga:** server-render con fallback de contenido.
- **Errores Supabase:** sí, fallback visual en vez de crash.

### `/auth`
- **Sin datos Supabase:** formulario funcional (login/registro).
- **Carga:** sí (fallback Suspense simple).
- **Errores Supabase:** sí, muestra mensajes de error; agregado catch para errores de red/throw.

### `/dashboard`
- **Sin datos Supabase:** muestra métricas en 0 y onboarding.
- **Carga:** SSR, sin spinner explícito.
- **Errores Supabase:** parcialmente (no rompe fácil, pero no tiene boundary propio global).

### `/dashboard/tienda`
- **Sin datos Supabase:** form renderiza con valores vacíos.
- **Carga:** sí (carga de sub-secciones; envíos con loading).
- **Errores Supabase:** sí, API con fallback de columnas básicas + `error.tsx` para evitar pantalla en blanco.

### `/dashboard/productos`
- **Sin datos Supabase:** muestra estado vacío con CTA.
- **Carga:** sí (“Cargando productos…”).
- **Errores Supabase:** sí, mensaje visible en rojo.

### `/dashboard/productos/nuevo`
- **Sin datos Supabase:** funciona, permite crear producto.
- **Carga:** no requiere spinner inicial.
- **Errores Supabase:** sí, feedback de error; Cloudinary tiene fallback visual si falta config.

### `/dashboard/importar`
- **Sin datos Supabase:** UI funciona igual; import real requiere sesión/tienda.
- **Carga:** sí (barra de progreso).
- **Errores Supabase:** sí, reporte de errores por fila.

### `/carrito`
- **Sin datos Supabase:** si está vacío muestra CTA.
- **Carga:** no aplica.
- **Errores Supabase:** parciales; API envíos fallida no rompe, y checkout se deriva a `/checkout`.

### `/checkout` (nuevo fix aplicado)
- **Sin datos Supabase:** si carrito vacío muestra estado guiado.
- **Carga:** botón con estado “Iniciando pago…”.
- **Errores Supabase/MercadoPago:** sí, mensaje claro del error de API.

## PARTE 2 — Auditoría de flujos críticos

### FLUJO 1 — Registro nuevo
- Crea usuario en Supabase Auth: **sí** (`admin.auth.admin.createUser`).
- Crea tienda automática con slug único: **sí** (`slugUnico`).
- Redirige a dashboard: **sí** (login automático + push).
- Email existente: **sí**, devuelve error de Supabase al cliente.
- Slug existente: **sí**, reintenta y evita colisión.

### FLUJO 2 — Login
- Email/contraseña: **sí** (`signInWithPassword`).
- Redirección dashboard: **sí**.
- Credenciales incorrectas: **sí**, mensaje mostrado al usuario.

### FLUJO 3 — Editor tienda
- Carga datos actuales: **sí**.
- Guarda en Supabase: **sí** (`/api/dashboard/tienda`).
- Sin Cloudinary: **sí**, botón deshabilitado con explicación.
- Cambios visibles en pública: **sí** (iframe + refresh; server render por slug).

### FLUJO 4 — Crear producto nuevo
- Guarda en Supabase: **sí**.
- Sin imagen: **sí** (permitido).
- Con Cloudinary: **sí** si variables están.
- Aparece en tienda pública: **sí** (si activo y tienda accesible).
- Aparece en home: **sí** vía API/fallback.

### FLUJO 5 — Importación CSV
- Separador `;` TiendaNube: **sí** (Papa auto delimiter + mapeo).
- Separador `,` estándar: **sí**.
- Obligatorias: **nombre, precio, categoria**.
- Filas con errores: **sí**, reporte por fila.
- Publicación en tienda: **sí** si owner autenticado con tienda.

### FLUJO 6 — Carrito y checkout
- Agregar al carrito: **sí**.
- Persistencia entre páginas: **sí** (zustand persist).
- Checkout con MercadoPago: **sí** API `POST /api/checkout`.
- Sin MercadoPago configurado: **sí**, devuelve error explícito.

### FLUJO 7 — Página pública de tienda
- Muestra productos de tienda: **sí**.
- WhatsApp: **sí** cuando hay número.
- Tienda sin productos: **sí**, estado vacío claro.
- Slug inexistente: **fix aplicado**, ya no cae a error duro.

## PARTE 3 — Variables de entorno usadas

- `NEXT_PUBLIC_SUPABASE_URL` (pública)  
  - Uso: múltiples páginas/API/clientes supabase.  
  - Falta: varias rutas devuelven error o fallback vacío/demo.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública)  
  - Uso: clientes Supabase públicos/SSR middleware.  
  - Falta: falla auth/data público.
- `SUPABASE_SERVICE_ROLE_KEY` (privada)  
  - Uso: cliente admin (register, checkout, newsletter, etc.).  
  - Falta: rompen APIs admin/service.
- `NEXT_PUBLIC_SITE_URL` (pública)  
  - Uso: URLs absolutas/preview/sitemap helper.  
  - Falta: usa fallback hardcoded.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (pública)  
  - Uso: widgets de upload y firma.  
  - Falta: upload se deshabilita visualmente.
- `NEXT_PUBLIC_CLOUDINARY_API_KEY` (pública)  
  - Uso: validación cliente para habilitar widget.  
  - Falta: upload deshabilitado.
- `CLOUDINARY_API_KEY` (privada)  
  - Uso: `/api/cloudinary/sign`.  
  - Falta: firma devuelve error 500.
- `CLOUDINARY_API_SECRET` (privada)  
  - Uso: `/api/cloudinary/sign`.  
  - Falta: firma devuelve error 500.
- `MP_ACCESS_TOKEN` (privada)  
  - Uso: `/api/checkout`.  
  - Falta: checkout devuelve error explícito.
- `ANTHROPIC_API_KEY` (privada)  
  - Uso: `/api/ai/productos`.  
  - Falta: endpoint devuelve 400.
- `ADMIN_EMAILS` (privada)  
  - Uso: guard admin (`isAdminUser`).  
  - Falta: cae a default (`facufefer@gmail.com`).
- `DEMO_TIENDA_ID` (privada/opcional)  
  - Uso: fallback de productos sin sesión.  
  - Falta: crea/usa tienda demo por slug.

## PARTE 4 — Auditoría de base de datos

Tablas usadas por código:
- `tiendas`
- `productos`
- `pedidos`
- `product_variants`
- `envios_config`
- `newsletters`
- `descuentos`
- `resenas`

Riesgo de columnas que podrían faltar (manejado parcialmente con fallback):
- En `tiendas`: `facebook`, `tiktok`, `color_primario`, `banner_text`, `descripcion_html`, `horarios`, `mi_historia`, `historia_foto_url`, `admin_estado`.
- En `productos`: `sku`, `precio_lista`, `peso_gramos`, `material`, `genero`, `temporada`, `etiquetas`, `seo_titulo`, `seo_descripcion`, `estado_publicacion`, `foto_principal_index`.
- `envios_config`, `product_variants`, `descuentos`, `resenas`, `newsletters` pueden no existir en DB incompleta.

RLS:
- El SQL fase2 define políticas para nuevas tablas.
- Si RLS/tablas no están migradas, varias APIs caen en modo fallback o devuelven mensaje claro.

## PARTE 5 — Auditoría de APIs (`src/app/api`)

- `/api/admin/feriante-estado` — `GET` — cambia estado feriante (admin only), si falla: 400/403/500.
- `/api/ai/productos` — `POST` — parsing IA de productos, si falta key: 400.
- `/api/auth/register` — `POST` — crea user + tienda automática, errores 400/500.
- `/api/checkout` — `POST` — crea pedido + preference MP, sin token: 400.
- `/api/cloudinary/sign` — `POST` — firma Cloudinary, sin credenciales: 500.
- `/api/coupon/validate` — `POST` — valida cupon, retorna `ok` false o errores 400/503.
- `/api/dashboard/descuentos` — `GET/POST/PATCH` — CRUD descuentos, auth requerida.
- `/api/dashboard/envios-config` — `GET/POST` — envíos de tienda, con fallback si tabla no existe.
- `/api/dashboard/import-productos` — `POST` — importación masiva con reporte de errores.
- `/api/dashboard/productos` — `GET/POST/PUT/DELETE` — CRUD productos + variantes + fallback schema.
- `/api/dashboard/resenas/moderar` — `GET/PATCH` — moderación reseñas.
- `/api/dashboard/tienda` — `GET/POST/PUT` — perfil tienda con fallback de columnas básicas.
- `/api/productos` — `GET` — catálogo paginado con filtros públicos.
- `/api/public/envios` — `GET` — envíos públicos de una tienda.
- `/api/public/newsletter` — `POST` — alta newsletter.
- `/api/resenas` — `GET/POST` — listar y crear reseñas.
- `/api/socios` — `POST` — solicitud de alta feriante.
- `/api/templates/csv` — `GET` — descarga plantillas CSV.
- `/api/templates/xlsx` — `GET` — plantilla Excel + instrucciones.

## PARTE 6 — Lista de problemas encontrados

PROBLEMA #1
- Página/flujo: `/checkout`
- Qué pasa: no existía ruta pública de checkout.
- Por qué pasa: faltaba `src/app/checkout/page.tsx`.
- Impacto: CRÍTICO
- Fix propuesto: crear página checkout conectada a `/api/checkout` y mensajes claros.

PROBLEMA #2
- Página/flujo: `/tiendas`
- Qué pasa: no existía ruta directa.
- Por qué pasa: solo estaba `/feriantes`.
- Impacto: ALTO
- Fix propuesto: crear alias `/tiendas` (redirect a `/feriantes`).

PROBLEMA #3
- Página/flujo: `/{slug}` inexistente
- Qué pasa: devolvía `notFound()` (error/404 duro).
- Por qué pasa: lógica server abortaba si no había tienda/demo.
- Impacto: CRÍTICO
- Fix propuesto: fallback profesional “tienda en preparación / no encontrada” con CTA.

PROBLEMA #4
- Página/flujo: `/auth` y `/dashboard/tienda`
- Qué pasa: posibles errores de red podían quedar sin feedback explícito.
- Por qué pasa: faltaban `catch` en submit/save.
- Impacto: ALTO
- Fix propuesto: agregar catch y mostrar mensaje de error al usuario.

PROBLEMA #5
- Página/flujo: catálogo home
- Qué pasa: no intentaba cargar productos reales primero.
- Por qué pasa: usaba solo `demoProducts`.
- Impacto: CRÍTICO
- Fix propuesto: intentar API real y fallback demo solo si falla/viene vacío.

PROBLEMA #6
- Página/flujo: carrito -> pago
- Qué pasa: botón “Ir a pagar” no llevaba al checkout real.
- Por qué pasa: estaba hardcodeado a mensaje “próximamente”.
- Impacto: ALTO
- Fix propuesto: redirigir a `/checkout`.

## PARTE 7 — Plan de fixes

### FIXES CRÍTICOS (hechos en código)
- Home con intento de carga real + fallback demo.
- Ruta `/checkout` implementada.
- Ruta `/tiendas` implementada.
- Fallback profesional para slug inexistente.
- Catch de errores en formularios críticos.
- Carrito enlazado a checkout real.

### FIXES QUE NECESITAN DATOS REALES
- Poblar `tiendas`, `productos`, `pedidos` para evitar dependencia de demo.
- Cargar configuraciones reales de envío por tienda.
- Publicar reseñas aprobadas y descuentos reales.

### FIXES QUE NECESITAN VARIABLES DE ENTORNO
- Configurar Supabase (`NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`).
- Configurar Cloudinary (`NEXT_PUBLIC_*`, `CLOUDINARY_*`).
- Configurar MercadoPago (`MP_ACCESS_TOKEN`).
- Configurar IA (`ANTHROPIC_API_KEY`) si se usa asistente de carga.

## PARTE 8 — Fixes críticos aplicados

Archivos tocados para fixes críticos:
- `src/components/home/HomeCatalog.tsx`
- `src/app/checkout/page.tsx`
- `src/app/tiendas/page.tsx`
- `src/app/[tienda]/page.tsx`
- `src/app/auth/AuthForm.tsx`
- `src/app/dashboard/tienda/MiTiendaSupabaseForm.tsx`
- `src/app/carrito/page.tsx`

Build verificado: `npm run build` ✅

## PARTE 9 — Reporte final

1. **Resumen ejecutivo (3 líneas)**  
   El sistema está más robusto que al inicio, con buenas defensas de schema incompleto y fallbacks de servicios externos.  
   Se detectaron y corrigieron 5 fallas críticas de UX/flujo que podían bloquear operación o generar errores duros.  
   Con variables de entorno y datos reales completos, la plataforma queda lista para pruebas funcionales E2E finales.

2. **Score de cada flujo (0-10)**  
   - Registro: 8.5  
   - Login: 9  
   - Editor de tienda: 8.5  
   - Crear producto: 8.5  
   - Importación CSV: 8  
   - Carrito + checkout: 8  
   - Tienda pública: 8.5

3. **Lista de archivos modificados (fixes críticos)**  
   - `src/components/home/HomeCatalog.tsx`  
   - `src/app/checkout/page.tsx`  
   - `src/app/tiendas/page.tsx`  
   - `src/app/[tienda]/page.tsx`  
   - `src/app/auth/AuthForm.tsx`  
   - `src/app/dashboard/tienda/MiTiendaSupabaseForm.tsx`  
   - `src/app/carrito/page.tsx`  
   - `QA-AUDITORIA-COMPLETA.md`

4. **Próximos pasos recomendados**
- Ejecutar smoke E2E real sobre producción: registro -> alta tienda -> alta producto -> compra MP sandbox.
- Completar migraciones fase2 en todas las instancias Supabase.
- Resolver ruta duplicada legacy `/dashboard/reseñas` para consolidar sólo `/dashboard/resenas`.

5. **Variables de entorno faltantes (si las hay)**  
- Para ejecución runtime completa deben existir: Supabase + Service Role, Cloudinary, MP token y (opcional) Anthropic.
- Nota: una verificación por `node` local no carga automáticamente `.env.local`; validar también en Vercel Project Settings.

