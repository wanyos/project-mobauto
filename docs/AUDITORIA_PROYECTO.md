# Auditoría — MobautoRomero

> Generado: 2026-03-10 | Última actualización: 2026-03-12

---

## Resumen

| Estado     | Cantidad |
|------------|----------|
| RESUELTOS  | 28       |
| PENDIENTES | 8        |

---

## Issues resueltos

| #  | Issue | Solución aplicada |
|----|-------|-------------------|
| 1  | Credenciales expuestas en git | DESCARTADO — `.env.production` nunca se subió, `.gitignore` correcto |
| 2  | JWT secret con fallback | Eliminado fallback, lanza error si no definido |
| 3  | Falta try-catch en rutas API | Añadido try-catch en las 19 rutas |
| 4  | Race condition en reservas | `prisma.$transaction` atómico |
| 5  | Falta validación de servicios | Check `serviceRecords.length === services.length` |
| 6  | Falta onDelete CASCADE | Añadido `SetNull`/`Cascade` en 5 relaciones |
| 7  | Delete vehículos no atómico | `deleteMany` con filtro de owner |
| 8  | Auth admin duplicado | Helper `requireAdmin(event)` en `server/utils/auth.ts` |
| 9  | Auth cliente duplicado | Helper `requireAuth(event)` en `server/utils/auth.ts` |
| 10 | BusinessConfig duplicada | Unificada en `shared/types/business.ts` |
| 11 | Status helpers duplicados | Extraídos a `app/utils/statusHelpers.ts` |
| 12 | Validación débil | Schemas Zod en `server/utils/validation.ts`, helper `validateBody()` |
| 13 | Sin paginación admin | `page`/`limit` en appointments y users |
| 14 | Faltan índices BD | `@@index` en Appointment y Vehicle |
| 15 | Tipos `any` | Reemplazados por interfaces tipadas |
| 16 | Nombres de campos inconsistentes | Tipos reescritos alineados con Prisma |
| 17 | Tipos desalineados con schema | `app/types/index.ts` reescrito |
| 18 | Sin feedback al usuario | `$q.notify()` en citas, vehículos, dashboard, slots |
| 19 | Respuestas API inconsistentes | `contact.post.ts` estandarizado a `{ data: { message } }` |
| 20 | SSL inseguro | REVISADO — `rejectUnauthorized: false` necesario para Neon/Supabase |
| 21 | Sin validación env vars | `DATABASE_URL` y `JWT_SECRET` validados al arrancar |
| 22 | Sin rate limiting | Rate limiter en memoria para login (10/15min) y register (5/15min) |
| 23 | preselectedService no reactivo | Cambiado a `computed()` |
| 24 | Drawer no responsive | `watch` sobre `$q.screen.lt.md` |
| 25 | Logout en cualquier error | Solo logout en 401, no en errores de red |
| 26 | console.log en producción | Eliminado |
| 27 | TODO duración hardcodeada | Duración calculada dinámicamente según servicios |
| 33 | Carpetas vacías | Eliminadas (`admin/`, `client/`, `home/`) |

---

## Issues pendientes (BAJO)

### 28. Componentes grandes sin dividir
- **Archivos:**
  - `pages/index.vue` (271 líneas) — hero, servicios, testimonios, contacto, CTA
  - `pages/reservar/index.vue` (254 líneas) — 5 pasos del stepper
  - `pages/admin/configuracion.vue` (276 líneas) — múltiples secciones
- **Acción:** Extraer secciones a componentes

### 29. Falta og:image en SEO
- **Problema:** No se define `ogImage` — las previsualizaciones en redes sociales no tendrán imagen
- **Acción:** Añadir `ogImage` cuando haya imagen del taller disponible

### 30. Accesibilidad: faltan aria labels
- **Archivos:** `layouts/default.vue`, `DateTimePicker.vue`, `ContactForm.vue`, `TestimonialCard.vue`
- **Acción:** Añadir atributos ARIA progresivamente

### 31. Strings hardcodeados (no i18n)
- **Problema:** Textos UI en español directamente en templates
- **Acción:** Considerar i18n si se necesita multiidioma (prioridad baja si solo español)

### 32. Tailwind config mínimo
- **Problema:** Solo tiene `important: true`, no define colores del tema
- **Acción:** Extender con colores primary/secondary/accent del negocio

### 34. Blog sin contenido
- **Problema:** Solo muestra "Próximamente..." — afecta SEO
- **Acción:** Implementar o eliminar la ruta del sitemap

### 35. No hay tests
- **Acción:** Añadir tests progresivamente (empezar por rutas API críticas: auth, appointments)

### 37. Dependencias major pendientes
- `vue-router 4 → 5`: Breaking changes en tipos. Revisar guía de migración
- `zod 3 → 4`: API reescrita. Revisar guía de migración
