# Prisma + PostgreSQL — Guia de Implementacion para Mobauto

## Requisitos previos

- Docker Desktop instalado y corriendo
- Node.js 18+
- El proyecto Mobauto con las dependencias ya instaladas

---

## Paso 1 — Levantar PostgreSQL con Docker

El `docker-compose.yml` ya esta creado en la raiz del proyecto con credenciales hardcodeadas (sin variables de entorno):

```yaml
services:
  db:
    image: postgis/postgis:15-3.3
    platform: linux/amd64
    container_name: mobauto-db
    environment:
      POSTGRES_USER: mobauto
      POSTGRES_PASSWORD: mobauto
      POSTGRES_DB: mobauto
    ports:
      - 2345:5432
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
    external: false
```

```bash
# Levantar el contenedor de Postgres
docker compose up -d

# Verificar que esta corriendo
docker ps
```

Acceso: **PostgreSQL** en `localhost:2345` (user: `mobauto`, password: `mobauto`, db: `mobauto`)

> **Por que el puerto 2345?** Para evitar conflictos con instalaciones locales de PostgreSQL que ocupan el puerto 5432 por defecto (comun en Windows).

> **Para resetear la base de datos** (borra todos los datos): `docker compose down -v && docker compose up -d`

---

## Paso 2 — Instalar Prisma

```bash
# Instalar Prisma como dependencia de desarrollo
npm install prisma --save-dev

# Instalar el cliente de Prisma (dependencia de produccion)
npm install @prisma/client

# Instalar dotenv (necesario para que Prisma CLI cargue variables de entorno)
npm install dotenv

# Instalar el Driver Adapter para PostgreSQL (OBLIGATORIO en Prisma v7 con el nuevo generador)
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg

# Inicializar Prisma en el proyecto
npx prisma init
```

> **IMPORTANTE — Prisma v7 y Driver Adapters**: El nuevo generador `prisma-client` ya no soporta
> conexiones directas con URL. En su lugar requiere un **Driver Adapter**. Para PostgreSQL se usa
> `@prisma/adapter-pg` (que internamente usa el paquete `pg`). Sin estos paquetes el cliente
> no se puede instanciar y TypeScript lanzara "Expected 1 arguments, but got 0".

Esto crea:
- `prisma/schema.prisma` — El archivo donde defines tus tablas
- `prisma.config.ts` — Configuracion de Prisma (URL, rutas de migraciones...) *(Prisma v7)*
- `.env` — Variables de entorno para el CLI de Prisma

---

## Paso 3 — Configurar la conexion

En este proyecto se usan **dos archivos de entorno** con roles distintos:

| Archivo | Lo lee | Para que |
|---|---|---|
| `.env` | Prisma CLI (via `dotenv`) | Migraciones, seed, studio |
| `.env.local` | Nuxt (automaticamente) | La app en ejecucion (JWT, etc.) |

### `.env` — Solo la URL para Prisma CLI

Solo necesita `DATABASE_URL`. No hacen falta variables individuales porque docker-compose tiene las credenciales hardcodeadas.

```env
DATABASE_URL="postgresql://mobauto:mobauto@localhost:2345/mobauto"
```

### `.env.local` — Para Nuxt

```env
# ─── Base de datos ───
DB_HOST="localhost"
DB_PORT="2345"
DB_USER="mobauto"
DB_PASSWORD="mobauto"
DB_NAME="mobauto"
DATABASE_URL="postgresql://mobauto:mobauto@localhost:2345/mobauto"

# ─── Autenticacion (JWT) ───
JWT_SECRET="tu_clave_secreta_segura_aqui"
```

> **IMPORTANTE**: `.env.local` NO expande variables como `${DB_USER}` — dotenv las toma como texto literal. Usa la URL hardcodeada en su lugar.

> **IMPORTANTE**: Ambos archivos deben estar en `.gitignore`. Nunca subas credenciales al repositorio.

### `prisma.config.ts` — Configuracion de Prisma v7

```typescript
import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

config({ path: '.env' })  // Carga el .env (NO el .env.local)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),  // Usa la funcion env() de Prisma
  },
})
```

> **Por que cargar `.env` y no `.env.local`?** dotenv no expande variables del tipo `${DB_USER}` en `.env.local`, lo que causaria un error de URL invalida. El `.env` tiene la URL completa hardcodeada.

---

## Paso 4 — Definir el Schema de la base de datos

