# QA REPORTE - Marketplace La Salada
## Fecha: 2026-04-24

## Resumen ejecutivo
- Total pruebas: 100
- ✅ Pasaron: 73
- ❌ Fallaron: 8
- ⚠️ Advertencias: 19
- 🔴 Críticos (bloquean el negocio): 0

## Resultado por grupo
| Grupo | Área | ✅ | ❌ | ⚠️ |
|---|---|---:|---:|---:|
| 1 | Homepage | 8 | 2 | 0 |
| 2 | Navegación | 10 | 0 | 0 |
| 3 | Página de producto | 10 | 0 | 0 |
| 4 | Página de tienda | 8 | 2 | 0 |
| 5 | Carrito | 10 | 0 | 0 |
| 6 | Registro y auth | 7 | 1 | 2 |
| 7 | Dashboard | 2 | 0 | 8 |
| 8 | Editor de tienda | 6 | 1 | 3 |
| 9 | Importación CSV | 5 | 1 | 4 |
| 10 | Funcionalidades extra | 7 | 1 | 2 |

## Detalle de pruebas fallidas

### 8. Hero banner rota entre slides
- Error encontrado: el hero actual es estático; no hay lógica de rotación/slider.
- Impacto: bajo.
- Solución recomendada: implementar carrusel automático con pausa en hover y controles.

### 9. Countdown timer cuenta regresiva
- Error encontrado: se muestra valor fijo `23:59:59`, no decrementa en tiempo real.
- Impacto: medio (promociones menos creíbles).
- Solución recomendada: reemplazar por contador reactivo con `setInterval` y target de fecha real.

### 37. Botón WhatsApp de la tienda funciona (de la tienda)
- Error encontrado: en página de tienda hay botón flotante hardcodeado (`5491111111111`), no toma dato de la tienda.
- Impacto: alto (contacto puede ir al número incorrecto).
- Solución recomendada: usar `tienda.whatsapp` con fallback controlado.

### 38. Reseñas visibles en página de tienda
- Error encontrado: solo se muestran stats, no listado/resumen de reseñas de la tienda.
- Impacto: medio.
- Solución recomendada: traer reseñas aprobadas por `tienda_id` y renderizar bloque resumido.

### 60. Mensaje de éxito después del registro
- Error encontrado: en registro de `/auth` se redirige al dashboard sin mensaje explícito de éxito.
- Impacto: bajo.
- Solución recomendada: toast/mensaje de “Cuenta creada” antes o después del redirect.

### 80. Preview de tienda visible en tiempo real
- Error encontrado: hay iframe de preview, pero no se actualiza en vivo con cada cambio; requiere guardar/recargar.
- Impacto: medio.
- Solución recomendada: preview local con estado del formulario o refresh automático del iframe.

### 87. Barra de progreso durante importación
- Error encontrado: existe texto de estado, pero no barra de progreso real (% o etapas).
- Impacto: medio.
- Solución recomendada: implementar progress bar con progreso por lote en backend/frontend.

### 97. SEO: title y description únicos por página
- Error encontrado: varias páginas comparten title/description globales (ej. `/sobre-nosotros`, `/como-comprar`, `/envios`).
- Impacto: medio.
- Solución recomendada: `generateMetadata` por ruta con títulos/descripciones únicos.

