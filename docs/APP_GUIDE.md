# Guia de Funcionamiento — Mobauto

Documentacion completa de la aplicacion: arquitectura, flujos, configuracion y como modificar cada parte.

---

## Indice

1. [Estructura general](#1-estructura-general)
2. [Autenticacion y roles](#2-autenticacion-y-roles)
3. [Servicios del taller](#3-servicios-del-taller)
4. [Sistema de citas y calendario](#4-sistema-de-citas-y-calendario)
5. [Panel de administracion](#5-panel-de-administracion)
6. [Zona privada del cliente](#6-zona-privada-del-cliente)
7. [Estado actual de los datos](#7-estado-actual-de-los-datos)
8. [Referencia de endpoints API](#8-referencia-de-endpoints-api)
9. [Como modificar cosas en el futuro](#9-como-modificar-cosas-en-el-futuro)

---

## 1. Estructura general

```
project-mobauto/
├── app/                        ← Frontend (Nuxt 4, Vue 3)
│   ├── pages/                  ← Paginas de la web
│   │   ├── index.vue           ← Pagina de inicio
│   │   ├── servicios/          ← Listado y detalle de servicios
│   │   ├── reservar/           ← Formulario de reserva de cita
│   │   ├── mi-cuenta/          ← Zona privada del cliente
│   │   ├── admin/              ← Panel de administracion
│   │   ├── login.vue
│   │   └── register.vue
│   ├── components/             ← Componentes reutilizables
│   │   └── booking/            ← Componentes del flujo de reserva
│   ├── composables/
│   │   └── useAuth.ts          ← Logica de autenticacion en componentes
│   ├── stores/
│   │   └── auth.ts             ← Estado global de autenticacion (Pinia)
│   ├── middleware/
│   │   ├── auth.ts             ← Protege rutas que requieren login
│   │   └── admin.ts            ← Protege rutas que requieren rol ADMIN
│   ├── utils/
│   │   └── services-data.ts    ← Servicios del taller (hardcodeados)
│   └── types/
│       └── index.ts            ← Tipos TypeScript de la app
│
├── server/                     ← Backend (Nuxt server, Node.js)
│   ├── api/                    ← Endpoints de la API REST
│   │   ├── auth/               ← login, register, me
│   │   ├── appointments/       ← crear cita, ver slots disponibles
│   │   ├── admin/              ← endpoints solo para admins
│   │   └── contact.post.ts     ← formulario de contacto
│   └── utils/
│       ├── prisma.ts           ← Cliente de base de datos (Prisma)
│       ├── auth.ts             ← JWT, bcrypt, verificacion de token
│       ├── db.ts               ← Base de datos temporal en memoria
│       └── appointments.ts     ← Logica y datos de citas (en memoria)
│
├── prisma/
│   ├── schema.prisma           ← Definicion de tablas de la BD
│   ├── seed.ts                 ← Datos iniciales
│   └── migrations/             ← Historial de cambios en la BD
│
└── docs/                       ← Documentacion del proyecto
```

---

## 2. Autenticacion y roles

### Como funciona

1. El usuario se registra (`POST /api/auth/register`) o inicia sesion (`POST /api/auth/login`)
2. El servidor devuelve un **JWT** (token firmado con `JWT_SECRET` del `.env.local`)
3. El token se guarda en una **cookie** que dura 7 dias
4. En cada peticion protegida, el cliente envia el token en el header `Authorization: Bearer <token>`
5. El servidor verifica el token con `getUserFromEvent()` en `server/utils/auth.ts`

### Roles disponibles

| Rol | Quien lo tiene | Que puede hacer |
|-----|----------------|-----------------|
| `CUSTOMER` | Cualquiera que se registra | Ver sus propias citas, perfil, vehiculos |
| `MECHANIC` | Asignado manualmente | Definido pero sin uso activo todavia |
| `ADMIN` | Solo `admin@mobauto.es` | Ver todas las citas, acceder al panel `/admin` |

### Proteccion de rutas

```typescript
// En cualquier pagina Vue, proteger con middleware:
definePageMeta({ middleware: 'auth' })   // requiere estar logueado
definePageMeta({ middleware: 'admin' })  // requiere rol ADMIN
```

- Si un usuario no autenticado intenta entrar a una ruta protegida → redirige a `/login`
- Si un CUSTOMER intenta entrar a `/admin` → redirige a `/`

### Credenciales del admin (desarrollo)

```
Email:    admin@mobauto.es
Password: admin123
```

> Para cambiar la contrasena del admin en produccion: actualiza el `seed.ts` con un nuevo hash
> o modifica directamente el registro en la base de datos con Prisma Studio (`npx prisma studio`).

### Archivos clave

| Archivo | Que hace |
|---------|----------|
| [server/utils/auth.ts](../server/utils/auth.ts) | `hashPassword`, `createToken`, `verifyToken`, `getUserFromEvent` |
| [app/stores/auth.ts](../app/stores/auth.ts) | Estado global: `user`, `token`, `isAdmin`, `isAuthenticated` |
| [app/composables/useAuth.ts](../app/composables/useAuth.ts) | `login()`, `register()`, `logout()` con redireccion |
| [app/middleware/auth.ts](../app/middleware/auth.ts) | Verifica autenticacion antes de cargar la pagina |
| [app/middleware/admin.ts](../app/middleware/admin.ts) | Verifica rol ADMIN antes de cargar la pagina |

---

## 3. Servicios del taller

### Estado actual

Los servicios estan **hardcodeados** en [app/utils/services-data.ts](../app/utils/services-data.ts).
La web los lee directamente de ese archivo — no hay endpoint de API para servicios todavia.

El mismo contenido tambien esta en la **base de datos** (cargado por el seed), listo para cuando
se migre a endpoints dinamicos.

### Los 6 servicios actuales

| Slug | Nombre | Categoria |
|------|--------|-----------|
| `chapa-pintura` | Chapa y Pintura | BODYWORK |
| `cristales` | Cristales para Automoviles | REPAIR |
| `reparacion-general` | Reparacion de Automoviles | REPAIR |
| `mantenimiento` | Mantenimiento Preventivo | MAINTENANCE |
| `pre-itv` | Pre-ITV | INSPECTION |
| `peritaje-siniestros` | Peritaje y Siniestros | OTHER |

### Estructura de un servicio

```typescript
// app/utils/services-data.ts
interface ServiceInfo {
  slug: string           // ID unico, usado en URLs: /servicios/chapa-pintura
  name: string           // Nombre visible
  shortDescription: string
  fullDescription: string
  icon: string           // Nombre del icono de Material Icons
  category: string       // BODYWORK | REPAIR | MAINTENANCE | INSPECTION | OTHER
  estimatedDuration: string  // "1-3 dias"
  priceRange: string     // "Desde 49€" o "Presupuesto sin compromiso"
  features: string[]     // Lista de puntos fuertes del servicio
  faqs: { question: string; answer: string }[]
}
```

### Como modificar servicios hoy

**Editar un servicio existente**: abre [app/utils/services-data.ts](../app/utils/services-data.ts)
y modifica los campos directamente.

**Anadir un nuevo servicio**: agrega un nuevo objeto al array `services` en el mismo archivo.
El `slug` debe ser unico y en formato kebab-case (sin mayusculas, sin espacios, guiones).

```typescript
// Ejemplo: anadir un nuevo servicio
{
  slug: 'aire-acondicionado',
  name: 'Aire Acondicionado',
  shortDescription: 'Recarga y revision del sistema de climatizacion.',
  fullDescription: 'Revisamos...',
  icon: 'ac_unit',
  category: 'MAINTENANCE',
  estimatedDuration: '2-3 horas',
  priceRange: 'Desde 60€',
  features: ['Recarga de gas refrigerante', 'Revision de filtros'],
  faqs: [{ question: '...', answer: '...' }],
}
```

**Actualizar tambien la base de datos**: si el servicio debe quedar guardado en PostgreSQL,
anade el mismo servicio en `prisma/seed.ts` dentro del array `servicesData` y ejecuta:

```bash
npx prisma db seed
```

> El seed usa `upsert` — no borra los datos existentes, solo crea o actualiza.

### Como migrar a servicios dinamicos (futuro)

Cuando quieras que los servicios vengan de la base de datos en lugar del archivo estatico:

1. Crear endpoint: `server/api/services/index.get.ts` que haga `prisma.service.findMany()`
2. En `app/pages/servicios/index.vue`, reemplazar `getServices()` por `await $fetch('/api/services')`
3. El panel de admin podra tener entonces un CRUD de servicios

---

## 4. Sistema de citas y calendario

### Flujo completo de reserva

El usuario sigue un stepper de **5 pasos** en `/reservar`:

```
Paso 1: Servicios
  → Elige uno o varios servicios (checkboxes)

Paso 2: Vehiculo
  → Marca, Modelo, Ano, Matricula

Paso 3: Fecha y Hora
  → Calendario (sin fines de semana, sin fechas pasadas)
  → Al seleccionar fecha → GET /api/appointments/slots?date=YYYY-MM-DD
  → Muestra los slots disponibles (30 minutos cada uno)
  → El cliente elige hora

Paso 4: Datos de contacto
  → Nombre, Email, Telefono (opcional), Notas (opcional)

Paso 5: Confirmacion
  → Resumen de toda la cita
  → Boton "Confirmar"
  → POST /api/appointments
  → Si exito: dialogo con ID de confirmacion
```

### Horarios del taller

Los horarios estan configurados en [server/utils/appointments.ts](../server/utils/appointments.ts):

```typescript
const BUSINESS_HOURS = {
  morningOpen:    8,    // 08:00
  morningClose:   14,   // 14:00
  afternoonOpen:  15,   // 15:30 (el .5 = 30 minutos)
  afternoonClose: 19,   // 19:00
  slotMinutes:    30,   // Duracion de cada slot en minutos
  workDays: [1,2,3,4,5] // Lunes=1 a Viernes=5 (0=Domingo, 6=Sabado)
}
```

**Slots generados automaticamente cada dia laboral:**

| Turno | Horarios |
|-------|---------|
| Manana | 08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30 |
| Tarde | 15:30, 16:00, 16:30, 17:00, 17:30, 18:00, 18:30 |

Total: **19 slots por dia** (un slot = una cita de 30 minutos).

### Como cambiar los horarios

Edita las constantes en [server/utils/appointments.ts](../server/utils/appointments.ts):

```typescript
// Ejemplo: ampliar hasta las 20:00 por la tarde
afternoonClose: 20,

// Ejemplo: slots de 60 minutos en lugar de 30
slotMinutes: 60,

// Ejemplo: incluir sabados
workDays: [1,2,3,4,5,6],  // 6 = sabado
```

> En el futuro, cuando se use Prisma, estos valores vendran de la tabla `business_config`
> en la base de datos (ya definida en el schema). La funcion los leeria con
> `prisma.businessConfig.findUnique({ where: { key: 'slot_minutes' } })`.

### Estructura de una cita

```typescript
interface DbAppointment {
  id: string              // UUID unico
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePlate: string
  services: string[]      // slugs: ["chapa-pintura", "pre-itv"]
  scheduledDate: string   // "2026-03-15"
  scheduledTime: string   // "10:00"
  duration: number        // minutos (por defecto 60)
  status: AppointmentStatus
  notes?: string
  createdAt: Date
}

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
```

### Estados de una cita

| Estado | Color | Significado |
|--------|-------|-------------|
| `PENDING` | Naranja | Cita recibida, pendiente de confirmar por el taller |
| `CONFIRMED` | Azul | El taller ha confirmado la cita |
| `IN_PROGRESS` | Cyan | El vehiculo esta en el taller |
| `COMPLETED` | Verde | Trabajo finalizado |
| `CANCELLED` | Rojo | Cita cancelada |

> Actualmente el cambio de estado solo puede hacerse directamente en la base de datos.
> En el futuro se puede crear un endpoint `PATCH /api/admin/appointments/:id` para que
> el admin cambie el estado desde el panel.

---

## 5. Panel de administracion

### Acceso

Solo usuarios con rol `ADMIN`. URL: `/admin`

Si un usuario normal intenta entrar, el middleware lo redirige a `/`.

### Que muestra actualmente

**4 tarjetas de metricas:**
- Citas hoy
- Citas pendientes
- Completadas este mes
- Clientes totales

**Tabla de citas recientes:**
- Columnas: Fecha | Hora | Cliente | Servicios | Estado
- Estado con badge coloreado segun la tabla anterior
- Paginacion de 5 filas

### Endpoint que usa

```
GET /api/admin/appointments
Authorization: Bearer <token-admin>
```

Devuelve todas las citas de todos los clientes. El token se verifica y se comprueba
que el rol sea `ADMIN` — si no, devuelve 403.

### Que falta por implementar

El panel actualmente es de solo lectura. Para expandirlo se podrian anadir:

- Cambiar el estado de una cita (confirmar, cancelar, completar)
- Gestionar servicios (CRUD)
- Ver y responder mensajes de contacto
- Ver lista de usuarios registrados
- Exportar citas a CSV o PDF

Cada nueva funcionalidad necesita su endpoint en `server/api/admin/`.

---

## 6. Zona privada del cliente

### Acceso

Cualquier usuario autenticado. URL base: `/mi-cuenta`

Requiere el middleware `auth` — si no esta logueado, redirige a `/login?redirect=/mi-cuenta`.

### Secciones

| Ruta | Pagina | Que muestra |
|------|--------|-------------|
| `/mi-cuenta` | Dashboard | Bienvenida + accesos rapidos |
| `/mi-cuenta/citas` | Mis Citas | Lista de citas del usuario |
| `/mi-cuenta/perfil` | Mi Perfil | Datos personales (nombre, email, telefono) |
| `/mi-cuenta/vehiculos` | Mis Vehiculos | Lista de vehiculos registrados |

### Estado actual de citas del cliente

La pagina `/mi-cuenta/citas` muestra las citas filtradas por email del usuario.
Cada cita muestra: servicios contratados, fecha y hora, estado con badge coloreado.

Hay un boton "Nueva Cita" que lleva a `/reservar`.

---

## 7. Estado actual de los datos

### Dos sistemas coexistiendo

| Sistema | Donde | Que guarda | Problema |
|---------|-------|------------|---------|
| En memoria | `server/utils/db.ts` | Usuarios y sus datos | Se borra al reiniciar el servidor |
| En memoria | `server/utils/appointments.ts` | Citas | Se borra al reiniciar el servidor |
| PostgreSQL | Prisma + Docker | Servicios, admin, horarios config | Ya creado y con datos del seed |

### Migracion pendiente

Los endpoints de autenticacion (`/api/auth/*`) y citas (`/api/appointments/*`) todavia usan
las bases de datos en memoria. Para que los datos sean persistentes, hay que migrarlos a Prisma.

**Para migrar el registro/login a Prisma:**

```typescript
// server/api/auth/register.post.ts — cambiar:
// ANTES (en memoria):
const existingUser = findUserByEmail(email)
const user = createUser({ email, passwordHash, role: 'CUSTOMER', firstName, lastName, phone })

// DESPUES (con Prisma):
const existingUser = await prisma.user.findUnique({ where: { email } })
const user = await prisma.user.create({
  data: { email, passwordHash, role: 'CUSTOMER', firstName, lastName, phone }
})
```

**Para migrar las citas a Prisma:**

```typescript
// server/api/appointments/index.post.ts — cambiar:
// ANTES (en memoria):
const appointment = createAppointment({ ... })

// DESPUES (con Prisma):
const appointment = await prisma.appointment.create({
  data: {
    customerName, customerEmail, customerPhone,
    vehicleBrand, vehicleModel, vehicleYear, vehiclePlate,
    scheduledDate: new Date(scheduledDate),
    scheduledTime,
    duration,
    status: 'PENDING',
    notes,
  }
})
```

---

## 8. Referencia de endpoints API

### Autenticacion

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar nuevo usuario (rol CUSTOMER) |
| POST | `/api/auth/login` | No | Iniciar sesion, devuelve JWT |
| GET | `/api/auth/me` | Si | Obtener datos del usuario autenticado |

**Body de registro:**
```json
{
  "email": "cliente@example.com",
  "password": "minimo6caracteres",
  "firstName": "Juan",
  "lastName": "Garcia",
  "phone": "600123456"
}
```

**Body de login:**
```json
{ "email": "cliente@example.com", "password": "micontrasena" }
```

**Respuesta de login/register:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "CUSTOMER", "firstName": "Juan", "lastName": "Garcia" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Citas

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/appointments/slots?date=YYYY-MM-DD` | No | Slots disponibles para una fecha |
| POST | `/api/appointments` | No | Crear nueva cita |

**Respuesta de slots:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-15",
    "slots": ["08:00", "08:30", "09:00", "09:30", "10:00", "..."]
  }
}
```

**Body para crear cita:**
```json
{
  "customerName": "Juan Garcia",
  "customerEmail": "juan@example.com",
  "customerPhone": "600123456",
  "vehicleBrand": "Toyota",
  "vehicleModel": "Corolla",
  "vehicleYear": 2020,
  "vehiclePlate": "1234 ABC",
  "services": ["chapa-pintura", "pre-itv"],
  "scheduledDate": "2026-03-15",
  "scheduledTime": "10:00",
  "duration": 60,
  "notes": "El golpe es en la puerta delantera izquierda"
}
```

---

### Admin (requieren rol ADMIN)

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/admin/appointments` | ADMIN | Todas las citas de todos los clientes |

---

### Contacto

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/contact` | No | Enviar mensaje desde el formulario de contacto |

---

## 9. Como modificar cosas en el futuro

### Cambiar horarios del taller

Edita [server/utils/appointments.ts](../server/utils/appointments.ts):

```typescript
const BUSINESS_HOURS = {
  morningOpen:    8,     // Hora de apertura manana (8 = 08:00)
  morningClose:   14,    // Hora de cierre manana
  afternoonOpen:  15,    // 15 = 15:00, 15.5 = 15:30
  afternoonClose: 19,
  slotMinutes:    30,    // Cambiar a 60 para slots de una hora
  workDays: [1,2,3,4,5] // Anadir 6 para incluir sabados
}
```

### Anadir un nuevo servicio

1. Abre [app/utils/services-data.ts](../app/utils/services-data.ts) y agrega el objeto
2. Abre [prisma/seed.ts](../prisma/seed.ts) y agrega el mismo servicio en `servicesData`
3. Ejecuta `npx prisma db seed` para guardarlo en la BD

### Cambiar la contrasena del admin

1. Abre [prisma/seed.ts](../prisma/seed.ts)
2. Cambia `'admin123'` por la nueva contrasena en `bcrypt.hash('nueva_contrasena', 10)`
3. Ejecuta `npx prisma db seed` (el `upsert` actualizara el registro existente)

### Anadir un nuevo endpoint

Crea un archivo en `server/api/` siguiendo la convencion de nombres de Nuxt:

```
server/api/servicios/index.get.ts     → GET /api/servicios
server/api/servicios/[id].get.ts      → GET /api/servicios/:id
server/api/admin/servicios.post.ts    → POST /api/admin/servicios
```

Ejemplo minimo de endpoint protegido para admin:

```typescript
// server/api/admin/servicios.post.ts
export default defineEventHandler(async (event) => {
  const authData = getUserFromEvent(event)
  if (!authData) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  if (authData.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'No autorizado' })

  const body = await readBody(event)
  const servicio = await prisma.service.create({ data: body })
  return { success: true, data: servicio }
})
```

### Anadir una nueva pagina protegida

```vue
<!-- app/pages/mi-cuenta/nueva-seccion.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',  // o 'admin' si solo es para admins
  layout: 'client',   // o 'admin' para el panel admin
})
</script>
```

### Cambiar el texto o logo del sitio

- **Titulo y descripcion SEO**: [nuxt.config.ts](../nuxt.config.ts) → `app.head`
- **Colores de marca**: [nuxt.config.ts](../nuxt.config.ts) → `quasar.config.brand`
  - `primary`: azul oscuro (#1B3A5C)
  - `accent`: naranja (#E8712B)

### Ver los datos de la base de datos visualmente

```bash
# Abre una interfaz web para ver y editar los datos de PostgreSQL
npx prisma studio
# Accede en: http://localhost:5555
```

---

## Herramientas de desarrollo utiles

```bash
# Arrancar el servidor de desarrollo
npm run dev

# Ver datos en la BD con interfaz grafica
npx prisma studio

# Regenerar el cliente Prisma tras cambiar el schema
npx prisma generate

# Crear una nueva migracion tras cambiar el schema
npx prisma migrate dev --name descripcion_del_cambio

# Rellenar la BD con datos iniciales
npx prisma db seed

# Reiniciar la BD completamente (BORRA TODO)
npx prisma migrate reset
```