Reemplaza el contenido de `prisma/schema.prisma` con el schema completo del proyecto.

> **Prisma v7**: El provider es `prisma-client` (no `prisma-client-js`) y la URL va en `prisma.config.ts`, no aqui.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  // La URL se configura en prisma.config.ts
}

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────
// Tabla principal de usuarios: clientes, mecanicos y admins
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(CUSTOMER)
  firstName    String   @map("first_name")
  lastName     String   @map("last_name")
  phone        String?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relaciones
  vehicles     Vehicle[]
  appointments Appointment[]
  blogPosts    BlogPost[]     // Posts escritos (solo ADMIN)
  blogComments BlogComment[]

  @@map("users")
}

enum Role {
  CUSTOMER
  MECHANIC
  ADMIN
}

// ─────────────────────────────────────────────
// VEHICULOS
// ─────────────────────────────────────────────
// Cada cliente puede tener varios vehiculos registrados
model Vehicle {
  id        String   @id @default(uuid())
  brand     String                          // Marca: Toyota, Seat, VW...
  model     String                          // Modelo: Corolla, Leon, Golf...
  year      Int                             // Ano: 2020
  plate     String   @unique                // Matricula: 1234 ABC
  color     String?                         // Color (opcional)
  ownerId   String   @map("owner_id")
  createdAt DateTime @default(now()) @map("created_at")

  // Relaciones
  owner        User          @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  appointments Appointment[]

  @@map("vehicles")
}

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────
// Catalogo de servicios que ofrece el taller
model Service {
  id               String          @id @default(uuid())
  slug             String          @unique          // URL amigable: "chapa-pintura"
  name             String                           // "Chapa y Pintura"
  shortDescription String          @map("short_description")
  fullDescription  String          @map("full_description")
  icon             String                           // Icono Material Icons
  category         ServiceCategory
  estimatedMinutes Int?            @map("estimated_minutes") // Duracion en minutos
  priceMin         Decimal?        @map("price_min") @db.Decimal(10, 2)
  priceMax         Decimal?        @map("price_max") @db.Decimal(10, 2)
  priceLabel       String?         @map("price_label") // "Desde 49€" o "Presupuesto sin compromiso"
  features         String[]                          // Lista de caracteristicas
  isActive         Boolean         @default(true) @map("is_active")
  sortOrder        Int             @default(0) @map("sort_order")
  createdAt        DateTime        @default(now()) @map("created_at")

  // Relaciones
  appointments AppointmentService[]
  faqs         ServiceFaq[]

  @@map("services")
}

enum ServiceCategory {
  BODYWORK     // Chapa y pintura
  REPAIR       // Reparacion
  MAINTENANCE  // Mantenimiento
  INSPECTION   // Pre-ITV, revisiones
  OTHER        // Peritaje, etc.
}

// Preguntas frecuentes de cada servicio
model ServiceFaq {
  id        String @id @default(uuid())
  serviceId String @map("service_id")
  question  String
  answer    String
  sortOrder Int    @default(0) @map("sort_order")

  service Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@map("service_faqs")
}

// ─────────────────────────────────────────────
// CITAS
// ─────────────────────────────────────────────
// Citas reservadas por los clientes
model Appointment {
  id            String            @id @default(uuid())
  userId        String?           @map("user_id")       // null si reserva sin cuenta
  vehicleId     String?           @map("vehicle_id")    // null si no tiene vehiculo registrado
  scheduledDate DateTime          @map("scheduled_date") @db.Date
  scheduledTime String            @map("scheduled_time") // "10:00"
  duration      Int               @default(60)           // minutos
  status        AppointmentStatus @default(PENDING)
  notes         String?

  // Datos de contacto (por si reserva sin cuenta)
  customerName  String  @map("customer_name")
  customerEmail String  @map("customer_email")
  customerPhone String? @map("customer_phone")

  // Datos del vehiculo (por si no tiene vehiculo registrado)
  vehicleBrand String? @map("vehicle_brand")
  vehicleModel String? @map("vehicle_model")
  vehicleYear  Int?    @map("vehicle_year")
  vehiclePlate String? @map("vehicle_plate")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relaciones
  user     User?              @relation(fields: [userId], references: [id])
  vehicle  Vehicle?           @relation(fields: [vehicleId], references: [id])
  services AppointmentService[]

  @@map("appointments")
}

