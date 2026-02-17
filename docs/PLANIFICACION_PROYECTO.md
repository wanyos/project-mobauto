# Planificación Proyecto - Aplicación Web Taller Mecánico

## Índice
1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Modelo de Datos](#modelo-de-datos)
7. [Fases de Desarrollo](#fases-de-desarrollo)
8. [Consideraciones de SEO](#consideraciones-de-seo)
9. [Seguridad](#seguridad)
10. [Despliegue](#despliegue)

---

## Visión General

Aplicación web full-stack para gestión integral de taller mecánico con enfoque en:
- **Captación de clientes** mediante posicionamiento SEO
- **Automatización** de procesos operativos
- **Experiencia de usuario** diferenciadora
- **Generación de valor** más allá del servicio básico

### Objetivos del Negocio
- Incrementar captación de clientes potenciales (leads)
- Reducir fricción en el proceso de reserva de citas
- Mejorar retención mediante servicios de valor añadido
- Optimizar gestión interna del taller
- Establecer presencia online profesional

---

## Stack Tecnológico

### Frontend
- **Framework**: Nuxt 3 (Vue 3)
- **Lenguaje**: TypeScript
- **Renderizado**: SSR (Server-Side Rendering) + Generación estática
- **Estilos**: Tailwind CSS + CSS personalizado
- **UI Components**: Quasar Framework
- **Gestión de Estado**: Pinia
- **Validación**: Zod + Vee-Validate
- **Fechas**: date-fns o dayjs

### Backend
- **Framework**: Fastify
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT + HTTP-only cookies
- **Validación**: Zod
- **File Upload**: @fastify/multipart
- **CORS**: @fastify/cors

### Infraestructura
- **Containerización**: Docker + Docker Compose
- **Control de Versiones**: Git
- **CI/CD**: GitHub Actions / GitLab CI
- **Hosting Frontend**: Vercel / Netlify / VPS
- **Hosting Backend**: VPS (DigitalOcean, Hetzner) / Railway
- **Base de Datos**: PostgreSQL (managed service o self-hosted)
- **Storage**: S3-compatible (Cloudflare R2, AWS S3, MinIO)
- **Email**: Resend (API simple) - Alternativa: Nodemailer
- **Notificaciones** (opcional): Telegram Bot API (100% gratis)

### Herramientas de Desarrollo
- **Monorepo**: pnpm workspaces (puedes usar npm si prefieres, pero pnpm es más eficiente para monorepos)
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + Playwright
- **API Documentation**: Swagger/OpenAPI
- **Logs**: Pino (Fastify integrado)

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Nuxt 3 Application (SSR)               │    │
│  │  - Pages (SEO optimized)                       │    │
│  │  - Components                                   │    │
│  │  - Composables                                  │    │
│  │  - Pinia Stores                                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/HTTPS
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  API GATEWAY (Fastify)                   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Routes     │  │ Middlewares  │  │   Plugins    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Business Logic Layer                   │  │
│  │  - Services (appointments, vehicles, etc)        │  │
│  │  - Validators (Zod schemas)                      │  │
│  │  - Utils                                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Data Access Layer                   │  │
│  │  - Prisma Client                                 │  │
│  │  - Repository Pattern (opcional)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   PostgreSQL Database                    │
│  - Users, Customers, Vehicles, Appointments, etc.       │
└──────────────────────────────────────────────────────────┘

External Services:
- Email Service (Resend API)
- Telegram Bot API (opcional - recordatorios instantáneos GRATIS)
- File Storage (S3-compatible)
- Payment Gateway (Stripe/Redsys - opcional)
- Google Calendar API (sincronización - opcional)
```

---

## Funcionalidades Principales

### 1. Página Web Pública (SEO Optimizado)

#### Landing Page
- Hero section con propuesta de valor clara
- Servicios destacados con imágenes
- Testimonios/reseñas de clientes
- Call-to-action prominente (Reservar Cita)
- Formulario de contacto
- Mapa de ubicación integrado
- Horarios de atención

#### Páginas de Servicios
- Detalle de cada servicio ofrecido
- Precios estimados (rangos)
- Tiempo estimado de servicio
- FAQ específicas por servicio
- Rich snippets para SEO (Schema.org)

#### Blog/Centro de Recursos
- Artículos sobre mantenimiento vehicular
- Guías de cuidado del automóvil
- Calendario de mantenimiento recomendado
- Calculadora de próxima revisión
- Descargables (checklist de mantenimiento PDF)

#### Calculadoras y Herramientas
- **Calculadora de mantenimiento**: Según km y antigüedad del vehículo
- **Estimador de presupuesto**: Presupuesto aproximado por servicio
- **Recordatorios de mantenimiento**: Sistema de alertas por email
- **Historial de vehículo**: Consulta de servicios previos (para clientes)

### 2. Sistema de Reserva de Citas

#### Calendario Inteligente
- Visualización de disponibilidad en tiempo real
- Selección de fecha y hora
- Duración estimada según servicio
- Bloqueo automático de slots ocupados
- Gestión de múltiples mecánicos/bahías

#### Proceso de Reserva
1. Selección de servicio(s)
2. Datos del vehículo (marca, modelo, año, matrícula)
3. Selección de fecha/hora
4. Datos de contacto
5. Notas adicionales
6. Confirmación (email + Telegram opcional)

#### Funcionalidades Avanzadas
- Reserva para clientes nuevos y registrados
- Reprogramación fácil
- Cancelación con política definida
- Lista de espera automática
- Recordatorios automáticos (24h antes, 2h antes)
- Confirmación de asistencia

### 3. Portal del Cliente

#### Dashboard Personal
- Próximas citas
- Historial de servicios
- Vehículos registrados
- Facturas y presupuestos
- Recomendaciones de mantenimiento personalizadas

#### Gestión de Vehículos
- Registro de múltiples vehículos
- Historial de reparaciones por vehículo
- Alertas de mantenimiento preventivo
- Documentación del vehículo (subir PDFs de manuales, etc.)

#### Programa de Fidelización (opcional)
- Sistema de puntos por servicio
- Descuentos por fidelidad
- Ofertas exclusivas
- Referidos (descuento por traer nuevos clientes)

### 4. Panel de Administración (Taller)

#### Gestión de Citas
- Calendario completo con vista diaria/semanal/mensual
- Arrastrar y soltar para reprogramar
- Estados: Pendiente, Confirmada, En proceso, Completada, Cancelada
- Asignación de mecánicos
- Notas internas

#### Gestión de Clientes
- Base de datos de clientes
- Historial completo de interacciones
- Vehículos asociados
- Estadísticas de valor del cliente (CLV)

#### Gestión de Servicios
- Catálogo de servicios
- Precios y duraciones
- Inventario de repuestos (opcional)
- Proveedores

#### Facturación y Presupuestos
- Generación de presupuestos
- Aprobación por cliente (digital)
- Generación de facturas
- Historial de pagos
- Exportación contable

#### Reportes y Analíticas
- Ingresos por período
- Servicios más solicitados
- Tasa de ocupación
- Tasa de conversión (visitas web → citas)
- Tasa de retención de clientes
- Tiempo promedio por servicio

### 5. Funcionalidades de Marketing

#### Generación de Leads
- Formularios optimizados de contacto
- Landing pages para campañas específicas
- Pop-ups inteligentes (no intrusivos)
- Chat en vivo / WhatsApp Business integration

#### Email Marketing
- Newsletter automática
- Campañas segmentadas
- Emails transaccionales (confirmaciones, recordatorios)
- Emails de reactivación (clientes inactivos)

#### SEO y Content Marketing
- Blog integrado con CMS
- Optimización on-page automática
- Sitemap XML generado
- Meta tags dinámicos
- Structured data (JSON-LD)
- Open Graph para redes sociales

#### Integraciones
- Google Analytics / Plausible
- Google Search Console
- Facebook Pixel
- Google My Business (actualización de horarios)

---

## Estructura del Proyecto

```
mobauto/
├── .github/
│   └── workflows/           # CI/CD pipelines
├── apps/
│   ├── web/                 # Nuxt 3 Frontend
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── booking/
│   │   │   ├── admin/
│   │   │   └── client/
│   │   ├── composables/
│   │   ├── layouts/
│   │   ├── middleware/
│   │   ├── pages/
│   │   │   ├── index.vue
│   │   │   ├── servicios/
│   │   │   ├── reservar/
│   │   │   ├── blog/
│   │   │   ├── admin/
│   │   │   └── mi-cuenta/
│   │   ├── plugins/
│   │   ├── public/
│   │   ├── server/          # Nuxt server routes (API híbrida)
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.vue
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   │
│   └── api/                 # Fastify Backend
│       ├── src/
│       │   ├── config/
│       │   │   └── index.ts
│       │   ├── plugins/
│       │   │   ├── cors.ts
│       │   │   ├── jwt.ts
│       │   │   └── prisma.ts
│       │   ├── routes/
│       │   │   ├── auth/
│       │   │   ├── appointments/
│       │   │   ├── customers/
│       │   │   ├── vehicles/
│       │   │   ├── services/
│       │   │   └── admin/
│       │   ├── services/    # Business logic
│       │   │   ├── appointment.service.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── email.service.ts
│       │   │   └── ...
│       │   ├── schemas/     # Zod validation schemas
│       │   │   ├── appointment.schema.ts
│       │   │   └── ...
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   └── error.middleware.ts
│       │   ├── utils/
│       │   │   ├── hash.ts
│       │   │   └── tokens.ts
│       │   ├── types/
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   ├── migrations/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── tests/
│       ├── .env.example
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                # Shared code (opcional)
│   └── shared-types/
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
│
├── docs/
│   ├── api/
│   └── architecture/
│
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── PLANIFICACION_PROYECTO.md (este archivo)
```

---

## Modelo de Datos

### Entidades Principales

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(CUSTOMER)
  profile       Profile?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  MECHANIC
  ADMIN
}

model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  firstName     String
  lastName      String
  phone         String?
  telegramChatId String?  // Para notificaciones por Telegram (opcional)
  avatar        String?
  customer      Customer?
}

model Customer {
  id            String        @id @default(cuid())
  profileId     String        @unique
  profile       Profile       @relation(fields: [profileId], references: [id])
  vehicles      Vehicle[]
  appointments  Appointment[]
  loyaltyPoints Int           @default(0)
  createdAt     DateTime      @default(now())
}

model Vehicle {
  id            String        @id @default(cuid())
  customerId    String
  customer      Customer      @relation(fields: [customerId], references: [id])
  brand         String
  model         String
  year          Int
  licensePlate  String        @unique
  vin           String?
  kilometers    Int?
  appointments  Appointment[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Service {
  id                String              @id @default(cuid())
  name              String
  description       String?
  estimatedDuration Int                 // minutos
  basePrice         Decimal             @db.Decimal(10, 2)
  category          ServiceCategory
  isActive          Boolean             @default(true)
  appointments      AppointmentService[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

enum ServiceCategory {
  MAINTENANCE
  REPAIR
  DIAGNOSIS
  BODYWORK
  TIRE_SERVICE
  INSPECTION
  OTHER
}

model Appointment {
  id            String              @id @default(cuid())
  customerId    String
  customer      Customer            @relation(fields: [customerId], references: [id])
  vehicleId     String
  vehicle       Vehicle             @relation(fields: [vehicleId], references: [id])
  services      AppointmentService[]
  scheduledAt   DateTime
  duration      Int                 // minutos calculados
  status        AppointmentStatus   @default(PENDING)
  notes         String?
  mechanicNotes String?
  totalPrice    Decimal?            @db.Decimal(10, 2)
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}

model AppointmentService {
  id            String      @id @default(cuid())
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  serviceId     String
  service       Service     @relation(fields: [serviceId], references: [id])
  price         Decimal     @db.Decimal(10, 2)

  @@unique([appointmentId, serviceId])
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

model Availability {
  id            String    @id @default(cuid())
  dayOfWeek     Int       // 0-6 (domingo-sábado)
  startTime     String    // "09:00"
  endTime       String    // "18:00"
  slotDuration  Int       // minutos (ej: 30)
  maxConcurrent Int       @default(1)
  isActive      Boolean   @default(true)
}

model BlockedSlot {
  id          String    @id @default(cuid())
  date        DateTime
  startTime   String
  endTime     String
  reason      String?
  createdAt   DateTime  @default(now())
}

// Tablas adicionales para funcionalidades avanzadas

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String    @db.Text
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model EmailCampaign {
  id          String    @id @default(cuid())
  name        String
  subject     String
  htmlContent String    @db.Text
  sentAt      DateTime?
  createdAt   DateTime  @default(now())
}

model MaintenanceReminder {
  id          String    @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id])
  type        String    // "oil_change", "tire_rotation", etc
  dueDate     DateTime?
  dueKm       Int?
  sent        Boolean   @default(false)
  createdAt   DateTime  @default(now())
}
```

---

## Fases de Desarrollo

### Fase 0: Setup Inicial (1 semana)

**Objetivos**:
- Configurar monorepo con pnpm workspaces (o npm si prefieres)
- Inicializar proyectos Nuxt y Fastify
- Configurar TypeScript en ambos proyectos
- Integrar Quasar Framework con Nuxt
- Setup de herramientas (ESLint, Prettier)
- Configurar Git y .gitignore
- Docker Compose para desarrollo local

**Tareas**:
- [ ] Crear estructura de carpetas del monorepo
- [ ] `pnpm init` (o `npm init`) en raíz y configurar workspace
- [ ] `npx nuxi@latest init apps/web`
- [ ] Instalar y configurar Quasar en Nuxt: `pnpm add nuxt-quasar-ui quasar @quasar/extras`
- [ ] Configurar Tailwind CSS en `nuxt.config.ts`
- [ ] Inicializar Fastify en `apps/api`
- [ ] Configurar TypeScript strict mode en ambos proyectos
- [ ] Setup Prisma con PostgreSQL
- [ ] Docker Compose (Postgres + pgAdmin)
- [ ] Configurar ESLint y Prettier compartidos
- [ ] README.md con instrucciones de setup

**Entregables**:
- Proyectos compilando sin errores
- Base de datos levantada en Docker
- Scripts de desarrollo funcionando

---

### Fase 1: Autenticación y Usuarios Base (2 semanas)

**Objetivos**:
- Sistema de autenticación completo
- Registro y login de usuarios
- Roles y permisos básicos
- Protección de rutas

**Backend**:
- [ ] Prisma schema: User, Profile
- [ ] Service de autenticación (hash, JWT)
- [ ] Rutas: POST /auth/register, /auth/login, /auth/me
- [ ] Middleware de autenticación
- [ ] Validación con Zod
- [ ] Refresh tokens (opcional)

**Frontend**:
- [ ] Páginas: /login, /register
- [ ] Composable `useAuth()`
- [ ] Middleware de autenticación en Nuxt
- [ ] Store de usuario (Pinia)
- [ ] Formularios con validación
- [ ] Manejo de errores

**Testing**:
- [ ] Tests unitarios de servicios
- [ ] Tests de integración de rutas auth

---

### Fase 2: Landing Page y SEO (2 semanas)

**Objetivos**:
- Página principal optimizada para SEO
- Páginas de servicios
- Formulario de contacto funcional
- Meta tags dinámicos

**Frontend**:
- [ ] Diseño responsive de landing page
- [ ] Sección hero con CTA
- [ ] Sección de servicios
- [ ] Testimonios
- [ ] Footer con información de contacto
- [ ] Página /servicios con listado
- [ ] Páginas dinámicas /servicios/[slug]
- [ ] Configurar SEO (useHead, useSeoMeta)
- [ ] Sitemap.xml generado
- [ ] robots.txt
- [ ] Structured data (JSON-LD)

**Backend**:
- [ ] CRUD de servicios
- [ ] Endpoint para formulario de contacto
- [ ] Integración con servicio de email

**Contenido**:
- [ ] Textos para servicios principales
- [ ] Imágenes optimizadas (WebP)
- [ ] Favicon y meta images

---

### Fase 3: Sistema de Reserva de Citas (3-4 semanas)

**Objetivos**:
- Calendario de disponibilidad
- Proceso completo de reserva
- Confirmaciones por email

**Backend**:
- [ ] Prisma schema: Appointment, Vehicle, Availability, BlockedSlot
- [ ] Lógica de disponibilidad de slots
- [ ] Service de appointments
- [ ] Rutas CRUD appointments
- [ ] Validación de conflictos de horario
- [ ] Service de envío de emails con Resend (confirmación, recordatorios)
- [ ] Service de Telegram Bot - OPCIONAL (notificaciones instantáneas gratis)
- [ ] Webhooks/cron para recordatorios automáticos (node-cron o similar)

**Frontend**:
- [ ] Página /reservar con stepper
- [ ] Componente de calendario con slots
- [ ] Formulario de selección de servicios
- [ ] Formulario de datos del vehículo
- [ ] Resumen y confirmación
- [ ] Página de confirmación
- [ ] Integración con backend

**Features**:
- [ ] Cálculo automático de duración según servicios
- [ ] Prevención de double-booking
- [ ] Lista de espera (opcional)

---

### Fase 4: Portal del Cliente (2-3 semanas)

**Objetivos**:
- Dashboard personal
- Gestión de vehículos
- Historial de citas
- Reprogramación de citas

**Frontend**:
- [ ] Layout de panel de cliente
- [ ] Dashboard con resumen
- [ ] Página /mi-cuenta/citas
- [ ] Página /mi-cuenta/vehiculos
- [ ] Formulario de añadir/editar vehículo
- [ ] Página /mi-cuenta/perfil

**Backend**:
- [ ] Endpoints de gestión de vehículos
- [ ] Endpoint de historial de citas
- [ ] Endpoint de reprogramación
- [ ] Endpoint de cancelación
- [ ] Lógica de políticas de cancelación

---

### Fase 5: Panel de Administración (3-4 semanas)

**Objetivos**:
- Dashboard administrativo
- Gestión completa de citas
- Gestión de clientes
- Reportes básicos

**Frontend**:
- [ ] Layout de admin
- [ ] Dashboard con métricas
- [ ] Calendario admin con drag & drop
- [ ] Tabla de citas con filtros
- [ ] CRUD de clientes
- [ ] CRUD de servicios
- [ ] Página de reportes
- [ ] Gráficas (Chart.js / ECharts)

**Backend**:
- [ ] Middleware de autorización (ADMIN role)
- [ ] Endpoints de gestión completa de citas
- [ ] Endpoints de gestión de clientes
- [ ] Endpoints de gestión de servicios
- [ ] Endpoints de estadísticas
- [ ] Exportación de reportes (CSV/PDF)

---

### Fase 6: Funcionalidades Avanzadas (2-3 semanas)

**Objetivos**:
- Blog/centro de recursos
- Calculadoras
- Sistema de notificaciones
- Integraciones

**Features**:
- [ ] Blog con CMS básico
- [ ] Calculadora de mantenimiento
- [ ] Estimador de presupuesto
- [ ] Sistema de notificaciones en tiempo real (opcional)
- [ ] Integración Google Calendar (opcional)
- [ ] WhatsApp Business integration
- [ ] Analytics (Google Analytics / Plausible)

---

### Fase 7: Testing y Optimización (2 semanas)

**Objetivos**:
- Cobertura de tests
- Optimización de rendimiento
- Accesibilidad
- PWA (opcional)

**Tareas**:
- [ ] Tests E2E con Playwright
- [ ] Tests de carga del backend
- [ ] Optimización de queries SQL
- [ ] Lazy loading de imágenes
- [ ] Code splitting optimizado
- [ ] Lighthouse audit (90+ score)
- [ ] Accesibilidad (WCAG AA)
- [ ] PWA con service worker (opcional)

---

### Fase 8: Despliegue y Monitoreo (1 semana)

**Objetivos**:
- Deploy a producción
- Monitoreo
- Backups
- Documentación

**Tareas**:
- [ ] Setup CI/CD pipeline
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (VPS/Railway)
- [ ] Configurar dominio y SSL
- [ ] Setup base de datos en producción
- [ ] Backups automáticos de BD
- [ ] Logging y monitoreo (Sentry, LogTail)
- [ ] Documentación de API (Swagger)
- [ ] Guía de usuario

---

## Consideraciones de SEO

### On-Page SEO

**Meta Tags Esenciales**:
```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Taller Mecánico [Nombre] - Reparación y Mantenimiento',
  description: 'Taller mecánico profesional en [Ciudad]. Mantenimiento, reparación y diagnóstico. Reserva tu cita online.',
  ogTitle: 'Taller Mecánico [Nombre]',
  ogDescription: '...',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>
```

**Structured Data**:
```typescript
// LocalBusiness schema
{
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "name": "Taller Mecánico [Nombre]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "...",
    "postalCode": "...",
    "addressCountry": "ES"
  },
  "telephone": "+34...",
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "€€"
}
```

**Estrategia de Contenido**:
- Keywords long-tail: "taller mecánico en [ciudad]", "cambio de aceite [ciudad]"
- Blog posts sobre mantenimiento vehicular
- FAQs optimizadas
- URLs amigables: `/servicios/cambio-aceite`
- Alt text en todas las imágenes
- Headings jerárquicos (H1 único, H2, H3)

### Technical SEO

- Sitemap XML automático (Nuxt)
- Robots.txt configurado
- Canonical URLs
- Hreflang si es multiidioma
- Core Web Vitals optimizados:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Mobile-first design
- Lazy loading de imágenes
- Preload de recursos críticos

---

## Seguridad

### Backend

- **Autenticación**: JWT con expiración corta + refresh tokens
- **Passwords**: bcrypt con salt rounds >= 12
- **Rate Limiting**: Fastify rate limit plugin
- **CORS**: Configurado solo para dominios permitidos
- **Helmet**: Headers de seguridad (@fastify/helmet)
- **SQL Injection**: Protegido por Prisma (ORM)
- **XSS**: Sanitización de inputs
- **CSRF**: CSRF tokens en formularios
- **Validación**: Zod en todos los endpoints

### Frontend

- **HTTP-only cookies**: Para refresh tokens
- **HTTPS**: Obligatorio en producción
- **Environment variables**: No exponer secrets
- **CSP**: Content Security Policy configurado
- **Sanitización**: HTML en contenido generado por usuarios

### Base de Datos

- **Encriptación**: En reposo y en tránsito
- **Backups**: Diarios automáticos
- **Least privilege**: Usuarios con permisos mínimos
- **Migraciones**: Versionadas con Prisma Migrate

### Compliance

- **RGPD**: Política de privacidad
- **Cookies**: Banner de consentimiento
- **Derecho al olvido**: Endpoint de eliminación de datos

---

## Despliegue

### Opción 1: Serverless/Managed

**Frontend**: Vercel o Netlify
- Deploy automático desde Git
- Edge functions
- CDN global
- SSL automático

**Backend**: Railway o Render
- Deploy desde Git
- Postgres managed
- Escalado automático
- Logs y métricas

**Pros**: Configuración mínima, escalado automático
**Contras**: Costos variables, vendor lock-in

### Opción 2: VPS (DigitalOcean, Hetzner)

**Setup**:
- Ubuntu Server
- Docker + Docker Compose
- Nginx como reverse proxy
- Certbot para SSL
- PostgreSQL en container o managed

**Pros**: Control total, costos predecibles
**Contras**: Requiere DevOps knowledge

### Opción 3: Híbrido

- **Frontend**: Vercel (óptimo para Nuxt SSR)
- **Backend + DB**: VPS con Docker

**Recomendación**: Empezar con opción híbrida para balance costo/complejidad

---

## Presupuesto de Tiempo Estimado

| Fase | Duración |
|------|----------|
| Fase 0: Setup | 1 semana |
| Fase 1: Auth | 2 semanas |
| Fase 2: Landing + SEO | 2 semanas |
| Fase 3: Reservas | 4 semanas |
| Fase 4: Portal Cliente | 3 semanas |
| Fase 5: Admin Panel | 4 semanas |
| Fase 6: Features Avanzadas | 3 semanas |
| Fase 7: Testing | 2 semanas |
| Fase 8: Deploy | 1 semana |
| **TOTAL** | **22 semanas (~5.5 meses)** |

*Nota*: Tiempos para 1 desarrollador full-time. Ajustar según disponibilidad.

---

## Métricas de Éxito

### Técnicas
- Lighthouse score > 90 en todas las categorías
- Uptime > 99.5%
- Tiempo de respuesta API < 200ms (p95)
- Cobertura de tests > 70%

### Negocio
- Conversión visita → cita reservada > 5%
- Tasa de cancelación < 10%
- Retención de clientes a 6 meses > 60%
- Posicionamiento en top 3 de Google para keywords locales (3-6 meses)

---

## Próximos Pasos Inmediatos

1. **Revisar y aprobar esta planificación**
2. **Definir identidad visual** (logo, colores, tipografía)
3. **Configurar entorno de desarrollo** (Fase 0)
4. **Crear repositorio Git**
5. **Inicializar proyectos**
6. **Primera reunión de sprint planning**

---

## Recursos y Referencias

### Documentación Oficial
- [Nuxt 3 Docs](https://nuxt.com/)
- [Quasar Framework](https://quasar.dev/)
- [Quasar + Nuxt Integration](https://nuxt.com/modules/quasar)
- [Fastify Docs](https://fastify.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### Servicios Externos
- [Resend - Email API](https://resend.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### UI/UX Inspiration
- [Dribbble - Automotive](https://dribbble.com/search/automotive)
- [Awwwards - Service Websites](https://www.awwwards.com/)

### SEO
- [Google Search Central](https://developers.google.com/search)
- [Schema.org - LocalBusiness](https://schema.org/LocalBusiness)

---

## Notas de Implementación

### Configuración de Quasar con Nuxt

En `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: ['nuxt-quasar-ui'],
  quasar: {
    plugins: ['Notify', 'Dialog', 'Loading'],
    config: {
      brand: {
        primary: '#1976d2',
        // ... tus colores personalizados
      }
    }
  },
  css: ['~/assets/css/tailwind.css']
})
```

### Servicio de Email con Resend (Simple)

```typescript
// apps/api/src/services/email.service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAppointmentConfirmation(to: string, data: any) {
  await resend.emails.send({
    from: 'Taller <noreply@tudominio.com>',
    to: [to],
    subject: 'Confirmación de Cita',
    html: `<p>Tu cita ha sido confirmada para el ${data.date}</p>`
  });
}
```

**Ventajas de Resend vs Nodemailer**:
- API más simple (solo HTTP requests)
- No necesitas configurar SMTP
- React Email para templates (opcional pero potente)
- Mejor deliverability
- Logs y analytics incluidos

### Servicio de Telegram Bot (Opcional - 100% GRATIS)

```typescript
// apps/api/src/services/telegram.service.ts
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

export async function sendAppointmentReminder(chatId: string, message: string) {
  await bot.sendMessage(chatId, message, {
    parse_mode: 'HTML'
  });
}

// Ejemplo de mensaje con formato
export async function sendAppointmentConfirmation(chatId: string, data: any) {
  const message = `
🔧 <b>Confirmación de Cita</b>

📅 Fecha: ${data.date}
⏰ Hora: ${data.time}
🚗 Vehículo: ${data.vehicle}
🛠️ Servicio: ${data.service}

¡Te esperamos!
  `.trim();

  await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
}
```

**Cómo configurar el Telegram Bot**:

1. **Crear el bot** (solo una vez):
   - Habla con [@BotFather](https://t.me/botfather) en Telegram
   - Envía `/newbot` y sigue las instrucciones
   - Guarda el token que te da

2. **Obtener el chatId del cliente**:
   ```typescript
   // Webhook o endpoint para vincular cuenta
   bot.onText(/\/start/, (msg) => {
     const chatId = msg.chat.id;
     // Guardar chatId en la base de datos del cliente
     // Enviar mensaje de bienvenida
   });
   ```

3. **En el frontend** (proceso de registro/configuración):
   - Mostrar botón: "Activar notificaciones de Telegram"
   - Enlace: `https://t.me/tu_bot_name?start=USER_ID_ENCODED`
   - Cuando el usuario haga clic en "Start", guardar su chatId

**Ventajas de Telegram**:
- ✅ **100% GRATIS** - Sin límites de mensajes
- ✅ API oficial y estable
- ✅ Soporta markdown, HTML, botones interactivos
- ✅ Puedes enviar imágenes, PDFs (facturas), etc.
- ✅ No requiere aprobación ni verificación
- ✅ Los clientes pueden desactivar notificaciones fácilmente

**Flujo recomendado**:
1. Email → Principal (todos los clientes)
2. Telegram → Opcional (clientes que quieran notificaciones instantáneas)
3. Al registrarse: "¿Quieres recibir recordatorios por Telegram?" → Link al bot

### npm vs pnpm

**Si usas npm** en lugar de pnpm:
- Cambia `pnpm-workspace.yaml` por `package.json` con workspaces
- Usa `npm install` en lugar de `pnpm install`
- Los comandos son prácticamente idénticos

**Ventajas de pnpm**:
- Más rápido (hasta 2x)
- Ahorra espacio en disco (hard links)
- Mejor manejo de dependencias en monorepos
- Más estricto (evita bugs)

---

**Documento creado**: 2026-02-16
**Versión**: 1.2
**Última actualización**: 2026-02-16 - Telegram Bot en lugar de SMS/WhatsApp
**Próxima revisión**: Tras completar Fase 0
