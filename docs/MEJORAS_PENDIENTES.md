# Mejoras Pendientes — MobautoRomero

Documento vivo para registrar ideas de mejora y su estado de implementación.
Ir añadiendo nuevas ideas al final de cada sección o en nuevas secciones.

---

## Estado de las tareas

- [ ] Pendiente
- [x] Completado
- 🔄 En progreso

---

## 1. Panel de Configuración del Admin (`/admin/configuracion`)

Crear una página en el panel de administración para gestionar parámetros del taller de forma dinámica, sin tocar código.

### 1.1 Horarios y disponibilidad de citas

**Objetivo:** Que el admin pueda cambiar el horario sin necesidad de modificar código.

**Settings a implementar:**

| Setting | Tipo | Valor actual |
|--------|------|-------------|
| Hora apertura mañana | hora | 08:00 |
| Hora cierre mañana | hora | 14:00 |
| Turno tarde activo | on/off | activo |
| Hora apertura tarde | hora | 15:30 |
| Hora cierre tarde | hora | 19:00 |
| Intervalo entre citas | 30 / 60 / 120 min | 30 min |
| Primera cita disponible | hora | 08:00 |
| Días laborables | checkboxes L-S | Lunes a Viernes |

**Archivos a modificar:**
- `prisma/schema.prisma` → añadir o usar modelo `BusinessConfig`
- `server/api/appointments/slots.get.ts` → leer config de BD en vez de hardcoded
- `app/components/booking/DateTimePicker.vue` → leer días laborables de config
- `server/api/admin/config.get.ts` → nuevo endpoint GET configuración
- `server/api/admin/config.post.ts` → nuevo endpoint POST/PATCH guardar config
- `app/pages/admin/configuracion.vue` → nueva página admin
- `app/layouts/admin.vue` → añadir enlace "Configuración" al sidebar

**Pasos de implementación:**
1. [ ] Verificar/crear modelo `BusinessConfig` en Prisma (clave-valor)
2. [ ] Ejecutar migración de BD si es necesario
3. [ ] Crear endpoint `GET /api/admin/config`
4. [ ] Crear endpoint `POST /api/admin/config`
5. [ ] Modificar `slots.get.ts` para leer horarios de BD
6. [ ] Modificar `DateTimePicker.vue` para leer días laborables de API
7. [ ] Crear página `admin/configuracion.vue` con formulario
8. [ ] Añadir enlace al sidebar del admin

---

### 1.2 Bloqueo de fechas

**Objetivo:** Poder bloquear días concretos (festivos, vacaciones) para que no aparezcan slots disponibles.

**Funcionalidades:**
- Añadir/eliminar días festivos nacionales (25 dic, 1 ene, etc.)
- Añadir festivos locales de Humanes de Madrid
- Bloquear rangos de fechas (vacaciones de verano: 1-15 agosto)
- Bloquear días sueltos de forma manual

**Archivos a modificar/crear:**
- `prisma/schema.prisma` → nuevo modelo `BlockedDate` (fecha + motivo)
- `server/api/appointments/slots.get.ts` → consultar fechas bloqueadas
- `app/components/booking/DateTimePicker.vue` → bloquear esas fechas en el calendario
- `server/api/admin/blocked-dates.get.ts` → nuevo endpoint
- `server/api/admin/blocked-dates.post.ts` → nuevo endpoint
- `server/api/admin/blocked-dates/[id].delete.ts` → nuevo endpoint
- `app/pages/admin/configuracion.vue` → sección de fechas bloqueadas

**Pasos de implementación:**
1. [ ] Crear modelo `BlockedDate` en Prisma
2. [ ] Ejecutar migración
3. [ ] Crear endpoints CRUD para fechas bloqueadas
4. [ ] Modificar lógica de slots para excluir fechas bloqueadas
5. [ ] Modificar `DateTimePicker.vue` para deshabilitar esas fechas
6. [ ] Añadir interfaz en `admin/configuracion.vue`

---

### 1.3 Límites de capacidad

**Objetivo:** Controlar cuántas citas se pueden dar en un día o franja horaria.

**Settings a implementar:**

| Setting | Tipo | Descripción |
|--------|------|-------------|
| Máx. citas por día | número | Ej: 8 citas/día máximo |
| Antelación mínima | horas | No reservar para menos de 24h |
| Antelación máxima | días | No reservar con más de 60 días |

**Archivos a modificar:**
- `server/api/appointments/slots.get.ts` → aplicar límite diario
- `server/api/appointments/index.post.ts` → validar antelación mínima/máxima
- `server/api/admin/config.get/post.ts` → incluir estos settings

**Pasos de implementación:**
1. [ ] Añadir settings de límites a `BusinessConfig`
2. [ ] Modificar `slots.get.ts` para ocultar día si ya tiene el máx. de citas
3. [ ] Modificar `index.post.ts` para validar antelación al crear cita

---

### 1.4 Aviso temporal en la web (banner)

**Objetivo:** Mostrar un mensaje informativo temporal en la web (ej: "Cerramos del 1 al 15 de agosto").

**Funcionalidades:**
- Activar/desactivar el banner
- Texto del mensaje
- Tipo: info / aviso / urgente (colores diferentes)

**Archivos a modificar/crear:**
- `server/api/admin/config` → añadir campos de banner
- `server/api/config.get.ts` → endpoint público para leer el banner
- `app/layouts/default.vue` → mostrar el banner si está activo
- `app/pages/admin/configuracion.vue` → sección de banner

**Pasos de implementación:**
1. [ ] Añadir campos de banner a `BusinessConfig`
2. [ ] Crear endpoint público `GET /api/config` (sin autenticación)
3. [ ] Mostrar banner en el layout principal
4. [ ] Añadir interfaz en `admin/configuracion.vue`

---

## 2. Mejoras en el sistema de citas

### 2.1 Duración dinámica por servicio

**Objetivo:** Que cada servicio tenga una duración estimada, y al reservar varios servicios se calculen automáticamente los slots necesarios.

**Estado:** [ ] Pendiente

**Archivos:**
- `prisma/schema.prisma` → añadir campo `duration` al modelo `Service`
- `server/api/appointments/slots.get.ts` → tener en cuenta duración al bloquear slots
- `app/pages/reservar/index.vue` → mostrar duración estimada al seleccionar servicios

---

### 2.2 Notificación al admin por email al recibir una cita

**Objetivo:** Que el dueño del taller reciba un email cuando alguien reserve una cita.

**Estado:** [ ] Pendiente

**Archivos:**
- `server/api/appointments/index.post.ts` → enviar email tras crear cita
- Necesita: servicio de email (Resend, SendGrid, o nodemailer)

---

### 2.3 Recordatorio por email al cliente (24h antes)

**Objetivo:** Email automático al cliente recordando su cita el día anterior.

**Estado:** [ ] Pendiente (requiere sistema de tareas programadas / cron)

---

## 3. Otras mejoras (ideas futuras)

> Añadir aquí nuevas ideas según vayan surgiendo

- [ ] ...

---

*Última actualización: febrero 2026*