enum AppointmentStatus {
  PENDING      // Pendiente de confirmacion
  CONFIRMED    // Confirmada por el taller
  IN_PROGRESS  // En proceso de reparacion
  COMPLETED    // Finalizada
  CANCELLED    // Cancelada
}

// Tabla intermedia: una cita puede tener varios servicios
model AppointmentService {
  appointmentId String @map("appointment_id")
  serviceId     String @map("service_id")

  appointment Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  service     Service     @relation(fields: [serviceId], references: [id])

  @@id([appointmentId, serviceId])
  @@map("appointment_services")
}

// ─────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────
// Articulos del blog (escritos por ADMIN)
model BlogPost {
  id          String        @id @default(uuid())
  slug        String        @unique                 // URL: "como-cuidar-pintura-coche"
  title       String
  excerpt     String                                // Resumen corto para la lista
  content     String                                // Contenido completo (Markdown o HTML)
  coverImage  String?       @map("cover_image")     // URL de la imagen de portada
  authorId    String        @map("author_id")
  category    BlogCategory
  tags        String[]                              // ["pintura", "consejos", "mantenimiento"]
  isPublished Boolean       @default(false) @map("is_published")
  publishedAt DateTime?     @map("published_at")
  views       Int           @default(0)
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  // Relaciones
  author   User          @relation(fields: [authorId], references: [id])
  comments BlogComment[]

  @@map("blog_posts")
}

enum BlogCategory {
  TIPS         // Consejos de mantenimiento
  NEWS         // Noticias del taller
  GUIDES       // Guias paso a paso
  CASE_STUDY   // Casos reales / antes-despues
}

// Comentarios en los posts del blog
model BlogComment {
  id        String   @id @default(uuid())
  postId    String   @map("post_id")
  userId    String   @map("user_id")
  content   String
  createdAt DateTime @default(now()) @map("created_at")

  // Relaciones
  post BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User     @relation(fields: [userId], references: [id])

  @@map("blog_comments")
}

// ─────────────────────────────────────────────
// MENSAJES DE CONTACTO
// ─────────────────────────────────────────────
// Mensajes enviados desde el formulario de contacto
model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String?
  message   String
  isRead    Boolean  @default(false) @map("is_read")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("contact_messages")
}

// ─────────────────────────────────────────────
// CONFIGURACION DEL NEGOCIO
// ─────────────────────────────────────────────
// Horarios, dias festivos, configuracion general
model BusinessConfig {
  id    String @id @default(uuid())
  key   String @unique                // "morning_open", "afternoon_close", etc.
  value String                        // "08:00", "19:00", etc.

  @@map("business_config")
}
```

### Diagrama de relaciones

```
User ──────┬──→ Vehicle
           ├──→ Appointment ──→ AppointmentService ──→ Service ──→ ServiceFaq
           ├──→ BlogPost ──→ BlogComment
           └──→ BlogComment

ContactMessage (independiente)
BusinessConfig (independiente)
```

---

## Paso 5 — Crear la base de datos

```bash
# Crear la migracion inicial (genera las tablas en Postgres)
npx prisma migrate dev --name init

# Esto hace 3 cosas:
# 1. Crea la carpeta prisma/migrations/ con el SQL generado
# 2. Ejecuta ese SQL en tu base de datos
# 3. Regenera el cliente de Prisma (@prisma/client)
```
---

## Paso 6 — Crear el cliente de Prisma para Nuxt

Crea el archivo `server/utils/prisma.ts`:

```typescript
// server/utils/prisma.ts
// Cliente de Prisma reutilizable en todo el servidor.
// En desarrollo, evita crear multiples conexiones por hot-reload.

// Prisma v7 requiere un Driver Adapter para conectarse a la base de datos.
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

> **Por que el patron globalForPrisma?** En desarrollo, Nuxt hace hot-reload y cada recarga crearia una nueva conexion a Postgres. Con este patron, reutilizamos la misma conexion.

> **Por que ruta relativa y no `~/app/generated/prisma`?** En Nuxt 4, el alias `~` apunta al
> directorio `app/` (el srcDir), NO a la raiz del proyecto. Usar `~/app/generated/prisma` en un
> archivo de `server/` buscaria `app/app/generated/prisma` que no existe. La ruta relativa
> `../../app/generated/prisma/client` es correcta y fiable desde `server/utils/`.

> **Por que `/client` al final del import?** El generador de Prisma v7 no crea un `index.ts`.
> El punto de entrada del cliente es directamente el archivo `client.ts` dentro de la carpeta generada.