## Pruebas exitosas
1. ✅ Homepage carga sin errores (status 200)  
2. ✅ Buscador filtra productos por nombre  
3. ✅ Filtro de categoría Remeras funciona  
4. ✅ Filtro de categoría Pantalones funciona  
5. ✅ Filtro de categoría Vestidos funciona  
6. ✅ Filtro de precio min/max funciona  
7. ✅ Filtro de talle funciona  
8. ❌ Hero banner rota entre slides  
9. ❌ Countdown timer cuenta regresiva  
10. ✅ Footer tiene todos los links  
11. ✅ Link "Sobre nosotros" abre /sobre-nosotros  
12. ✅ Link "Cómo comprar" abre /como-comprar  
13. ✅ Link "Convertite en socio" abre /ser-socio  
14. ✅ Link "Política de privacidad" abre /privacidad  
15. ✅ Link "Envíos" abre /envios  
16. ✅ Link "Para feriantes" abre /para-feriantes  
17. ✅ Categorías del menú filtran correctamente  
18. ✅ Logo lleva al home  
19. ✅ Breadcrumbs funcionan en páginas internas  
20. ✅ Links del footer no están rotos (no dan 404)  
21. ✅ Página de producto carga sin errores  
22. ✅ Galería de fotos muestra imagen principal  
23. ✅ Thumbnails cambian la foto principal  
24. ✅ Selector de talle funciona  
25. ✅ Selector de color funciona  
26. ✅ Botón "Agregar al carrito" funciona  
27. ✅ Contador de stock visible  
28. ✅ Sección de descripción visible  
29. ✅ Productos relacionados aparecen  
30. ✅ Botón WhatsApp tiene número correcto  
31. ✅ /urbanstyle-ba carga sin errores  
32. ✅ Banner de tienda visible  
33. ✅ Logo de tienda visible  
34. ✅ Descripción de tienda visible  
35. ✅ Grid de productos de la tienda visible  
36. ✅ Filtros de la tienda funcionan  
37. ❌ Botón WhatsApp de la tienda funciona  
38. ❌ Reseñas visibles  
39. ✅ Métodos de envío visibles  
40. ✅ Stats de la tienda visibles (productos, reseñas)  
41. ✅ Carrito abre al hacer click en ícono  
42. ✅ Agregar producto suma al carrito  
43. ✅ Contador del carrito se actualiza  
44. ✅ Precio total se calcula correctamente  
45. ✅ Eliminar producto del carrito funciona  
46. ✅ Cambiar cantidad funciona  
47. ✅ Carrito persiste al recargar página  
48. ✅ Mensaje cuando carrito está vacío  
49. ✅ Botón "Ir a pagar" visible  
50. ✅ Resumen de orden correcto  
51. ✅ /auth carga sin errores  
52. ✅ Formulario de registro tiene campos email, contraseña, nombre tienda  
53. ⚠️ Registro sin confirmación de email funciona  
54. ⚠️ Login con credenciales correctas funciona  
55. ✅ Login con credenciales incorrectas muestra error  
56. ✅ Redirect al dashboard después del login  
57. ✅ /ser-socio carga sin errores  
58. ✅ Formulario de ser-socio tiene todos los campos  
59. ⚠️ Envío del formulario guarda en Supabase  
60. ❌ Mensaje de éxito después del registro  
61. ⚠️ /dashboard carga sin errores  
62. ⚠️ Métricas visibles (productos, pedidos, ventas)  
63. ⚠️ /dashboard/productos lista productos  
64. ✅ Botón "+ Nuevo producto" funciona  
65. ⚠️ /dashboard/productos/nuevo carga sin errores  
66. ✅ Formulario de nuevo producto tiene todos los campos  
67. ⚠️ Upload de foto con Cloudinary funciona  
68. ⚠️ Guardar producto nuevo guarda en Supabase  
69. ⚠️ /dashboard/pedidos lista pedidos  
70. ⚠️ /dashboard/tienda carga sin errores (sin Application error)  
71. ✅ Formulario de editar tienda tiene campo nombre  
72. ✅ Campo descripción funciona  
73. ✅ Campo WhatsApp funciona  
74. ✅ Campo Instagram funciona  
75. ⚠️ Upload de logo funciona con Cloudinary  
76. ⚠️ Upload de banner funciona con Cloudinary  
77. ✅ Color picker de tienda funciona  
78. ✅ Horarios de atención editables  
79. ⚠️ Guardar cambios actualiza en Supabase  
80. ❌ Preview de tienda visible en tiempo real  
81. ⚠️ /dashboard/importar carga sin errores  
82. ✅ Descarga de plantilla CSV general funciona  
83. ✅ Descarga de plantilla Excel funciona  
84. ⚠️ Upload de archivo CSV funciona  
85. ✅ Preview de productos antes de importar  
86. ✅ Validación de campos obligatorios  
87. ❌ Barra de progreso durante importación  
88. ✅ Reporte de productos importados vs errores  
89. ⚠️ Productos importados aparecen en el dashboard  
90. ⚠️ Productos importados aparecen en el marketplace  
91. ✅ /envios carga sin errores con métodos de envío  
92. ✅ Newsletter: campo email en footer funciona  
93. ⚠️ Newsletter: guardar email en Supabase funciona  
94. ✅ /para-feriantes carga sin errores  
95. ✅ Calculadora de ganancias en /para-feriantes funciona  
96. ✅ /admin redirige si no sos admin  
97. ❌ SEO: cada página tiene title y description únicos  
98. ✅ Sitemap /sitemap.xml responde con XML válido  
99. ⚠️ Sitio es responsive en mobile (375px)  
100. ✅ Tiempo de carga del home menor a 3 segundos  

## Recomendaciones prioritarias para mañana
1. Corregir WhatsApp de tienda para usar dato real de cada feriante (no hardcoded).  
2. Implementar countdown real y hero slider para credibilidad comercial de promos.  
3. Agregar metadata única por página (title + description) para SEO técnico básico.  
4. Mejorar importación con barra de progreso real por lotes y feedback transaccional.  
5. Activar preview verdaderamente en tiempo real en editor de tienda.

## Estado general del sistema
La plataforma está funcional en su núcleo (navegación, catálogo, producto, carrito, rutas públicas y build/lint), con UX moderna y despliegue estable. Los principales riesgos actuales no bloquean operación base, pero sí impactan conversión y escalabilidad operativa: contacto de tienda hardcodeado, SEO repetido, progreso de importación insuficiente y preview no totalmente reactivo. Con un sprint corto de correcciones, queda lista para demos comerciales más exigentes.