> **Por que `PrismaPg` y no `new PrismaClient()` directo?** El nuevo generador `prisma-client`
> de Prisma v7 elimino el soporte de conexion directa con URL. El constructor ahora exige un
> Driver Adapter (`adapter`) o una URL de Prisma Accelerate. Para PostgreSQL local se usa
> `@prisma/adapter-pg`.

---

## Paso 7 — Seed (datos iniciales)

Crea `prisma/seed.ts` para rellenar la base de datos con los servicios de Mobauto:

```typescript
// prisma/seed.ts
// Prisma v7: importar desde el archivo client.ts de la ruta de output del schema
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // ─── Crear usuario admin ───
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mobauto.es' },
    update: {},
    create: {
      email: 'admin@mobauto.es',
      passwordHash: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Mobauto',
      phone: '916041262',
    },
  })
  console.log('Admin creado:', admin.email)

  // ─── Crear servicios ───
  const servicesData = [
    {
      slug: 'chapa-pintura',
      name: 'Chapa y Pintura',
      shortDescription: 'Reparacion de carroceria, abolladuras, aranazos y pintado profesional.',
      fullDescription: 'Nuestro servicio estrella. En Mobauto somos especialistas en chapa y pintura con mas de 10 anos de experiencia.',
      icon: 'format_paint',
      category: 'BODYWORK' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Reparacion de abolladuras y golpes',
        'Pintado parcial o completo del vehiculo',
        'Igualacion de color con tecnologia computerizada',
        'Coche de sustitucion disponible',
      ],
      sortOrder: 1,
    },
    {
      slug: 'cristales',
      name: 'Cristales para Automoviles',
      shortDescription: 'Reparacion y sustitucion de lunas, parabrisas y cristales laterales.',
      fullDescription: 'Servicio integral de cristales para tu vehiculo.',
      icon: 'window',
      category: 'REPAIR' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Reparacion de impactos en parabrisas',
        'Sustitucion de lunas delanteras y traseras',
        'Cristales homologados',
      ],
      sortOrder: 2,
    },
    {
      slug: 'reparacion-general',
      name: 'Reparacion de Automoviles',
      shortDescription: 'Mecanica general: motor, frenos, suspension, embrague y mas.',
      fullDescription: 'Taller de reparacion integral.',
      icon: 'build',
      category: 'REPAIR' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Diagnostico electronico avanzado',
        'Reparacion de motor',
        'Sistemas de frenado',
        'Suspension y amortiguadores',
      ],
      sortOrder: 3,
    },
    {
      slug: 'mantenimiento',
      name: 'Mantenimiento Preventivo',
      shortDescription: 'Cambio de aceite, filtros, revisiones y mantenimiento periodico.',
      fullDescription: 'El mantenimiento preventivo es clave para alargar la vida de tu vehiculo.',
      icon: 'oil_barrel',
      category: 'MAINTENANCE' as const,
      priceMin: 49,
      priceLabel: 'Desde 49€',
      features: [
        'Cambio de aceite y filtros',
        'Revision de niveles',
        'Cambio de pastillas de freno',
      ],
      sortOrder: 4,
    },
    {
      slug: 'pre-itv',
      name: 'Pre-ITV',
      shortDescription: 'Revision completa previa a la ITV.',
      fullDescription: 'Revisamos todos los puntos que se evaluan en la ITV.',
      icon: 'verified',
      category: 'INSPECTION' as const,
      priceMin: 39,
      priceLabel: 'Desde 39€',
      features: [
        'Revision de emisiones',
        'Comprobacion de luces y senalizacion',
        'Estado de frenos',
      ],
      sortOrder: 5,
    },
    {
      slug: 'peritaje-siniestros',
      name: 'Peritaje y Siniestros',
      shortDescription: 'Gestion completa de siniestros con aseguradoras.',
      fullDescription: 'Nos encargamos de todo el proceso de gestion con tu aseguradora.',
      icon: 'description',
      category: 'OTHER' as const,
      priceLabel: 'Segun peritaje',
      features: [
        'Gestion integral con aseguradoras',
        'Peritaje in situ',
        'Coche de sustitucion',
      ],
      sortOrder: 6,
    },
  ]

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }
  console.log(`${servicesData.length} servicios creados`)

  // ─── Configuracion del negocio ───
  const configData = [
    { key: 'morning_open', value: '08:00' },
    { key: 'morning_close', value: '14:00' },
    { key: 'afternoon_open', value: '15:30' },
    { key: 'afternoon_close', value: '19:00' },
    { key: 'slot_minutes', value: '30' },
    { key: 'work_days', value: '1,2,3,4,5' },
  ]

  for (const config of configData) {
    await prisma.businessConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }
  console.log('Configuracion del negocio creada')

  console.log('Seed completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Registra el seed en `prisma.config.ts` — En Prisma v7 el seed ya NO va en `package.json`,
sino en la seccion `migrations` del archivo de configuracion de Prisma:

```typescript
// prisma.config.ts
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',  // <-- aqui
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

> **Error comun — "No seed command configured"**: En Prisma v5/v6 el seed se configuraba en
> `package.json` con `"prisma": { "seed": "..." }`. En Prisma v7 eso ya no funciona. Hay que
> ponerlo en `prisma.config.ts` bajo `migrations.seed`.

Instala `tsx` para ejecutar TypeScript (si no lo tienes ya):

```bash
npm install --save-dev tsx
```

Ejecuta el seed:

```bash
npx prisma db seed
```

---

## Paso 8 — Comandos utiles de Prisma

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Crear una nueva migracion despues de cambiar el schema
npx prisma migrate dev --name nombre_descriptivo

# Regenerar el cliente (si cambias el schema sin migrar)
npx prisma generate

# Abrir Prisma Studio (interfaz web para ver/editar datos)
npx prisma studio

# Resetear la base de datos (BORRA TODO y re-ejecuta migraciones + seed)
npx prisma migrate reset

# Formatear el schema
npx prisma format
```

---

## Paso 9 — Ejemplo de uso en un endpoint

Una vez configurado, asi se usa Prisma en los endpoints de Nuxt:

```typescript
// server/api/auth/register.post.ts (ejemplo actualizado)
// En Nuxt 4, server/utils/ es auto-importado: NO hace falta importar prisma manualmente.
// Si el IDE lo exige, usa la ruta relativa:
// import { prisma } from '../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, firstName, lastName, phone } = body

  // Verificar si el email ya existe
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email ya registrado' })
  }

  // Crear usuario
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
    },
  })

  return { id: user.id, email: user.email, role: user.role }
})
```

---

## Resumen de pasos

| Paso | Comando / Accion | Que hace |
|------|-------------------|----------|
| 1 | `docker compose up -d` | Levanta Postgres |
| 2 | `npm install prisma --save-dev && npm install @prisma/client @prisma/adapter-pg pg dotenv` | Instala Prisma + Driver Adapter |
| 2b | `npm install --save-dev @types/pg` | Tipos TypeScript para pg |
| 3 | `npx prisma init` | Crea schema.prisma, prisma.config.ts y .env |
| 4 | Editar `prisma/schema.prisma` — usar `provider = "prisma-client"` y `output = "../app/generated/prisma"` | Definir tablas y relaciones |
| 5 | `npx prisma generate` | Genera el cliente TypeScript en `app/generated/prisma/` |
| 6 | `npx prisma migrate dev --name init` | Crear tablas en Postgres |
| 7 | Crear `server/utils/prisma.ts` con `PrismaPg` adapter | Cliente reutilizable |
| 8 | `npx prisma db seed` | Rellenar datos iniciales |
| 9 | Actualizar endpoints en `server/api/` | Usar prisma (auto-importado por Nuxt) |

### Errores comunes en Prisma v7 + Nuxt 4

| Error | Causa | Solucion |
|-------|-------|----------|
| `Cannot find module '~/app/generated/prisma'` | En Nuxt 4, `~` apunta a `app/`, no a la raiz | Usar ruta relativa: `../../app/generated/prisma/client` |
| `Cannot find module '../../app/generated/prisma'` | No hay `index.ts` en la carpeta generada | Apuntar al archivo directamente: `.../prisma/client` |
| `Expected 1 arguments, but got 0` en `new PrismaClient()` | Prisma v7 ya no acepta conexion directa con URL | Usar `PrismaPg` adapter: `new PrismaClient({ adapter })` |
| `Cannot find module '@prisma/adapter-pg'` | Paquete no instalado | `npm install @prisma/adapter-pg pg` |
| `No seed command configured` | En Prisma v7 el seed ya no va en `package.json` | Moverlo a `prisma.config.ts` bajo `migrations.seed` |
