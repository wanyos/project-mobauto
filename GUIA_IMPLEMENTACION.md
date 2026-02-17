# Guía de Implementación Paso a Paso - Mobauto

> Esta guía te lleva de la mano desde el proyecto Nuxt vacío hasta la aplicación completa.
> Cada paso incluye el **comando** o **código** exacto y una **explicación** de por qué lo hacemos.

---

## FASE 0: Setup Inicial

### Paso 0.1 — Entender qué tenemos ahora

Tu proyecto actual es un Nuxt 4 básico con esta estructura:

```
project-mobauto/
├── app/
│   └── app.vue          ← Componente raíz (muestra NuxtWelcome)
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts       ← Configuración de Nuxt
├── package.json         ← Dependencias (solo nuxt, vue, vue-router)
├── tsconfig.json
└── PLANIFICACION_PROYECTO.md
```

**¿Qué es cada cosa?**
- `app/app.vue`: El componente raíz de Vue. Todo lo que se renderiza pasa por aquí.
- `nuxt.config.ts`: El cerebro de Nuxt. Aquí se configuran módulos, plugins, CSS, SEO, etc.
- `public/`: Archivos estáticos servidos tal cual (favicon, imágenes, robots.txt).

---

### Paso 0.2 — Instalar dependencias base

Abre la terminal en la raíz del proyecto y ejecuta:

```bash
# 1. Tailwind CSS (estilos utility-first)
npm install -D @nuxtjs/tailwindcss

# 2. Quasar Framework (componentes UI: botones, tablas, diálogos, etc.)
npm install nuxt-quasar-ui quasar @quasar/extras

# 3. Pinia (gestión de estado global - como un "almacén" compartido entre componentes)
npm install pinia @pinia/nuxt

# 4. Validación de formularios
npm install zod @vee-validate/zod vee-validate

# 5. Manejo de fechas
npm install date-fns
```

**¿Por qué cada una?**
- **Tailwind CSS**: En vez de escribir CSS manualmente (`margin-top: 16px`), usas clases directamente en HTML (`mt-4`). Más rápido y consistente.
- **Quasar**: Te da componentes listos como `<q-btn>`, `<q-table>`, `<q-dialog>`. No reinventas la rueda.
- **Pinia**: Cuando varios componentes necesitan compartir datos (ej: usuario logueado), Pinia los centraliza.
- **Zod + VeeValidate**: Zod define reglas ("email debe ser válido"), VeeValidate las conecta con los formularios.
- **date-fns**: Formatear fechas ("15 de febrero de 2026") sin dolor.

---

### Paso 0.3 — Configurar nuxt.config.ts

Reemplaza el contenido de `nuxt.config.ts` con:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Fecha de compatibilidad (Nuxt lo usa para features internas)
  compatibilityDate: '2025-07-15',

  // Herramientas de desarrollo (solo en modo dev)
  devtools: { enabled: true },

  // ─── MÓDULOS ───
  // Los módulos extienden Nuxt con funcionalidades extra.
  // Cada string aquí carga un paquete que ya instalaste con npm.
  modules: [
    '@nuxtjs/tailwindcss',  // Activa Tailwind CSS
    '@pinia/nuxt',          // Activa Pinia (stores)
    'nuxt-quasar-ui',       // Activa Quasar Framework
  ],

  // ─── CONFIGURACIÓN DE QUASAR ───
  quasar: {
    // Plugins de Quasar que queremos usar globalmente
    plugins: ['Notify', 'Dialog', 'Loading'],
    config: {
      brand: {
        // Colores de Mobauto
        // Azul oscuro profesional (confianza, seriedad en automoción)
        // Naranja como acento (energía, acción — ideal para CTAs y destacados)
        primary: '#1B3A5C',    // Azul oscuro — color principal de Mobauto
        secondary: '#2D5F8A',  // Azul medio — variación para hover, fondos
        accent: '#E8712B',     // Naranja — botones de acción, llamadas a la acción
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
  },

  // ─── CONFIGURACIÓN DE LA APP ───
  app: {
    head: {
      // Título por defecto (se puede sobrescribir por página)
      title: 'Mobauto - Taller de Chapa, Pintura y Mecánica en Humanes de Madrid',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Mobauto — Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid. Más de 10 años de experiencia. Presupuesto sin compromiso. Tel: 916 04 12 62',
        },
      ],
      // Fuentes: Roboto (texto general) + Montserrat (títulos, más impacto)
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@600;700;800&display=swap',
        },
      ],
    },
  },

  // ─── TYPESCRIPT ───
  typescript: {
    strict: true, // Modo estricto: te obliga a tipar bien. Molesto al inicio, salvador después.
  },
})
```

**¿Qué hace cada sección?**
- `modules`: Le dice a Nuxt "carga estos plugins". Sin esto, aunque instales el paquete, no se activa.
- `quasar.plugins`: `Notify` = notificaciones toast, `Dialog` = ventanas de confirmación, `Loading` = spinner global.
- `quasar.config.brand`: Los colores que Quasar usa en todos sus componentes. `primary` es el color principal.
- `app.head`: El `<head>` HTML global. Aquí van meta tags para SEO, fuentes, etc.
- `typescript.strict`: Activa verificaciones estrictas de tipos. Te avisará de errores antes de ejecutar.

---

### Paso 0.4 — Configurar Tailwind CSS

Crea el archivo de configuración de Tailwind:

```bash
# Crear la carpeta assets/css dentro de app/
mkdir -p app/assets/css
```

Crea el archivo `app/assets/css/main.css`:

```css
/* app/assets/css/main.css */

/* Estas 3 directivas cargan Tailwind CSS */
@tailwind base;       /* Reset de estilos y estilos base */
@tailwind components; /* Clases de componentes (puedes añadir las tuyas) */
@tailwind utilities;  /* Clases utility: mt-4, text-red-500, flex, etc. */

/* ─── TUS ESTILOS GLOBALES ─── */

body {
  font-family: 'Roboto', sans-serif;
}

/* Ejemplo: clase personalizada que combina utilidades de Tailwind */
@layer components {
  .btn-primary {
    @apply bg-mobauto text-white px-6 py-2 rounded-lg hover:bg-mobauto-dark transition-colors;
  }
  .btn-accent {
    @apply bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors;
  }
}
```

Crea el archivo `tailwind.config.ts` en la raíz del proyecto:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Mobauto (úsalos como text-mobauto, bg-mobauto-light, etc.)
        mobauto: {
          DEFAULT: '#1B3A5C',  // Azul oscuro principal
          light: '#2D5F8A',    // Azul medio
          dark: '#0F2440',     // Azul muy oscuro
        },
        accent: {
          DEFAULT: '#E8712B',  // Naranja acento
          light: '#F09454',    // Naranja claro
          dark: '#C45A1A',     // Naranja oscuro
        },
      },
      fontFamily: {
        // Para usar: class="font-heading" o class="font-body"
        heading: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

**¿Qué es `content`?** Le dice a Tailwind "busca clases CSS en estos archivos". Si no lo configuras, Tailwind no genera las clases que usas y los estilos no aparecen.

---

### Paso 0.5 — Crear la estructura de carpetas

Nuxt usa **convención sobre configuración**: si creas una carpeta `pages/`, automáticamente genera rutas. Si creas `components/`, auto-importa componentes.

```bash
# Crear todas las carpetas necesarias dentro de app/
mkdir -p app/components/common
mkdir -p app/components/home
mkdir -p app/components/booking
mkdir -p app/components/admin
mkdir -p app/components/client
mkdir -p app/composables
mkdir -p app/layouts
mkdir -p app/middleware
mkdir -p app/pages/servicios
mkdir -p app/pages/reservar
mkdir -p app/pages/blog
mkdir -p app/pages/admin
mkdir -p app/pages/mi-cuenta
mkdir -p app/plugins
mkdir -p app/stores
mkdir -p app/types
mkdir -p app/utils
mkdir -p server/api
mkdir -p server/middleware
```

**¿Qué hace cada carpeta?**

| Carpeta | Función | Auto-import |
|---------|---------|-------------|
| `pages/` | Cada archivo `.vue` = una ruta URL | Sí (rutas automáticas) |
| `components/` | Componentes reutilizables | Sí (no necesitas import) |
| `composables/` | Lógica reutilizable (hooks) | Sí |
| `layouts/` | Plantillas de página (header + footer + contenido) | Sí |
| `middleware/` | Código que se ejecuta ANTES de cada navegación | Sí |
| `plugins/` | Código que se ejecuta al arrancar la app | Sí |
| `stores/` | Almacenes Pinia (estado global) | No (import manual) |
| `types/` | Definiciones TypeScript | No |
| `utils/` | Funciones helper genéricas | Sí |
| `server/` | Backend integrado de Nuxt (API routes) | Sí |

---

### Paso 0.6 — Crear los tipos base (TypeScript)

Los tipos definen la "forma" de tus datos. Es como un contrato: si dices que un `Vehicle` tiene `brand: string`, TypeScript te avisará si intentas usar un número.

Crea `app/types/index.ts`:

```typescript
// app/types/index.ts
// ─── Tipos globales de la aplicación ───

// Roles de usuario
export type UserRole = 'CUSTOMER' | 'MECHANIC' | 'ADMIN'

// Usuario (lo que devuelve el backend)
export interface User {
  id: string
  email: string
  role: UserRole
  profile?: Profile
  createdAt: string
  updatedAt: string
}

// Perfil del usuario
export interface Profile {
  id: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
}

// Vehículo
export interface Vehicle {
  id: string
  brand: string       // "Toyota"
  model: string       // "Corolla"
  year: number        // 2020
  licensePlate: string // "1234 ABC"
  vin?: string        // Número de bastidor (opcional)
  kilometers?: number
  createdAt: string
  updatedAt: string
}

// Categorías de servicio
export type ServiceCategory =
  | 'MAINTENANCE'   // Mantenimiento
  | 'REPAIR'        // Reparación
  | 'DIAGNOSIS'     // Diagnóstico
  | 'BODYWORK'      // Chapa y pintura
  | 'TIRE_SERVICE'  // Neumáticos
  | 'INSPECTION'    // ITV / Inspección
  | 'OTHER'         // Otros

// Servicio del taller
export interface Service {
  id: string
  name: string              // "Cambio de aceite"
  description?: string
  estimatedDuration: number // minutos
  basePrice: number         // euros
  category: ServiceCategory
  isActive: boolean
}

// Estados de una cita
export type AppointmentStatus =
  | 'PENDING'      // Pendiente de confirmar
  | 'CONFIRMED'    // Confirmada
  | 'IN_PROGRESS'  // En proceso
  | 'COMPLETED'    // Completada
  | 'CANCELLED'    // Cancelada
  | 'NO_SHOW'      // No se presentó

// Cita
export interface Appointment {
  id: string
  customerId: string
  vehicleId: string
  vehicle?: Vehicle
  services: AppointmentService[]
  scheduledAt: string     // ISO date string
  duration: number        // minutos
  status: AppointmentStatus
  notes?: string
  totalPrice?: number
  createdAt: string
  updatedAt: string
}

// Relación cita-servicio (con precio específico)
export interface AppointmentService {
  id: string
  serviceId: string
  service?: Service
  price: number
}

// ─── Tipos para formularios y API ───

// Lo que envías al backend para login
export interface LoginRequest {
  email: string
  password: string
}

// Lo que envías al backend para registro
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

// Respuesta genérica de la API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Respuesta de autenticación
export interface AuthResponse {
  user: User
  token: string
}
```

**¿Por qué `interface` vs `type`?**
- `interface`: Para objetos con estructura fija. Se puede extender (`extends`).
- `type`: Para uniones (`'A' | 'B'`), tipos simples, o combinaciones complejas.
- Regla práctica: usa `interface` para "cosas" (User, Vehicle) y `type` para "opciones" (UserRole, Status).

---

### Paso 0.7 — Modificar app.vue (componente raíz)

Reemplaza el contenido de `app/app.vue`:

```vue
<!-- app/app.vue -->
<!--
  Este es el componente RAÍZ de tu aplicación.
  Todo lo que se renderiza pasa por aquí.

  <NuxtLayout>  → Envuelve la página con un layout (header, footer, sidebar...)
  <NuxtPage />  → Renderiza la página actual según la URL

  Flujo: Usuario visita /servicios → Nuxt busca pages/servicios.vue → lo renderiza dentro de <NuxtPage>
-->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**¿Qué cambió?**
- Eliminamos `<NuxtWelcome />` (era la pantalla de bienvenida de Nuxt).
- Añadimos `<NuxtLayout>` + `<NuxtPage />`: esto activa el sistema de páginas y layouts.
- Ahora Nuxt buscará archivos en `pages/` para saber qué renderizar.

---

### Paso 0.8 — Crear el layout principal

Un layout es una plantilla que envuelve todas las páginas. Típicamente tiene el header y footer.

Crea `app/layouts/default.vue`:

```vue
<!-- app/layouts/default.vue -->
<!--
  Layout por defecto. Nuxt lo aplica automáticamente a todas las páginas
  a menos que la página especifique otro layout.

  Estructura:
  ┌──────────────────────────┐
  │        HEADER (nav)      │
  ├──────────────────────────┤
  │                          │
  │    CONTENIDO (página)    │  ← <slot /> renderiza la página actual
  │                          │
  ├──────────────────────────┤
  │        FOOTER            │
  └──────────────────────────┘
-->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- ─── HEADER / NAVEGACIÓN ─── -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <q-icon name="build" size="28px" color="primary" />
            <span class="text-xl font-bold text-gray-900">Mobauto</span>
          </NuxtLink>

          <!-- Menú de navegación (desktop) -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Inicio
            </NuxtLink>
            <NuxtLink
              to="/servicios"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Servicios
            </NuxtLink>
            <NuxtLink
              to="/blog"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Blog
            </NuxtLink>
            <NuxtLink
              to="/reservar"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Reservar Cita
            </NuxtLink>
            <q-btn
              to="/reservar"
              color="primary"
              label="Pedir Cita"
              unelevated
              rounded
              no-caps
            />
          </div>

          <!-- Botón menú móvil -->
          <q-btn
            flat
            round
            icon="menu"
            class="md:hidden"
            @click="menuOpen = true"
          />
        </div>
      </nav>
    </header>

    <!-- ─── MENÚ MÓVIL (drawer lateral) ─── -->
    <q-drawer
      v-model="menuOpen"
      side="right"
      overlay
      behavior="mobile"
    >
      <q-list padding>
        <q-item-label header class="text-lg font-bold">
          Mobauto
        </q-item-label>
        <q-separator />
        <q-item v-for="link in navLinks" :key="link.to" :to="link.to" clickable v-close-popup>
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- ─── CONTENIDO PRINCIPAL ─── -->
    <!-- <slot /> es donde se renderiza la página actual -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- ─── FOOTER ─── -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Columna 1: Info -->
          <div>
            <h3 class="text-white text-lg font-bold font-heading mb-4">Mobauto</h3>
            <p class="text-sm">
              Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid.
              Más de 10 años de experiencia. Diagnóstico preciso y presupuestos sin compromiso.
            </p>
          </div>
          <!-- Columna 2: Enlaces -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Enlaces</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/servicios" class="hover:text-white">Servicios</NuxtLink></li>
              <li><NuxtLink to="/reservar" class="hover:text-white">Reservar Cita</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-white">Blog</NuxtLink></li>
            </ul>
          </div>
          <!-- Columna 3: Contacto -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Contacto</h3>
            <ul class="space-y-2 text-sm">
              <li>Tel: 916 04 12 62</li>
              <li>Email: info@mobauto.es</li>
              <li>C. del Álamo, 44</li>
              <li>28970 Humanes de Madrid</li>
            </ul>
            <p class="text-xs mt-3 text-gray-400">
              Lunes a Viernes: 8:00–14:00 / 15:30–19:00
            </p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Mobauto — Taller en Humanes de Madrid. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// ─── Estado reactivo ───
// ref() crea una variable reactiva. Cuando cambia, Vue actualiza el DOM automáticamente.
const menuOpen = ref(false)

// Datos para el menú móvil
const navLinks = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/servicios', label: 'Servicios', icon: 'build' },
  { to: '/reservar', label: 'Reservar Cita', icon: 'event' },
  { to: '/blog', label: 'Blog', icon: 'article' },
]
</script>
```

**Conceptos clave aquí:**
- `<NuxtLink>`: Es como `<a>` pero optimizado. No recarga la página, navega instantáneamente.
- `<slot />`: "Hueco" donde se inyecta el contenido de la página actual.
- `ref()`: Crea una variable reactiva. Vue "observa" su valor y actualiza la pantalla cuando cambia.
- `<q-btn>`, `<q-drawer>`, `<q-list>`: Componentes de Quasar ya estilizados.
- Clases Tailwind: `flex`, `justify-between`, `items-center`, `h-16`, `gap-6`, etc.

---

### Paso 0.9 — Crear la primera página (index)

Crea `app/pages/index.vue`:

```vue
<!-- app/pages/index.vue -->
<!--
  Esta página se renderiza cuando visitas la URL raíz: /

  En Nuxt, el nombre del archivo = la ruta:
  - pages/index.vue         → /
  - pages/servicios.vue     → /servicios
  - pages/servicios/[slug].vue → /servicios/cambio-aceite (dinámico)
-->
<template>
  <div>
    <!-- ─── HERO SECTION ─── -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold font-heading mb-6">
          Chapa, pintura y mecánica en Humanes de Madrid
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Más de 10 años cuidando tu vehículo. Diagnóstico preciso,
          presupuesto sin compromiso y coche de sustitución.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn
            to="/reservar"
            color="white"
            text-color="primary"
            label="Reservar Cita"
            size="lg"
            unelevated
            rounded
            no-caps
            icon="event"
          />
          <q-btn
            to="/servicios"
            outline
            color="white"
            label="Ver Servicios"
            size="lg"
            rounded
            no-caps
            icon="build"
          />
        </div>
      </div>
    </section>

    <!-- ─── SERVICIOS DESTACADOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <q-card
            v-for="service in featuredServices"
            :key="service.title"
            class="hover:shadow-lg transition-shadow"
          >
            <q-card-section class="text-center">
              <q-icon :name="service.icon" size="48px" color="primary" />
              <h3 class="text-xl font-semibold mt-4 mb-2">{{ service.title }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn flat color="primary" label="Más info" no-caps :to="service.link" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ─── CTA FINAL ─── -->
    <section class="py-16 bg-blue-600 text-white text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold font-heading mb-4">¿Necesitas presupuesto?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Llámanos al 916 04 12 62 o reserva tu cita online. Sin compromiso.
        </p>
        <q-btn
          to="/reservar"
          color="white"
          text-color="primary"
          label="Reservar Cita Ahora"
          size="lg"
          unelevated
          rounded
          no-caps
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ─── SEO ───
// useSeoMeta() configura los meta tags de esta página específica.
// Esto es CRUCIAL para que Google muestre tu página correctamente en los resultados.
useSeoMeta({
  title: 'Mobauto — Taller de Chapa, Pintura y Mecánica en Humanes de Madrid',
  description: 'Taller especializado en chapa, pintura y mecánica en Humanes de Madrid. Presupuesto sin compromiso. Tel: 916 04 12 62.',
  ogTitle: 'Mobauto — Taller en Humanes de Madrid',
  ogDescription: 'Chapa, pintura y mecánica. Presupuesto sin compromiso.',
})

// ─── Datos ───
// Servicios destacados para la landing page
const featuredServices = [
  {
    title: 'Chapa y Pintura',
    description: 'Nuestra especialidad. Reparación de golpes, arañazos y pintado profesional con acabado de fábrica.',
    icon: 'format_paint',
    link: '/servicios/chapa-pintura',
  },
  {
    title: 'Cristales',
    description: 'Reparación de impactos y sustitución de lunas y parabrisas. Gestión con el seguro.',
    icon: 'window',
    link: '/servicios/cristales',
  },
  {
    title: 'Mecánica General',
    description: 'Diagnóstico y reparación de motor, frenos, suspensión, embrague y más.',
    icon: 'build',
    link: '/servicios/reparacion-general',
  },
]
</script>
```

---

### Paso 0.10 — Crear páginas placeholder

Para que la navegación funcione, creamos páginas básicas que iremos completando:

**`app/pages/servicios/index.vue`:**

```vue
<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8">Nuestros Servicios</h1>
    <p class="text-gray-600">Próximamente: catálogo completo de servicios.</p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Servicios - Mobauto',
  description: 'Descubre todos los servicios de mantenimiento y reparación que ofrecemos.',
})
</script>
```

**`app/pages/reservar/index.vue`:**

```vue
<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8">Reservar Cita</h1>
    <p class="text-gray-600">Próximamente: sistema de reserva de citas online.</p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Reservar Cita - Mobauto',
  description: 'Reserva tu cita online en nuestro taller mecánico.',
})
</script>
```

**`app/pages/blog/index.vue`:**

```vue
<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>
    <p class="text-gray-600">Próximamente: artículos sobre mantenimiento vehicular.</p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Blog - Mobauto',
  description: 'Consejos y guías sobre mantenimiento y cuidado de tu vehículo.',
})
</script>
```

---

### Paso 0.11 — Probar que todo funciona

```bash
# Ejecutar el proyecto en modo desarrollo
npm run dev
```

Abre `http://localhost:3000` en tu navegador. Deberías ver:
- Header con navegación y logo
- Hero section con botones
- Tarjetas de servicios
- Footer
- Navegación funcionando entre páginas

Si ves errores, revisa la consola del navegador (F12 → Console).

---

### Resumen Fase 0 — Lo que has aprendido

| Concepto | Qué es |
|----------|--------|
| `nuxt.config.ts` | Configuración central de Nuxt |
| Módulos | Paquetes que extienden Nuxt (Tailwind, Pinia, Quasar) |
| `pages/` | Archivos = rutas automáticas |
| `layouts/` | Plantillas que envuelven páginas |
| `<NuxtLink>` | Navegación sin recargar página |
| `ref()` | Variable reactiva de Vue |
| `useSeoMeta()` | Meta tags para SEO por página |
| TypeScript interfaces | Contratos que definen la forma de los datos |
| Tailwind CSS | Estilos con clases de utilidad |
| Quasar | Componentes UI listos para usar |

---

---
---

## FASE 1: Autenticación y Usuarios

> En esta fase construimos el sistema de login/registro usando las **server routes** de Nuxt
> (carpeta `server/`). Esto simplifica el proyecto: no necesitas un servidor Fastify separado al principio.
> Más adelante, si crece mucho, puedes migrar a Fastify.

### Paso 1.1 — Instalar dependencias de autenticación

```bash
# bcrypt: para hashear contraseñas (nunca guardes contraseñas en texto plano)
npm install bcrypt
npm install -D @types/bcrypt

# jsonwebtoken: para crear tokens JWT (la "tarjeta de acceso" del usuario)
npm install jsonwebtoken
npm install -D @types/jsonwebtoken

# h3: ya viene con Nuxt, pero nos aseguramos de tener los tipos
npm install -D @types/node
```

**¿Qué es JWT (JSON Web Token)?**
Es como un "carnet digital". Cuando un usuario hace login:
1. El servidor verifica email + contraseña
2. Si son correctos, crea un JWT (string codificado) con los datos del usuario
3. Se lo envía al frontend
4. El frontend lo guarda y lo envía en cada petición posterior
5. El servidor verifica el JWT y sabe quién es el usuario

Un JWT se ve así: `eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123`
Son 3 partes separadas por puntos: Header.Payload.Signature

---

### Paso 1.2 — Configurar la "base de datos" temporal

Para esta fase, usaremos un almacén en memoria (un array). En la Fase 3 migraremos a PostgreSQL + Prisma.

Crea `server/utils/db.ts`:

```typescript
// server/utils/db.ts
// ─── "Base de datos" temporal en memoria ───
// IMPORTANTE: Esto se borra cada vez que reinicias el servidor.
// Es solo para aprender. Luego lo reemplazaremos con Prisma + PostgreSQL.

export interface DbUser {
  id: string
  email: string
  passwordHash: string
  role: 'CUSTOMER' | 'MECHANIC' | 'ADMIN'
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
}

// Este array actúa como nuestra "tabla de usuarios"
const users: DbUser[] = []

// ─── Funciones para interactuar con la "base de datos" ───

// Buscar usuario por email
export function findUserByEmail(email: string): DbUser | undefined {
  return users.find(u => u.email === email)
}

// Buscar usuario por ID
export function findUserById(id: string): DbUser | undefined {
  return users.find(u => u.id === id)
}

// Crear nuevo usuario
export function createUser(data: Omit<DbUser, 'id' | 'createdAt'>): DbUser {
  const newUser: DbUser = {
    ...data,
    id: crypto.randomUUID(), // Genera un ID único
    createdAt: new Date(),
  }
  users.push(newUser)
  return newUser
}

// Obtener todos los usuarios (para el admin)
export function getAllUsers(): DbUser[] {
  return users
}
```

**Conceptos:**
- `Omit<DbUser, 'id' | 'createdAt'>`: TypeScript utility type. Significa "un DbUser PERO sin id ni createdAt". Útil porque esos campos los genera el servidor, no el cliente.
- `crypto.randomUUID()`: Genera un ID único como `"550e8400-e29b-41d4-a716-446655440000"`.

---

### Paso 1.3 — Utilidades de autenticación

Crea `server/utils/auth.ts`:

```typescript
// server/utils/auth.ts
// ─── Funciones de ayuda para autenticación ───

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

// Secret para firmar los JWT. En producción DEBE estar en variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'mobauto-dev-secret-cambiar-en-produccion'
const JWT_EXPIRES_IN = '7d' // El token expira en 7 días

// ─── Hashear contraseña ───
// bcrypt añade "sal" (datos aleatorios) y hashea la contraseña.
// Así, incluso si dos usuarios tienen la misma contraseña, los hashes son diferentes.
// El número 12 es el "cost factor": más alto = más seguro pero más lento.
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// ─── Comparar contraseña con hash ───
// Verifica si la contraseña ingresada coincide con el hash guardado.
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── Crear JWT ───
// Recibe un payload (datos del usuario) y devuelve un token firmado.
export function createToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// ─── Verificar JWT ───
// Recibe un token y devuelve los datos si es válido, o null si expiró/es inválido.
export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

// ─── Obtener usuario de la petición ───
// Lee el header "Authorization: Bearer <token>" y extrae los datos del usuario.
export function getUserFromEvent(event: H3Event): { userId: string; role: string } | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7) // Quita "Bearer " del inicio
  return verifyToken(token)
}
```

**¿Cómo funciona el flujo?**
```
1. Usuario envía: POST /api/auth/register { email, password, ... }
2. Servidor: hashPassword("mi-clave-123") → "$2b$12$xK8f..." (hash)
3. Servidor: guarda email + hash en la base de datos
4. Servidor: createToken({ userId: "abc", role: "CUSTOMER" }) → "eyJ..."
5. Servidor: devuelve { token: "eyJ..." }
6. Frontend: guarda el token
7. Frontend en cada petición: Authorization: Bearer eyJ...
8. Servidor: verifyToken("eyJ...") → { userId: "abc", role: "CUSTOMER" }
```

---

### Paso 1.4 — Crear la API de Registro

Crea `server/api/auth/register.post.ts`:

```typescript
// server/api/auth/register.post.ts
// ─── Endpoint: POST /api/auth/register ───
//
// En Nuxt, el nombre del archivo define la ruta y el método HTTP:
// - server/api/auth/register.post.ts → POST /api/auth/register
// - server/api/users/index.get.ts   → GET /api/users
// - server/api/users/[id].get.ts    → GET /api/users/:id (dinámico)

export default defineEventHandler(async (event) => {
  // 1. Leer el body de la petición (los datos que envía el frontend)
  const body = await readBody(event)

  // 2. Validar que los campos necesarios existan
  //    (En Fase 3 usaremos Zod para validaciones más robustas)
  const { email, password, firstName, lastName, phone } = body

  if (!email || !password || !firstName || !lastName) {
    // throw createError() envía un error HTTP al frontend
    throw createError({
      statusCode: 400, // 400 = Bad Request (datos incorrectos)
      statusMessage: 'Faltan campos obligatorios: email, password, firstName, lastName',
    })
  }

  // Validar formato de email (básico)
  if (!email.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El email no tiene un formato válido',
    })
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 6 caracteres',
    })
  }

  // 3. Verificar que el email no esté ya registrado
  const existingUser = findUserByEmail(email)
  if (existingUser) {
    throw createError({
      statusCode: 409, // 409 = Conflict (ya existe)
      statusMessage: 'Ya existe un usuario con ese email',
    })
  }

  // 4. Hashear la contraseña (NUNCA guardar la contraseña en texto plano)
  const passwordHash = await hashPassword(password)

  // 5. Crear el usuario
  const user = createUser({
    email,
    passwordHash,
    role: 'CUSTOMER', // Por defecto, todos son clientes
    firstName,
    lastName,
    phone,
  })

  // 6. Crear el token JWT
  const token = createToken({ userId: user.id, role: user.role })

  // 7. Devolver la respuesta
  //    setResponseStatus establece el código HTTP (201 = Created)
  setResponseStatus(event, 201)
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  }
})
```

**Códigos HTTP importantes:**
| Código | Significado | Cuándo usarlo |
|--------|------------|---------------|
| 200 | OK | Todo bien (GET exitoso) |
| 201 | Created | Se creó un recurso (POST exitoso) |
| 400 | Bad Request | Los datos enviados son inválidos |
| 401 | Unauthorized | No tiene token o es inválido |
| 403 | Forbidden | Tiene token pero no tiene permiso |
| 404 | Not Found | El recurso no existe |
| 409 | Conflict | Ya existe (ej: email duplicado) |
| 500 | Server Error | Error interno del servidor |

---

### Paso 1.5 — Crear la API de Login

Crea `server/api/auth/login.post.ts`:

```typescript
// server/api/auth/login.post.ts
// ─── Endpoint: POST /api/auth/login ───

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // 1. Validar campos
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email y contraseña son obligatorios',
    })
  }

  // 2. Buscar usuario por email
  const user = findUserByEmail(email)
  if (!user) {
    // IMPORTANTE: no decimos "usuario no encontrado" por seguridad.
    // Si decimos eso, un atacante sabría qué emails están registrados.
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos',
    })
  }

  // 3. Comparar la contraseña
  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos', // Mismo mensaje a propósito
    })
  }

  // 4. Crear token JWT
  const token = createToken({ userId: user.id, role: user.role })

  // 5. Devolver usuario + token
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  }
})
```

---

### Paso 1.6 — Crear la API "Quién soy" (me)

Crea `server/api/auth/me.get.ts`:

```typescript
// server/api/auth/me.get.ts
// ─── Endpoint: GET /api/auth/me ───
// Devuelve los datos del usuario logueado.
// El frontend llama a esto al cargar la app para verificar si el token sigue válido.

export default defineEventHandler((event) => {
  // 1. Extraer datos del token JWT
  const authData = getUserFromEvent(event)

  if (!authData) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado. Envía el token en el header Authorization.',
    })
  }

  // 2. Buscar usuario en la "base de datos"
  const user = findUserById(authData.userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado',
    })
  }

  // 3. Devolver datos del usuario (SIN el hash de la contraseña)
  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
  }
})
```

---

### Paso 1.7 — Crear el Store de autenticación (Pinia)

El store centraliza el estado del usuario. Cualquier componente puede leer si hay un usuario logueado.

Crea `app/stores/auth.ts`:

```typescript
// app/stores/auth.ts
// ─── Store de Autenticación con Pinia ───
//
// ¿Qué es un Store?
// Es un "almacén" de datos accesible desde cualquier componente.
// En vez de pasar datos de padre a hijo con props (prop drilling),
// cualquier componente puede leer/modificar el store directamente.
//
// Pinia tiene 3 conceptos:
// - state:   los datos (como ref() pero compartidos)
// - getters: datos computados (como computed() pero compartidos)
// - actions: funciones que modifican el state

import { defineStore } from 'pinia'
import type { User } from '~/types'

// defineStore('nombre-unico', { ... })
export const useAuthStore = defineStore('auth', {
  // ─── STATE (datos) ───
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  // ─── GETTERS (datos computados) ───
  getters: {
    // ¿Hay usuario logueado?
    isAuthenticated(): boolean {
      return !!this.token && !!this.user
    },
    // ¿Es administrador?
    isAdmin(): boolean {
      return this.user?.role === 'ADMIN'
    },
    // Nombre completo
    fullName(): string {
      if (!this.user?.profile) return this.user?.email || ''
      return `${this.user.profile.firstName} ${this.user.profile.lastName}`
    },
  },

  // ─── ACTIONS (funciones) ───
  actions: {
    // ─── Registro ───
    async register(data: {
      email: string
      password: string
      firstName: string
      lastName: string
      phone?: string
    }) {
      this.loading = true
      try {
        // $fetch es la función de Nuxt para hacer peticiones HTTP.
        // Es como fetch() pero con mejor manejo de errores y tipos.
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: data,
        })

        // Guardar token y usuario
        this.token = response.data.token
        this.user = response.data.user as User

        // Guardar token en localStorage para que persista al recargar
        if (import.meta.client) {
          localStorage.setItem('auth_token', response.data.token)
        }

        return response
      } catch (error: any) {
        // Re-lanzar el error para que el componente lo maneje
        throw error
      } finally {
        // finally se ejecuta SIEMPRE, haya error o no
        this.loading = false
      }
    },

    // ─── Login ───
    async login(email: string, password: string) {
      this.loading = true
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        })

        this.token = response.data.token
        this.user = response.data.user as User

        if (import.meta.client) {
          localStorage.setItem('auth_token', response.data.token)
        }

        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // ─── Verificar sesión (al cargar la app) ───
    async fetchUser() {
      // Si no hay token guardado, no hay sesión
      if (import.meta.client) {
        this.token = localStorage.getItem('auth_token')
      }
      if (!this.token) return

      try {
        const response = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.user = response.data as User
      } catch {
        // Token inválido o expirado → limpiar sesión
        this.logout()
      }
    },

    // ─── Logout ───
    logout() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
      }
      // Redirigir al inicio
      navigateTo('/')
    },
  },
})
```

**¿Qué es `import.meta.client`?**
Nuxt ejecuta código tanto en el servidor (SSR) como en el navegador. `localStorage` solo existe en el navegador. `import.meta.client` es un "guard" que dice "ejecuta esto SOLO en el navegador".

---

### Paso 1.8 — Crear el composable useAuth

Los composables son funciones reutilizables. Es el patrón recomendado en Vue 3 para compartir lógica.

Crea `app/composables/useAuth.ts`:

```typescript
// app/composables/useAuth.ts
// ─── Composable de Autenticación ───
//
// ¿Qué es un composable?
// Es una función que encapsula lógica reactiva reutilizable.
// Nuxt auto-importa todo lo que esté en composables/ con prefijo "use".
//
// Uso en cualquier componente:
//   const { user, isAuthenticated, login, logout } = useAuth()

import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  // Función de login que además redirige
  async function login(email: string, password: string) {
    await store.login(email, password)
    // Redirigir al dashboard del cliente tras login exitoso
    await router.push('/mi-cuenta')
  }

  // Función de registro que además redirige
  async function register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    await store.register(data)
    await router.push('/mi-cuenta')
  }

  // Logout
  function logout() {
    store.logout()
  }

  // Exponer datos y funciones
  // toRefs() convierte las propiedades del store en refs individuales
  // para que mantengan la reactividad al desestructurar
  return {
    user: computed(() => store.user),
    token: computed(() => store.token),
    loading: computed(() => store.loading),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    fullName: computed(() => store.fullName),
    login,
    register,
    logout,
    fetchUser: store.fetchUser,
  }
}
```

---

### Paso 1.9 — Crear la página de Login

Crea `app/pages/login.vue`:

```vue
<!-- app/pages/login.vue → URL: /login -->
<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="lock" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Iniciar Sesión</h1>
        <p class="text-gray-500 mt-2">Accede a tu cuenta de Mobauto</p>
      </q-card-section>

      <q-card-section>
        <!-- ─── FORMULARIO ─── -->
        <!--
          @submit.prevent="onSubmit"
          - @submit: escucha el evento "submit" del formulario
          - .prevent: ejecuta preventDefault() (evita que la página se recargue)
          - ="onSubmit": llama a nuestra función
        -->
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Campo Email -->
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (val: string) => !!val || 'El email es obligatorio',
              (val: string) => val.includes('@') || 'Email no válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- Campo Contraseña -->
          <q-input
            v-model="form.password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'La contraseña es obligatoria',
              (val: string) => val.length >= 6 || 'Mínimo 6 caracteres',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <!-- Botón para mostrar/ocultar contraseña -->
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Mensaje de error -->
          <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </q-banner>

          <!-- Botón Submit -->
          <q-btn
            type="submit"
            color="primary"
            label="Iniciar Sesión"
            class="w-full"
            size="lg"
            :loading="loading"
            unelevated
            no-caps
          />
        </form>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <p class="text-gray-500">
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="text-blue-600 font-medium hover:underline">
            Regístrate aquí
          </NuxtLink>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// ─── SEO ───
useSeoMeta({
  title: 'Iniciar Sesión - Mobauto',
  description: 'Accede a tu cuenta de Mobauto para gestionar tus citas y vehículos.',
})

// ─── Estado del formulario ───
const { login, loading: authLoading } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const error = ref('')
const loading = computed(() => authLoading.value)

// ─── Manejar submit ───
async function onSubmit() {
  error.value = '' // Limpiar error previo
  try {
    await login(form.email, form.password)
    // Si llega aquí, login exitoso → el composable redirige a /mi-cuenta
  } catch (err: any) {
    // Mostrar error al usuario
    error.value = err?.data?.message || err?.statusMessage || 'Error al iniciar sesión'
  }
}
</script>
```

**Conceptos clave:**
- `v-model`: Vinculación bidireccional. Cuando el usuario escribe, `form.email` se actualiza. Y viceversa.
- `reactive()`: Como `ref()` pero para objetos. No necesitas `.value`.
- `:rules`: Validaciones de Quasar. Cada regla es una función que devuelve `true` (válido) o un string (mensaje de error).
- `@submit.prevent`: Escucha el submit y previene la recarga de página.
- `:loading`: Propiedad de Quasar que muestra un spinner en el botón mientras se procesa.

---

### Paso 1.10 — Crear la página de Registro

Crea `app/pages/register.vue`:

```vue
<!-- app/pages/register.vue → URL: /register -->
<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="person_add" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Crear Cuenta</h1>
        <p class="text-gray-500 mt-2">Regístrate para reservar citas online</p>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Nombre y Apellidos en fila -->
          <div class="grid grid-cols-2 gap-4">
            <q-input
              v-model="form.firstName"
              label="Nombre"
              outlined
              :rules="[(val: string) => !!val || 'Obligatorio']"
            />
            <q-input
              v-model="form.lastName"
              label="Apellidos"
              outlined
              :rules="[(val: string) => !!val || 'Obligatorio']"
            />
          </div>

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (val: string) => !!val || 'Obligatorio',
              (val: string) => val.includes('@') || 'Email no válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.phone"
            label="Teléfono (opcional)"
            type="tel"
            outlined
          >
            <template #prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'Obligatoria',
              (val: string) => val.length >= 6 || 'Mínimo 6 caracteres',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="form.confirmPassword"
            label="Confirmar Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'Confirma tu contraseña',
              (val: string) => val === form.password || 'Las contraseñas no coinciden',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            label="Crear Cuenta"
            class="w-full"
            size="lg"
            :loading="loading"
            unelevated
            no-caps
          />
        </form>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <p class="text-gray-500">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </NuxtLink>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Crear Cuenta - Mobauto',
  description: 'Regístrate en Mobauto para gestionar tus citas y vehículos.',
})

const { register, loading: authLoading } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const error = ref('')
const loading = computed(() => authLoading.value)

async function onSubmit() {
  // Validación manual extra
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  error.value = ''
  try {
    await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || undefined,
    })
  } catch (err: any) {
    error.value = err?.data?.message || err?.statusMessage || 'Error al crear la cuenta'
  }
}
</script>
```

---

### Paso 1.11 — Middleware de protección de rutas

El middleware se ejecuta ANTES de que la página cargue. Si el usuario no está logueado, lo redirigimos al login.

Crea `app/middleware/auth.ts`:

```typescript
// app/middleware/auth.ts
// ─── Middleware de Autenticación ───
//
// ¿Cómo se usa? En la página que quieras proteger:
//
//   <script setup>
//   definePageMeta({ middleware: 'auth' })
//   </script>
//
// Nuxt ejecutará este middleware ANTES de renderizar la página.
// Si el usuario no está logueado, lo redirige a /login.

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    // Guardar la URL a la que quería ir, para redirigirlo después del login
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
```

Crea `app/middleware/admin.ts`:

```typescript
// app/middleware/admin.ts
// ─── Middleware de Admin ───
// Protege rutas que solo pueden ver administradores.

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    // Si está logueado pero NO es admin, lo mandamos al inicio
    return navigateTo('/')
  }
})
```

---

### Paso 1.12 — Página "Mi Cuenta" (protegida)

Crea `app/pages/mi-cuenta/index.vue`:

```vue
<!-- app/pages/mi-cuenta/index.vue → URL: /mi-cuenta -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Mi Cuenta</h1>
        <p class="text-gray-500 mt-1">Bienvenido, {{ user?.email }}</p>
      </div>
      <q-btn
        color="negative"
        outline
        label="Cerrar Sesión"
        icon="logout"
        no-caps
        @click="logout"
      />
    </div>

    <!-- Dashboard rápido -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <q-card>
        <q-card-section class="text-center">
          <q-icon name="event" size="40px" color="primary" />
          <h3 class="text-lg font-semibold mt-2">Mis Citas</h3>
          <p class="text-gray-500 text-sm">Gestiona tus citas</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat color="primary" label="Ver citas" no-caps to="/mi-cuenta/citas" />
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-section class="text-center">
          <q-icon name="directions_car" size="40px" color="primary" />
          <h3 class="text-lg font-semibold mt-2">Mis Vehículos</h3>
          <p class="text-gray-500 text-sm">Gestiona tus vehículos</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat color="primary" label="Ver vehículos" no-caps to="/mi-cuenta/vehiculos" />
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-section class="text-center">
          <q-icon name="person" size="40px" color="primary" />
          <h3 class="text-lg font-semibold mt-2">Mi Perfil</h3>
          <p class="text-gray-500 text-sm">Edita tus datos</p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat color="primary" label="Editar perfil" no-caps to="/mi-cuenta/perfil" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// ─── Proteger esta página ───
// definePageMeta() le dice a Nuxt "ejecuta el middleware 'auth' antes de mostrar esta página"
definePageMeta({
  middleware: 'auth',
})

useSeoMeta({ title: 'Mi Cuenta - Mobauto' })

const { user, logout } = useAuth()
</script>
```

---

### Paso 1.13 — Plugin para restaurar sesión

Cuando el usuario recarga la página, perdemos el estado de Pinia. Este plugin verifica si hay un token guardado y restaura la sesión.

Crea `app/plugins/auth.ts`:

```typescript
// app/plugins/auth.ts
// ─── Plugin de Autenticación ───
//
// Los plugins se ejecutan UNA VEZ al arrancar la app.
// Este verifica si hay un token guardado en localStorage
// y restaura la sesión automáticamente.

export default defineNuxtPlugin(async () => {
  // Solo ejecutar en el navegador (localStorage no existe en el servidor)
  if (import.meta.server) return

  const { fetchUser } = useAuth()

  // Intentar restaurar la sesión
  await fetchUser()
})
```

---

### Paso 1.14 — Actualizar el header con estado de auth

Ahora actualicemos el layout para mostrar botones diferentes si el usuario está logueado.

En `app/layouts/default.vue`, actualiza la sección del menú desktop (dentro del `<nav>`):

Busca la sección `<!-- Menú de navegación (desktop) -->` y reemplázala por:

```vue
          <!-- Menú de navegación (desktop) -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors">
              Inicio
            </NuxtLink>
            <NuxtLink to="/servicios" class="text-gray-600 hover:text-blue-600 transition-colors">
              Servicios
            </NuxtLink>
            <NuxtLink to="/blog" class="text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </NuxtLink>

            <!-- Si NO está logueado: mostrar botón de cita + login -->
            <template v-if="!isAuthenticated">
              <NuxtLink to="/login" class="text-gray-600 hover:text-blue-600 transition-colors">
                Iniciar Sesión
              </NuxtLink>
              <q-btn to="/reservar" color="primary" label="Pedir Cita" unelevated rounded no-caps />
            </template>

            <!-- Si SÍ está logueado: mostrar menú de usuario -->
            <template v-else>
              <NuxtLink to="/mi-cuenta" class="text-gray-600 hover:text-blue-600 transition-colors">
                Mi Cuenta
              </NuxtLink>
              <q-btn
                round
                flat
                icon="person"
                color="primary"
              >
                <q-menu>
                  <q-list style="min-width: 200px">
                    <q-item-label header>{{ user?.email }}</q-item-label>
                    <q-separator />
                    <q-item clickable to="/mi-cuenta" v-close-popup>
                      <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
                      <q-item-section>Mi Cuenta</q-item-section>
                    </q-item>
                    <q-item clickable to="/reservar" v-close-popup>
                      <q-item-section avatar><q-icon name="event" /></q-item-section>
                      <q-item-section>Reservar Cita</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable @click="logout" v-close-popup>
                      <q-item-section avatar><q-icon name="logout" color="red" /></q-item-section>
                      <q-item-section class="text-red-600">Cerrar Sesión</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
          </div>
```

Y en el `<script setup>` del layout, añade:

```typescript
const { isAuthenticated, user, logout } = useAuth()
```

---

### Paso 1.15 — Probar la autenticación

```bash
npm run dev
```

Prueba este flujo:
1. Ve a `http://localhost:3000/register` → Crea una cuenta
2. Deberías ser redirigido a `/mi-cuenta`
3. Recarga la página → Deberías seguir logueado (el plugin restaura la sesión)
4. Haz click en "Cerrar Sesión" → Vuelves al inicio
5. Ve a `http://localhost:3000/login` → Inicia sesión con los datos del registro
6. Intenta acceder a `/mi-cuenta` sin estar logueado → Te redirige a `/login`

**Para probar la API directamente** (con curl o desde la consola del navegador):
```javascript
// Registro
await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: '123456',
    firstName: 'Juan',
    lastName: 'García'
  })
}).then(r => r.json())

// Login
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: '123456'
  })
}).then(r => r.json())
```

---

### Resumen Fase 1 — Lo que has aprendido

| Concepto | Qué es |
|----------|--------|
| Server Routes | Archivos en `server/api/` = endpoints HTTP automáticos |
| JWT | Token firmado que identifica al usuario |
| bcrypt | Algoritmo para hashear contraseñas de forma segura |
| Pinia Store | Almacén global de estado reactivo |
| Composable | Función reutilizable con lógica reactiva (patrón `use...()`) |
| Middleware | Código que se ejecuta antes de cargar una página |
| Plugin | Código que se ejecuta una vez al arrancar la app |
| `$fetch` | Función de Nuxt para hacer peticiones HTTP |
| `reactive()` | Como `ref()` pero para objetos |
| `computed()` | Valor derivado que se recalcula automáticamente |
| `v-model` | Vinculación bidireccional entre input y variable |
| `definePageMeta()` | Configurar middleware, layout, etc. por página |

---

---
---

## FASE 2: Landing Page Completa y SEO

> En esta fase completamos la landing page con todas las secciones,
> creamos las páginas de servicios dinámicas y configuramos SEO profesional.

### Paso 2.1 — Crear componentes reutilizables

Los componentes son piezas de UI que puedes usar en múltiples páginas. Nuxt los auto-importa desde `components/`.

**`app/components/common/SectionTitle.vue`:**

```vue
<!-- Componente reutilizable para títulos de sección -->
<!--
  Props = datos que el componente padre le pasa al hijo.
  Es como los parámetros de una función.

  Uso: <SectionTitle title="Servicios" subtitle="Lo que ofrecemos" />
-->
<template>
  <div class="text-center mb-12">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900">{{ title }}</h2>
    <p v-if="subtitle" class="text-lg text-gray-500 mt-3 max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
// defineProps() define qué datos acepta este componente.
// Es como declarar los parámetros de una función.
defineProps<{
  title: string
  subtitle?: string // ? = opcional
}>()
</script>
```

**`app/components/common/TestimonialCard.vue`:**

```vue
<template>
  <q-card class="h-full">
    <q-card-section>
      <!-- Estrellas -->
      <div class="flex gap-1 mb-3">
        <q-icon
          v-for="i in 5"
          :key="i"
          name="star"
          :color="i <= rating ? 'yellow-8' : 'grey-4'"
          size="20px"
        />
      </div>
      <!-- Texto del testimonio -->
      <p class="text-gray-600 italic mb-4">"{{ text }}"</p>
      <!-- Autor -->
      <div class="flex items-center gap-3">
        <q-avatar color="primary" text-color="white" size="40px">
          {{ initials }}
        </q-avatar>
        <div>
          <p class="font-semibold text-gray-900">{{ name }}</p>
          <p class="text-sm text-gray-500">{{ vehicle }}</p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  text: string
  rating: number
  vehicle: string
}>()

// Computed: valor que se recalcula automáticamente cuando cambian sus dependencias.
// Aquí extrae las iniciales del nombre: "Juan García" → "JG"
const initials = computed(() => {
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>
```

**`app/components/common/ContactForm.vue`:**

```vue
<template>
  <q-card class="max-w-lg mx-auto">
    <q-card-section>
      <h3 class="text-xl font-bold mb-4">Contáctanos</h3>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <q-input v-model="form.name" label="Nombre completo" outlined
          :rules="[(v: string) => !!v || 'Obligatorio']" />
        <q-input v-model="form.email" label="Email" type="email" outlined
          :rules="[(v: string) => !!v || 'Obligatorio']" />
        <q-input v-model="form.phone" label="Teléfono (opcional)" outlined />
        <q-input v-model="form.message" label="Mensaje" type="textarea" outlined
          :rules="[(v: string) => !!v || 'Escribe tu mensaje']" />

        <q-banner v-if="success" class="bg-green-50 text-green-700 rounded-lg">
          Mensaje enviado correctamente. Te contactaremos pronto.
        </q-banner>

        <q-btn type="submit" color="primary" label="Enviar Mensaje"
          class="w-full" unelevated no-caps :loading="loading" />
      </form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const form = reactive({ name: '', email: '', phone: '', message: '' })
const loading = ref(false)
const success = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    })
    success.value = true
    // Limpiar formulario
    Object.assign(form, { name: '', email: '', phone: '', message: '' })
  } catch (err) {
    console.error('Error al enviar:', err)
  } finally {
    loading.value = false
  }
}
</script>
```

---

### Paso 2.2 — API del formulario de contacto

Crea `server/api/contact.post.ts`:

```typescript
// server/api/contact.post.ts
// ─── Endpoint: POST /api/contact ───
// Recibe mensajes del formulario de contacto.
// Por ahora solo los logueamos. Luego integraremos email con Resend.

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message } = body

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nombre, email y mensaje son obligatorios',
    })
  }

  // TODO: Integrar con Resend para enviar email al taller
  // Por ahora, solo lo logueamos en la consola del servidor
  console.log('📩 Nuevo mensaje de contacto:', { name, email, message })

  return { success: true, message: 'Mensaje recibido correctamente' }
})
```

---

### Paso 2.3 — Datos de servicios (mock)

Crea `app/utils/services-data.ts`:

```typescript
// app/utils/services-data.ts
// ─── Datos estáticos de servicios ───
// Luego vendrán de la base de datos. Por ahora los definimos aquí.
// Nuxt auto-importa todo lo de utils/, así que podrás usar
// getServices() y getServiceBySlug() directamente en cualquier componente.

export interface ServiceInfo {
  slug: string          // URL amigable: "cambio-aceite"
  name: string          // "Cambio de Aceite"
  shortDescription: string
  fullDescription: string
  icon: string          // Icono de Material Icons
  category: string
  estimatedDuration: string
  priceRange: string
  features: string[]    // Lista de qué incluye
  faqs: { question: string; answer: string }[]
}

// Servicios reales de Mobauto en Humanes de Madrid
// Especialidad: Chapa y Pintura + Reparación general + Cristales
const services: ServiceInfo[] = [
  {
    slug: 'chapa-pintura',
    name: 'Chapa y Pintura',
    shortDescription: 'Reparación de carrocería, abolladuras, arañazos y pintado profesional.',
    fullDescription: 'Nuestro servicio estrella. En Mobauto somos especialistas en chapa y pintura con más de 10 años de experiencia. Reparamos desde pequeños arañazos hasta daños graves por colisión, con acabados de fábrica y materiales de primera calidad.',
    icon: 'format_paint',
    category: 'BODYWORK',
    estimatedDuration: '1-5 días',
    priceRange: 'Presupuesto sin compromiso',
    features: [
      'Reparación de abolladuras y golpes',
      'Pintado parcial o completo del vehículo',
      'Igualación de color con tecnología computerizada',
      'Reparación de arañazos profundos y superficiales',
      'Tratamiento anticorrosión',
      'Coche de sustitución disponible',
      'Acabado de fábrica garantizado',
    ],
    faqs: [
      {
        question: '¿Ofrecen coche de sustitución?',
        answer: 'Sí, disponemos de coches de sustitución gratuitos mientras tu vehículo está en el taller.',
      },
      {
        question: '¿Cuánto tarda una reparación de chapa?',
        answer: 'Depende del daño. Un arañazo puede estar listo en 1 día, una reparación por colisión puede llevar 3-5 días. Te damos plazo exacto con el presupuesto.',
      },
      {
        question: '¿Trabajan con aseguradoras?',
        answer: 'Sí, gestionamos el trámite completo con tu compañía de seguros para que no tengas que preocuparte de nada.',
      },
    ],
  },
  {
    slug: 'cristales',
    name: 'Cristales para Automóviles',
    shortDescription: 'Reparación y sustitución de lunas, parabrisas y cristales laterales.',
    fullDescription: 'Servicio integral de cristales para tu vehículo. Reparamos impactos en el parabrisas y sustituimos lunas rotas con cristales homologados. También trabajamos con lunas térmicas y laminadas.',
    icon: 'window',
    category: 'REPAIR',
    estimatedDuration: '1-3 horas',
    priceRange: 'Presupuesto sin compromiso',
    features: [
      'Reparación de impactos en parabrisas',
      'Sustitución de lunas delanteras y traseras',
      'Cristales laterales y de techo',
      'Lunas térmicas y laminadas',
      'Cristales homologados',
      'Gestión con el seguro incluida',
    ],
    faqs: [
      {
        question: '¿Se puede reparar un impacto sin cambiar el parabrisas?',
        answer: 'Sí, si el impacto es pequeño (menor que una moneda de 2€) y no está en la zona de visión del conductor, generalmente se puede reparar sin sustituir el parabrisas completo.',
      },
      {
        question: '¿Cubren las aseguradoras el cambio de lunas?',
        answer: 'Sí, la mayoría de pólizas a todo riesgo y muchas a terceros ampliado cubren la rotura de lunas. Nosotros gestionamos el trámite.',
      },
    ],
  },
  {
    slug: 'reparacion-general',
    name: 'Reparación de Automóviles',
    shortDescription: 'Mecánica general: motor, frenos, suspensión, embrague y más.',
    fullDescription: 'Taller de reparación integral. Diagnosticamos y reparamos averías mecánicas de todo tipo: motor, sistema de frenado, suspensión, dirección, embrague, distribución y más. Diagnóstico preciso antes de cualquier intervención.',
    icon: 'build',
    category: 'REPAIR',
    estimatedDuration: 'Según diagnóstico',
    priceRange: 'Presupuesto sin compromiso',
    features: [
      'Diagnóstico electrónico avanzado',
      'Reparación de motor',
      'Cambio de embrague y distribución',
      'Sistemas de frenado',
      'Suspensión y amortiguadores',
      'Sistema de escape',
      'Presupuesto detallado sin compromiso',
    ],
    faqs: [
      {
        question: '¿Hacen diagnóstico antes de reparar?',
        answer: 'Siempre. Antes de cualquier intervención, nuestros especialistas realizan un diagnóstico preciso y te proporcionan una explicación detallada del trabajo y un presupuesto ajustado.',
      },
      {
        question: '¿Reparan todas las marcas?',
        answer: 'Sí, trabajamos con todas las marcas y modelos de vehículos.',
      },
    ],
  },
  {
    slug: 'mantenimiento',
    name: 'Mantenimiento Preventivo',
    shortDescription: 'Cambio de aceite, filtros, revisiones y mantenimiento periódico.',
    fullDescription: 'El mantenimiento preventivo es clave para alargar la vida de tu vehículo y evitar averías costosas. Realizamos todos los servicios de mantenimiento según las recomendaciones del fabricante.',
    icon: 'oil_barrel',
    category: 'MAINTENANCE',
    estimatedDuration: '30 min - 2 horas',
    priceRange: 'Desde 49€',
    features: [
      'Cambio de aceite y filtros',
      'Revisión de niveles',
      'Cambio de líquido de frenos',
      'Cambio de correa de distribución',
      'Cambio de pastillas de freno',
      'Revisión pre-ITV',
    ],
    faqs: [
      {
        question: '¿Cada cuánto debo hacer el mantenimiento?',
        answer: 'Generalmente cada 15.000-20.000 km o una vez al año. Consulta el manual de tu vehículo o pregúntanos y te asesoramos según tu modelo.',
      },
    ],
  },
  {
    slug: 'pre-itv',
    name: 'Pre-ITV',
    shortDescription: 'Revisión completa previa a la ITV para asegurar que tu vehículo la pasa.',
    fullDescription: 'Revisamos todos los puntos que se evalúan en la ITV: emisiones, frenos, luces, suspensión, dirección, etc. Si encontramos problemas, los solucionamos antes de tu cita en la ITV.',
    icon: 'verified',
    category: 'INSPECTION',
    estimatedDuration: '1-2 horas',
    priceRange: 'Desde 39€',
    features: [
      'Revisión de emisiones',
      'Comprobación de luces y señalización',
      'Estado de frenos',
      'Suspensión y dirección',
      'Neumáticos y limpiaparabrisas',
      'Ajustes menores incluidos',
    ],
    faqs: [
      {
        question: '¿Garantizan que pase la ITV?',
        answer: 'Si realizamos la pre-ITV y las reparaciones recomendadas, la probabilidad de pasar es superior al 95%.',
      },
    ],
  },
  {
    slug: 'peritaje-siniestros',
    name: 'Peritaje y Siniestros',
    shortDescription: 'Gestión completa de siniestros con aseguradoras y peritaje.',
    fullDescription: 'Nos encargamos de todo el proceso de gestión con tu aseguradora: peritaje, presupuesto, trámites y reparación. Tú solo tienes que traer el coche y nosotros nos ocupamos del resto.',
    icon: 'description',
    category: 'OTHER',
    estimatedDuration: 'Según siniestro',
    priceRange: 'Según peritaje',
    features: [
      'Gestión integral con aseguradoras',
      'Peritaje in situ',
      'Presupuesto detallado de daños',
      'Reparación según acuerdo con la compañía',
      'Coche de sustitución durante la reparación',
      'Seguimiento del estado de la reparación',
    ],
    faqs: [
      {
        question: '¿Puedo elegir taller para el siniestro?',
        answer: 'Sí, por ley tienes derecho a elegir el taller donde reparar tu vehículo. No estás obligado a ir al taller que te sugiera la aseguradora.',
      },
    ],
  },
]

// ─── Funciones de acceso ───

export function getServices(): ServiceInfo[] {
  return services
}

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return services.find(s => s.slug === slug)
}

export function getServicesByCategory(category: string): ServiceInfo[] {
  return services.filter(s => s.category === category)
}
```

---

### Paso 2.4 — Completar la landing page (index.vue)

Reemplaza `app/pages/index.vue` con la versión completa:

```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <!-- ─── HERO ─── -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-20 md:py-28">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold font-heading mb-6">
          Chapa, pintura y mecánica en Humanes de Madrid
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Más de 10 años cuidando tu vehículo. Diagnóstico preciso,
          presupuesto sin compromiso y la calidad que nos avala.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn to="/reservar" color="white" text-color="primary"
            label="Reservar Cita" size="lg" unelevated rounded no-caps icon="event" />
          <q-btn to="/servicios" outline color="white"
            label="Ver Servicios" size="lg" rounded no-caps icon="build" />
        </div>
        <!-- Indicadores de confianza (datos reales de Mobauto) -->
        <div class="flex flex-wrap justify-center gap-8 mt-12 text-blue-100">
          <div class="text-center">
            <p class="text-3xl font-bold text-white">4.8★</p>
            <p class="text-sm">Valoración en Google</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-white">+58</p>
            <p class="text-sm">Opiniones de clientes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-white">+10</p>
            <p class="text-sm">Años de experiencia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SERVICIOS DESTACADOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="Nuestros Servicios"
          subtitle="Ofrecemos una amplia gama de servicios para mantener tu vehículo en perfectas condiciones."
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <q-card
            v-for="service in featuredServices"
            :key="service.slug"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/servicios/${service.slug}`)"
          >
            <q-card-section class="text-center py-8">
              <q-icon :name="service.icon" size="56px" color="primary" />
              <h3 class="text-xl font-semibold mt-4 mb-2">{{ service.name }}</h3>
              <p class="text-gray-600">{{ service.shortDescription }}</p>
              <p class="text-primary font-semibold mt-3">{{ service.priceRange }}</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center mt-8">
          <q-btn to="/servicios" color="primary" outline label="Ver todos los servicios"
            no-caps rounded icon-right="arrow_forward" />
        </div>
      </div>
    </section>

    <!-- ─── POR QUÉ ELEGIRNOS ─── -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="¿Por qué elegirnos?"
          subtitle="Nos diferenciamos por la calidad, transparencia y atención personalizada."
        />
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="reason in reasons" :key="reason.title" class="text-center p-6">
            <q-icon :name="reason.icon" size="48px" color="primary" />
            <h3 class="text-lg font-semibold mt-4 mb-2">{{ reason.title }}</h3>
            <p class="text-gray-600 text-sm">{{ reason.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="Lo que dicen nuestros clientes"
          subtitle="La satisfacción de nuestros clientes es nuestra mejor carta de presentación."
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CommonTestimonialCard
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            v-bind="testimonial"
          />
        </div>
      </div>
    </section>

    <!-- ─── CONTACTO ─── -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <!-- Info de contacto -->
          <div>
            <h2 class="text-3xl font-bold mb-6">¿Tienes alguna duda?</h2>
            <p class="text-gray-600 mb-8">
              Contáctanos y te responderemos lo antes posible.
              También puedes reservar tu cita directamente online.
            </p>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <q-icon name="location_on" size="24px" color="primary" />
                <span>C. del Álamo, 44, 28970 Humanes de Madrid</span>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="phone" size="24px" color="primary" />
                <a href="tel:916041262" class="hover:text-blue-600">916 04 12 62</a>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="email" size="24px" color="primary" />
                <span>info@mobauto.es</span>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="schedule" size="24px" color="primary" />
                <div>
                  <p>Lunes a Viernes: 8:00–14:00 / 15:30–19:00</p>
                  <p class="text-sm text-gray-400">Sábados y domingos: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Formulario -->
          <CommonContactForm />
        </div>
      </div>
    </section>

    <!-- ─── CTA FINAL ─── -->
    <section class="py-16 bg-accent text-white text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold font-heading mb-4">¿Necesitas presupuesto?</h2>
        <p class="text-xl text-orange-100 mb-8">
          Llámanos al 916 04 12 62 o reserva tu cita online. Presupuesto sin compromiso.
        </p>
        <q-btn to="/reservar" color="white" text-color="primary"
          label="Reservar Cita Ahora" size="lg" unelevated rounded no-caps />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ─── SEO ───
useSeoMeta({
  title: 'Mobauto — Taller de Chapa, Pintura y Mecánica en Humanes de Madrid',
  description: 'Mobauto: taller de chapa, pintura y reparación en Humanes de Madrid. +10 años de experiencia, 4.8★ en Google. Presupuesto sin compromiso. Tel: 916 04 12 62',
  ogTitle: 'Mobauto — Taller en Humanes de Madrid',
  ogDescription: 'Chapa, pintura y reparación de vehículos. Presupuesto sin compromiso.',
  ogType: 'website',
})

// ─── Structured Data (JSON-LD) para SEO ───
// Esto le dice a Google "somos un negocio de automoción en esta dirección"
// Aparecerá como rich snippet en los resultados de búsqueda.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AutoBodyShop',  // Tipo más específico para chapa y pintura
        name: 'Mobauto',
        description: 'Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'C. del Álamo, 44',
          addressLocality: 'Humanes de Madrid',
          addressRegion: 'Madrid',
          postalCode: '28970',
          addressCountry: 'ES',
        },
        telephone: '+34916041262',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '14:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '15:30',
            closes: '19:00',
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '58',
        },
        priceRange: '€€',
        url: 'https://mobauto.es',
      }),
    },
  ],
})

// ─── Datos ───
const allServices = getServices()
const featuredServices = allServices.slice(0, 3) // Mostrar solo los 3 primeros

const reasons = [
  { icon: 'verified', title: 'Profesionalidad', description: 'Mecánicos certificados con más de 10 años de experiencia.' },
  { icon: 'handshake', title: 'Transparencia', description: 'Presupuesto detallado sin sorpresas. Sin letra pequeña.' },
  { icon: 'schedule', title: 'Rapidez', description: 'Respetamos los plazos. Tu vehículo listo cuando lo prometemos.' },
  { icon: 'workspace_premium', title: 'Garantía', description: 'Garantía en todas nuestras reparaciones y piezas.' },
]

// Testimonios basados en opiniones reales de clientes de Mobauto
const testimonials = [
  { name: 'Roberto G.', text: 'Mis dos coches han pasado por chapa y pintura, fenomenal, mejor imposible. Grandes profesionales y con coche de sustitución gratis.', rating: 5, vehicle: 'Seat León 2019' },
  { name: 'Laura M.', text: 'Muy profesionales. Me dieron un presupuesto detallado antes de tocar nada y el resultado de la pintura fue impecable. Repetiré seguro.', rating: 5, vehicle: 'VW Polo 2021' },
  { name: 'Daniel P.', text: 'Me repararon el parachoques y quedó como nuevo. Buen trato, precio justo y cumplieron con el plazo que me dijeron.', rating: 5, vehicle: 'Hyundai Tucson 2020' },
]
</script>
```

**Fíjate cómo se usan los componentes:**
- `<CommonSectionTitle>` = archivo `components/common/SectionTitle.vue` (Nuxt convierte la ruta de carpetas en el nombre).
- `<CommonTestimonialCard>` = `components/common/TestimonialCard.vue`.
- `v-bind="testimonial"`: Pasa TODAS las propiedades del objeto como props. Equivale a `:name="testimonial.name" :text="testimonial.text" ...`.

---

### Paso 2.5 — Página de listado de servicios

Reemplaza `app/pages/servicios/index.vue`:

```vue
<!-- app/pages/servicios/index.vue → URL: /servicios -->
<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">Nuestros Servicios</h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Ofrecemos servicios profesionales de mantenimiento, reparación y diagnóstico
          para todo tipo de vehículos.
        </p>
      </div>
    </section>

    <!-- Lista de servicios -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <q-card
            v-for="service in services"
            :key="service.slug"
            class="hover:shadow-lg transition-shadow"
          >
            <q-card-section>
              <div class="flex items-center gap-3 mb-4">
                <q-icon :name="service.icon" size="36px" color="primary" />
                <h2 class="text-xl font-bold">{{ service.name }}</h2>
              </div>
              <p class="text-gray-600 mb-4">{{ service.shortDescription }}</p>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span><q-icon name="schedule" size="16px" /> {{ service.estimatedDuration }}</span>
                <span class="font-semibold text-primary text-base">{{ service.priceRange }}</span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat color="primary" label="Más detalles" no-caps
                :to="`/servicios/${service.slug}`" />
              <q-space />
              <q-btn flat color="positive" label="Reservar" no-caps
                :to="`/reservar?servicio=${service.slug}`" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Servicios — Chapa, Pintura, Cristales y Mecánica | Mobauto Humanes de Madrid',
  description: 'Servicios de chapa y pintura, reparación de cristales, mecánica general, mantenimiento y pre-ITV en Humanes de Madrid. Presupuesto sin compromiso.',
})

const services = getServices()
</script>
```

---

### Paso 2.6 — Página de detalle de servicio (ruta dinámica)

Crea `app/pages/servicios/[slug].vue`:

```vue
<!-- app/pages/servicios/[slug].vue → URL: /servicios/cambio-aceite, /servicios/frenos, etc. -->
<!--
  [slug] es un parámetro dinámico.
  Nuxt extrae el valor de la URL y lo pone disponible via useRoute().

  /servicios/cambio-aceite → route.params.slug = "cambio-aceite"
  /servicios/frenos        → route.params.slug = "frenos"
-->
<template>
  <div v-if="service">
    <!-- Header del servicio -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <NuxtLink to="/servicios" class="text-blue-200 hover:text-white mb-4 inline-flex items-center gap-1">
          <q-icon name="arrow_back" /> Volver a servicios
        </NuxtLink>
        <div class="flex items-center gap-4 mt-4">
          <q-icon :name="service.icon" size="56px" />
          <div>
            <h1 class="text-4xl font-bold">{{ service.name }}</h1>
            <p class="text-blue-100 text-lg mt-2">{{ service.shortDescription }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Columna principal -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Descripción -->
            <div>
              <h2 class="text-2xl font-bold mb-4">Descripción del servicio</h2>
              <p class="text-gray-600 text-lg leading-relaxed">{{ service.fullDescription }}</p>
            </div>

            <!-- Qué incluye -->
            <div>
              <h2 class="text-2xl font-bold mb-4">¿Qué incluye?</h2>
              <ul class="space-y-3">
                <li v-for="feature in service.features" :key="feature"
                  class="flex items-start gap-3">
                  <q-icon name="check_circle" color="positive" size="24px" class="mt-0.5" />
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- FAQs -->
            <div v-if="service.faqs.length">
              <h2 class="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
              <q-list bordered separator class="rounded-lg">
                <q-expansion-item
                  v-for="(faq, i) in service.faqs"
                  :key="i"
                  :label="faq.question"
                  header-class="font-medium"
                >
                  <q-card>
                    <q-card-section class="text-gray-600">
                      {{ faq.answer }}
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </div>

          <!-- Sidebar -->
          <div>
            <q-card class="sticky top-4">
              <q-card-section>
                <h3 class="text-lg font-bold mb-4">Resumen</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Duración estimada</span>
                    <span class="font-medium">{{ service.estimatedDuration }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Precio</span>
                    <span class="font-bold text-primary text-lg">{{ service.priceRange }}</span>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions vertical>
                <q-btn color="primary" label="Reservar este servicio" no-caps
                  unelevated class="w-full" size="lg"
                  :to="`/reservar?servicio=${service.slug}`" />
                <q-btn flat color="primary" label="Contactar para más info" no-caps
                  class="w-full" to="/#contacto" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Si el servicio no existe -->
  <div v-else class="max-w-7xl mx-auto px-4 py-16 text-center">
    <q-icon name="error_outline" size="64px" color="grey" />
    <h1 class="text-2xl font-bold mt-4">Servicio no encontrado</h1>
    <p class="text-gray-500 mt-2 mb-6">El servicio que buscas no existe.</p>
    <q-btn to="/servicios" color="primary" label="Ver todos los servicios" no-caps />
  </div>
</template>

<script setup lang="ts">
// ─── Obtener el slug de la URL ───
const route = useRoute()
const slug = route.params.slug as string

// ─── Buscar el servicio ───
const service = getServiceBySlug(slug)

// ─── SEO dinámico ───
// Los meta tags cambian según el servicio que se esté viendo.
if (service) {
  useSeoMeta({
    title: `${service.name} - Mobauto Taller Mecánico`,
    description: service.fullDescription.slice(0, 160), // Google muestra ~160 caracteres
    ogTitle: `${service.name} - Mobauto`,
    ogDescription: service.shortDescription,
  })

  // FAQ Schema (le dice a Google que esta página tiene FAQs)
  // Google puede mostrarlas directamente en los resultados de búsqueda.
  if (service.faqs.length) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        },
      ],
    })
  }
} else {
  useSeoMeta({ title: 'Servicio no encontrado - Mobauto' })
}
</script>
```

**Conceptos clave de esta página:**
- `[slug]` en el nombre del archivo = ruta dinámica. El valor lo lees con `useRoute().params.slug`.
- SEO dinámico: cada servicio tiene sus propios meta tags.
- JSON-LD FAQPage: Schema.org para que Google muestre FAQs en los resultados.
- `<q-expansion-item>`: Componente de Quasar para acordeones (pregunta se expande al hacer click).

---

### Paso 2.7 — Configurar Sitemap y robots.txt

Instala el módulo de sitemap:

```bash
npm install @nuxtjs/sitemap
```

Actualiza `nuxt.config.ts` para añadir el módulo sitemap (añade a la lista de modules):

```typescript
modules: [
  '@nuxtjs/tailwindcss',
  '@pinia/nuxt',
  'nuxt-quasar-ui',
  '@nuxtjs/sitemap',  // ← Añadir esta línea
],

// Añadir después de la sección de modules:
site: {
  url: 'https://mobauto.es', // Tu dominio
},
```

El `robots.txt` en `public/robots.txt` ya existe. Actualiza su contenido a:

```
User-agent: *
Allow: /
Sitemap: https://mobauto.es/sitemap.xml
```

---

### Resumen Fase 2 — Lo que has aprendido

| Concepto | Qué es |
|----------|--------|
| Componentes con Props | Piezas de UI reutilizables que reciben datos |
| `defineProps<>()` | Declara qué datos acepta un componente |
| Rutas dinámicas `[slug]` | URL con partes variables |
| `useRoute()` | Acceder a parámetros de la URL actual |
| `v-bind="objeto"` | Pasar todas las propiedades como props |
| `useSeoMeta()` | Meta tags por página para SEO |
| `useHead()` | Inyectar scripts, links, etc. en el `<head>` |
| JSON-LD / Schema.org | Datos estructurados para Google rich snippets |
| Sitemap XML | Mapa del sitio para buscadores |
| `computed()` | Valor derivado que se recalcula automáticamente |
| `<q-expansion-item>` | Acordeón/colapsable de Quasar |

---

---
---

## FASE 3: Sistema de Reserva de Citas

> Esta es la fase más compleja. Construiremos un stepper (asistente paso a paso)
> para reservar citas, con calendario de disponibilidad y confirmación.

### Paso 3.1 — API de disponibilidad y citas

Primero necesitamos la "base de datos" de citas y disponibilidad.

Crea `server/utils/appointments.ts`:

```typescript
// server/utils/appointments.ts
// ─── "Base de datos" temporal de citas y disponibilidad ───

export interface DbAppointment {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePlate: string
  services: string[]        // slugs de servicios
  scheduledDate: string     // "2026-03-15"
  scheduledTime: string     // "10:00"
  duration: number          // minutos
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  createdAt: Date
}

const appointments: DbAppointment[] = []

// Horario real de Mobauto (mañana y tarde con descanso)
const BUSINESS_HOURS = {
  morningOpen: 8,     // 8:00
  morningClose: 14,   // 14:00
  afternoonOpen: 15,  // 15:30 → redondeamos a 15:30
  afternoonClose: 19, // 19:00
  slotMinutes: 30,
  workDays: [1, 2, 3, 4, 5], // Lunes a Viernes (0=Domingo)
}

// ─── Obtener slots disponibles para una fecha ───
export function getAvailableSlots(date: string): string[] {
  const dayOfWeek = new Date(date).getDay()

  // ¿Es día laboral?
  if (!BUSINESS_HOURS.workDays.includes(dayOfWeek)) {
    return [] // Fin de semana → no hay slots
  }

  // Generar slots: turno de mañana (8:00-14:00) + turno de tarde (15:30-19:00)
  const allSlots: string[] = []

  // Mañana
  for (let hour = BUSINESS_HOURS.morningOpen; hour < BUSINESS_HOURS.morningClose; hour++) {
    for (let min = 0; min < 60; min += BUSINESS_HOURS.slotMinutes) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      allSlots.push(time)
    }
  }
  // Tarde (empieza a las 15:30)
  for (let hour = BUSINESS_HOURS.afternoonOpen; hour < BUSINESS_HOURS.afternoonClose; hour++) {
    const startMin = (hour === 15) ? 30 : 0 // 15:30, luego 16:00, 16:30...
    for (let min = startMin; min < 60; min += BUSINESS_HOURS.slotMinutes) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      allSlots.push(time)
    }
  }

  // Filtrar los que ya están ocupados
  const bookedTimes = appointments
    .filter(a => a.scheduledDate === date && a.status !== 'CANCELLED')
    .map(a => a.scheduledTime)

  return allSlots.filter(slot => !bookedTimes.includes(slot))
}

// ─── Crear cita ───
export function createAppointment(
  data: Omit<DbAppointment, 'id' | 'status' | 'createdAt'>
): DbAppointment {
  const appointment: DbAppointment = {
    ...data,
    id: crypto.randomUUID(),
    status: 'PENDING',
    createdAt: new Date(),
  }
  appointments.push(appointment)
  return appointment
}

// ─── Obtener citas por email ───
export function getAppointmentsByEmail(email: string): DbAppointment[] {
  return appointments
    .filter(a => a.customerEmail === email)
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
}

// ─── Obtener todas las citas (admin) ───
export function getAllAppointments(): DbAppointment[] {
  return appointments.sort(
    (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  )
}

// ─── Actualizar estado de una cita ───
export function updateAppointmentStatus(
  id: string,
  status: DbAppointment['status']
): DbAppointment | null {
  const appointment = appointments.find(a => a.id === id)
  if (!appointment) return null
  appointment.status = status
  return appointment
}
```

---

### Paso 3.2 — Endpoints de la API de citas

Crea `server/api/appointments/slots.get.ts`:

```typescript
// server/api/appointments/slots.get.ts
// ─── GET /api/appointments/slots?date=2026-03-15 ───
// Devuelve los horarios disponibles para una fecha.

export default defineEventHandler((event) => {
  // getQuery() lee los parámetros de la URL (?date=2026-03-15)
  const query = getQuery(event)
  const date = query.date as string

  if (!date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "date" es obligatorio. Formato: YYYY-MM-DD',
    })
  }

  const slots = getAvailableSlots(date)

  return {
    success: true,
    data: { date, slots },
  }
})
```

Crea `server/api/appointments/index.post.ts`:

```typescript
// server/api/appointments/index.post.ts
// ─── POST /api/appointments ───
// Crea una nueva cita.

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    customerName, customerEmail, customerPhone,
    vehicleBrand, vehicleModel, vehicleYear, vehiclePlate,
    services, scheduledDate, scheduledTime, duration, notes,
  } = body

  // Validaciones básicas
  if (!customerName || !customerEmail || !scheduledDate || !scheduledTime || !services?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos obligatorios',
    })
  }

  // Verificar que el slot sigue disponible
  const availableSlots = getAvailableSlots(scheduledDate)
  if (!availableSlots.includes(scheduledTime)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'El horario seleccionado ya no está disponible',
    })
  }

  const appointment = createAppointment({
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    vehicleBrand: vehicleBrand || '',
    vehicleModel: vehicleModel || '',
    vehicleYear: vehicleYear || 0,
    vehiclePlate: vehiclePlate || '',
    services,
    scheduledDate,
    scheduledTime,
    duration: duration || 60,
    notes,
  })

  console.log('📅 Nueva cita creada:', appointment.id, scheduledDate, scheduledTime)

  setResponseStatus(event, 201)
  return { success: true, data: appointment }
})
```

---

### Paso 3.3 — Componente de selección de fecha/hora

Crea `app/components/booking/DateTimePicker.vue`:

```vue
<!-- Selector de fecha y hora con slots disponibles -->
<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Selecciona fecha y hora</h3>

    <!-- Selector de fecha -->
    <q-date
      v-model="selectedDate"
      :options="dateOptions"
      minimal
      class="mb-4 w-full"
    />

    <!-- Slots de hora -->
    <div v-if="selectedDate">
      <p class="font-medium mb-2">Horarios disponibles:</p>

      <div v-if="loadingSlots" class="text-center py-4">
        <q-spinner color="primary" size="30px" />
        <p class="text-gray-500 mt-2">Cargando horarios...</p>
      </div>

      <div v-else-if="slots.length === 0" class="text-center py-4">
        <q-icon name="event_busy" size="32px" color="grey" />
        <p class="text-gray-500 mt-2">No hay horarios disponibles para esta fecha.</p>
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <q-btn
          v-for="slot in slots"
          :key="slot"
          :label="slot"
          :color="selectedTime === slot ? 'primary' : undefined"
          :outline="selectedTime !== slot"
          no-caps
          @click="selectTime(slot)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ─── Props y Emits ───
// emit() permite enviar datos del hijo al padre.
// Es lo contrario de props (padre → hijo). Emit va hijo → padre.
const emit = defineEmits<{
  (e: 'update:date', value: string): void
  (e: 'update:time', value: string): void
}>()

const selectedDate = ref('')
const selectedTime = ref('')
const slots = ref<string[]>([])
const loadingSlots = ref(false)

// ─── Opciones de fecha ───
// Función que determina qué fechas se pueden seleccionar.
// Devuelve true = seleccionable, false = bloqueada.
function dateOptions(date: string): boolean {
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // No permitir fechas pasadas
  if (d < today) return false

  // No permitir fines de semana (0=domingo, 6=sábado)
  const day = d.getDay()
  if (day === 0 || day === 6) return false

  return true
}

// ─── Watch: observar cambios en la fecha seleccionada ───
// watch() ejecuta una función cada vez que una variable reactiva cambia.
// Aquí: cuando el usuario selecciona una fecha, cargamos los slots disponibles.
watch(selectedDate, async (newDate) => {
  if (!newDate) return

  selectedTime.value = '' // Reset la hora seleccionada
  loadingSlots.value = true

  try {
    // Quasar date format es "YYYY/MM/DD", convertimos a "YYYY-MM-DD"
    const formattedDate = newDate.replace(/\//g, '-')
    const response = await $fetch(`/api/appointments/slots?date=${formattedDate}`)
    slots.value = response.data.slots
    emit('update:date', formattedDate)
  } catch (err) {
    console.error('Error al cargar slots:', err)
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
})

function selectTime(time: string) {
  selectedTime.value = time
  emit('update:time', time)
}
</script>
```

**Concepto clave: `emit()`**
- Props = padre envía datos al hijo (flujo hacia abajo)
- Emit = hijo avisa al padre de un cambio (flujo hacia arriba)
- Ejemplo: cuando el usuario selecciona una hora, el componente "emite" `update:time` y el padre recibe el valor.

---

### Paso 3.4 — Página de reserva con stepper

Reemplaza `app/pages/reservar/index.vue`:

```vue
<!-- app/pages/reservar/index.vue → URL: /reservar -->
<!--
  Stepper = asistente paso a paso.
  El usuario avanza por pasos: Servicio → Vehículo → Fecha → Datos → Confirmar
-->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Reservar Cita</h1>

    <q-stepper
      v-model="step"
      color="primary"
      animated
      vertical
    >
      <!-- ─── PASO 1: Seleccionar servicios ─── -->
      <q-step :name="1" title="Servicios" icon="build" :done="step > 1">
        <p class="text-gray-600 mb-4">Selecciona los servicios que necesitas:</p>
        <div class="space-y-2">
          <q-checkbox
            v-for="service in availableServices"
            :key="service.slug"
            v-model="form.services"
            :val="service.slug"
            :label="`${service.name} — ${service.priceRange}`"
          />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" no-caps
            :disable="form.services.length === 0"
            @click="step = 2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 2: Datos del vehículo ─── -->
      <q-step :name="2" title="Vehículo" icon="directions_car" :done="step > 2">
        <div class="space-y-4 max-w-md">
          <q-input v-model="form.vehicleBrand" label="Marca" outlined
            placeholder="Ej: Toyota, Seat, VW..." />
          <q-input v-model="form.vehicleModel" label="Modelo" outlined
            placeholder="Ej: Corolla, León, Golf..." />
          <q-input v-model="form.vehicleYear" label="Año" outlined type="number"
            placeholder="Ej: 2020" />
          <q-input v-model="form.vehiclePlate" label="Matrícula" outlined
            placeholder="Ej: 1234 ABC" />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" no-caps @click="step = 3" />
          <q-btn flat label="Atrás" no-caps @click="step = 1" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 3: Fecha y hora ─── -->
      <q-step :name="3" title="Fecha y Hora" icon="event" :done="step > 3">
        <BookingDateTimePicker
          @update:date="(d) => form.scheduledDate = d"
          @update:time="(t) => form.scheduledTime = t"
        />
        <q-stepper-navigation class="mt-4">
          <q-btn color="primary" label="Siguiente" no-caps
            :disable="!form.scheduledDate || !form.scheduledTime"
            @click="step = 4" />
          <q-btn flat label="Atrás" no-caps @click="step = 2" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 4: Datos de contacto ─── -->
      <q-step :name="4" title="Tus Datos" icon="person" :done="step > 4">
        <div class="space-y-4 max-w-md">
          <q-input v-model="form.customerName" label="Nombre completo" outlined
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerEmail" label="Email" type="email" outlined
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerPhone" label="Teléfono" outlined />
          <q-input v-model="form.notes" label="Notas adicionales (opcional)"
            type="textarea" outlined />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Revisar y Confirmar" no-caps
            :disable="!form.customerName || !form.customerEmail"
            @click="step = 5" />
          <q-btn flat label="Atrás" no-caps @click="step = 3" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 5: Confirmación ─── -->
      <q-step :name="5" title="Confirmar" icon="check">
        <q-card bordered class="mb-4">
          <q-card-section>
            <h3 class="font-bold text-lg mb-4">Resumen de tu cita</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Servicios:</span>
                <span class="font-medium">{{ selectedServiceNames.join(', ') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Vehículo:</span>
                <span>{{ form.vehicleBrand }} {{ form.vehicleModel }} ({{ form.vehiclePlate }})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Fecha:</span>
                <span class="font-medium">{{ form.scheduledDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Hora:</span>
                <span class="font-medium">{{ form.scheduledTime }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Contacto:</span>
                <span>{{ form.customerName }} ({{ form.customerEmail }})</span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg mb-4">
          {{ error }}
        </q-banner>

        <q-stepper-navigation>
          <q-btn color="primary" label="Confirmar Cita" no-caps
            icon="check" :loading="loading" @click="submitBooking" />
          <q-btn flat label="Atrás" no-caps @click="step = 4" class="ml-2" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <!-- ─── Diálogo de éxito ─── -->
    <q-dialog v-model="showSuccess" persistent>
      <q-card class="max-w-sm">
        <q-card-section class="text-center py-8">
          <q-icon name="check_circle" size="64px" color="positive" />
          <h2 class="text-2xl font-bold mt-4">¡Cita Reservada!</h2>
          <p class="text-gray-500 mt-2">
            Te hemos enviado un email de confirmación a {{ form.customerEmail }}.
          </p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Volver al inicio" no-caps to="/" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Reservar Cita Online - Mobauto',
  description: 'Reserva tu cita en nuestro taller mecánico de forma rápida y sencilla.',
})

// ─── Estado ───
const step = ref(1)
const loading = ref(false)
const error = ref('')
const showSuccess = ref(false)

// Obtener servicio preseleccionado de la URL (?servicio=cambio-aceite)
const route = useRoute()
const preselectedService = route.query.servicio as string

const form = reactive({
  services: preselectedService ? [preselectedService] : [] as string[],
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
  vehiclePlate: '',
  scheduledDate: '',
  scheduledTime: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
})

const availableServices = getServices()

// Nombres de los servicios seleccionados (para el resumen)
const selectedServiceNames = computed(() => {
  return form.services.map(slug => {
    const service = getServiceBySlug(slug)
    return service?.name || slug
  })
})

// ─── Enviar reserva ───
async function submitBooking() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/appointments', {
      method: 'POST',
      body: {
        ...form,
        vehicleYear: parseInt(form.vehicleYear) || 0,
        duration: 60, // TODO: calcular según servicios
      },
    })
    showSuccess.value = true
  } catch (err: any) {
    error.value = err?.data?.message || err?.statusMessage || 'Error al crear la cita'
  } finally {
    loading.value = false
  }
}
</script>
```

**Conceptos clave:**
- `<q-stepper>`: Componente de Quasar que guía al usuario paso a paso.
- `v-model="step"`: Controla qué paso está activo.
- `:disable`: Desactiva el botón si la condición es true.
- `<q-dialog>`: Modal/diálogo de Quasar.
- `route.query.servicio`: Lee `?servicio=valor` de la URL.

---

### Resumen Fase 3

| Concepto | Qué es |
|----------|--------|
| `emit()` / `defineEmits()` | Comunicación hijo → padre |
| `watch()` | Ejecutar código cuando una variable cambia |
| `getQuery(event)` | Leer parámetros de URL en server routes (?key=value) |
| `<q-stepper>` | Asistente paso a paso |
| `<q-dialog>` | Ventana modal |
| `<q-date>` | Selector de fecha de Quasar |
| `<q-checkbox>` | Checkboxes con v-model array |

---
---

## FASE 4: Portal del Cliente

> Páginas protegidas donde el cliente gestiona sus citas y vehículos.

### Paso 4.1 — Layout específico para el portal del cliente

Crea `app/layouts/client.vue`:

```vue
<!-- app/layouts/client.vue -->
<!--
  Layout específico para las páginas del portal del cliente.
  Tiene una barra lateral de navegación.

  Para usarlo en una página:
  definePageMeta({ layout: 'client' })
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header simplificado -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <q-icon name="build" size="24px" color="primary" />
          <span class="text-lg font-bold">Mobauto</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">{{ user?.email }}</span>
          <q-btn flat round icon="logout" size="sm" @click="logout" />
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Barra lateral -->
        <aside class="md:w-64 flex-shrink-0">
          <q-list bordered class="rounded-lg bg-white">
            <q-item
              v-for="link in sidebarLinks"
              :key="link.to"
              :to="link.to"
              clickable
              :active="route.path === link.to"
              active-class="bg-blue-50 text-blue-700"
            >
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>{{ link.label }}</q-item-section>
            </q-item>
          </q-list>
        </aside>

        <!-- Contenido principal -->
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()

const sidebarLinks = [
  { to: '/mi-cuenta', icon: 'dashboard', label: 'Dashboard' },
  { to: '/mi-cuenta/citas', icon: 'event', label: 'Mis Citas' },
  { to: '/mi-cuenta/vehiculos', icon: 'directions_car', label: 'Mis Vehículos' },
  { to: '/mi-cuenta/perfil', icon: 'person', label: 'Mi Perfil' },
]
</script>
```

---

### Paso 4.2 — Dashboard del cliente actualizado

Actualiza `app/pages/mi-cuenta/index.vue` para usar el layout de cliente:

```vue
<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <q-card v-for="stat in stats" :key="stat.label">
        <q-card-section class="flex items-center gap-4">
          <q-icon :name="stat.icon" size="40px" :color="stat.color" />
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Acciones rápidas -->
    <h2 class="text-lg font-semibold mb-4">Acciones rápidas</h2>
    <div class="flex flex-wrap gap-4">
      <q-btn color="primary" label="Reservar Nueva Cita" icon="add"
        no-caps unelevated to="/reservar" />
      <q-btn outline color="primary" label="Ver Mis Citas" icon="event"
        no-caps to="/mi-cuenta/citas" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'client',  // ← Usa el layout del portal cliente
})

useSeoMeta({ title: 'Mi Cuenta - Mobauto' })

const stats = [
  { label: 'Próximas citas', value: '0', icon: 'event', color: 'primary' },
  { label: 'Vehículos registrados', value: '0', icon: 'directions_car', color: 'secondary' },
  { label: 'Servicios realizados', value: '0', icon: 'check_circle', color: 'positive' },
]
</script>
```

---

### Paso 4.3 — Página de Mis Citas

Crea `app/pages/mi-cuenta/citas.vue`:

```vue
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mis Citas</h1>
      <q-btn color="primary" label="Nueva Cita" icon="add" no-caps to="/reservar" />
    </div>

    <q-card>
      <q-card-section v-if="appointments.length === 0" class="text-center py-12">
        <q-icon name="event_busy" size="64px" color="grey-4" />
        <p class="text-gray-500 mt-4">No tienes citas aún.</p>
        <q-btn color="primary" label="Reservar tu primera cita" no-caps
          to="/reservar" class="mt-4" />
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="apt in appointments" :key="apt.id">
          <q-item-section avatar>
            <q-icon name="event" :color="statusColor(apt.status)" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ apt.services.join(', ') }}</q-item-label>
            <q-item-label caption>
              {{ apt.scheduledDate }} a las {{ apt.scheduledTime }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="statusColor(apt.status)" :label="statusLabel(apt.status)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mis Citas - Mobauto' })

const { user } = useAuth()
const appointments = ref<any[]>([])

// Cargar citas del usuario
onMounted(async () => {
  // TODO: endpoint real filtrado por usuario
  // Por ahora, cargamos todas las citas (demo)
})

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    IN_PROGRESS: 'info',
    COMPLETED: 'positive',
    CANCELLED: 'negative',
  }
  return colors[status] || 'grey'
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    IN_PROGRESS: 'En proceso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
  }
  return labels[status] || status
}
</script>
```

---

### Paso 4.4 — Página de Mis Vehículos

Crea `app/pages/mi-cuenta/vehiculos.vue`:

```vue
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mis Vehículos</h1>
      <q-btn color="primary" label="Añadir Vehículo" icon="add"
        no-caps @click="showDialog = true" />
    </div>

    <!-- Lista de vehículos -->
    <div v-if="vehicles.length === 0" class="text-center py-12">
      <q-icon name="directions_car" size="64px" color="grey-4" />
      <p class="text-gray-500 mt-4">No tienes vehículos registrados.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <q-card v-for="vehicle in vehicles" :key="vehicle.id">
        <q-card-section>
          <div class="flex items-center gap-4">
            <q-icon name="directions_car" size="40px" color="primary" />
            <div>
              <h3 class="font-bold text-lg">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="text-gray-500">{{ vehicle.year }} · {{ vehicle.plate }}</p>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="primary" label="Ver historial" no-caps />
          <q-btn flat color="negative" label="Eliminar" no-caps
            @click="removeVehicle(vehicle.id)" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Diálogo para añadir vehículo -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <h3 class="text-lg font-bold">Añadir Vehículo</h3>
        </q-card-section>
        <q-card-section class="space-y-4">
          <q-input v-model="newVehicle.brand" label="Marca" outlined />
          <q-input v-model="newVehicle.model" label="Modelo" outlined />
          <q-input v-model="newVehicle.year" label="Año" type="number" outlined />
          <q-input v-model="newVehicle.plate" label="Matrícula" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" no-caps v-close-popup />
          <q-btn color="primary" label="Guardar" no-caps @click="addVehicle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mis Vehículos - Mobauto' })

// Estado local (en el futuro vendrá del backend)
const vehicles = ref<Array<{
  id: string; brand: string; model: string; year: number; plate: string
}>>([])

const showDialog = ref(false)
const newVehicle = reactive({ brand: '', model: '', year: '', plate: '' })

function addVehicle() {
  vehicles.value.push({
    id: crypto.randomUUID(),
    brand: newVehicle.brand,
    model: newVehicle.model,
    year: parseInt(newVehicle.year) || 0,
    plate: newVehicle.plate,
  })
  // Reset form
  Object.assign(newVehicle, { brand: '', model: '', year: '', plate: '' })
  showDialog.value = false
}

function removeVehicle(id: string) {
  vehicles.value = vehicles.value.filter(v => v.id !== id)
}
</script>
```

---

### Paso 4.5 — Página de Perfil

Crea `app/pages/mi-cuenta/perfil.vue`:

```vue
<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <q-card class="max-w-lg">
      <q-card-section class="space-y-4">
        <q-input v-model="profile.email" label="Email" outlined readonly
          hint="El email no se puede cambiar" />
        <q-input v-model="profile.firstName" label="Nombre" outlined />
        <q-input v-model="profile.lastName" label="Apellidos" outlined />
        <q-input v-model="profile.phone" label="Teléfono" outlined />
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" label="Guardar cambios" no-caps unelevated
          @click="saveProfile" :loading="saving" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mi Perfil - Mobauto' })

const { user } = useAuth()
const saving = ref(false)

const profile = reactive({
  email: user.value?.email || '',
  firstName: '',
  lastName: '',
  phone: '',
})

async function saveProfile() {
  saving.value = true
  // TODO: endpoint real para actualizar perfil
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
  saving.value = false
}
</script>
```

---

### Resumen Fase 4

| Concepto | Qué es |
|----------|--------|
| Layouts múltiples | Diferentes plantillas para diferentes secciones (public vs portal) |
| `definePageMeta({ layout })` | Asignar un layout específico a una página |
| `onMounted()` | Código que se ejecuta cuando el componente aparece en pantalla |
| `<q-badge>` | Etiqueta/insignia con color (ej: estado de la cita) |
| `<q-dialog>` + formulario | Modal para añadir datos sin cambiar de página |
| `v-close-popup` | Directiva de Quasar que cierra el popup al hacer click |

---
---

## FASE 5: Panel de Administración

> Panel para que el dueño del taller gestione citas, clientes y servicios.

### Paso 5.1 — Layout de administración

Crea `app/layouts/admin.vue`:

```vue
<!-- app/layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header admin -->
    <header class="bg-gray-900 text-white shadow">
      <div class="max-w-full mx-auto px-4 flex justify-between items-center h-14">
        <div class="flex items-center gap-4">
          <q-btn flat round icon="menu" color="white" @click="drawer = !drawer" />
          <span class="text-lg font-bold">Mobauto Admin</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-300">{{ user?.email }}</span>
          <q-btn flat round icon="logout" size="sm" color="white" @click="logout" />
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="bg-gray-800 text-white transition-all duration-300"
        :class="drawer ? 'w-64' : 'w-0 overflow-hidden'"
      >
        <q-list dark padding>
          <q-item
            v-for="link in adminLinks"
            :key="link.to"
            :to="link.to"
            clickable
            dark
            :active="route.path === link.to"
            active-class="bg-gray-700"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>{{ link.label }}</q-item-section>
          </q-item>
        </q-list>
      </aside>

      <!-- Contenido -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()
const drawer = ref(true)

const adminLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/citas', icon: 'event', label: 'Citas' },
  { to: '/admin/clientes', icon: 'people', label: 'Clientes' },
  { to: '/admin/servicios', icon: 'build', label: 'Servicios' },
]
</script>
```

---

### Paso 5.2 — Dashboard admin

Crea `app/pages/admin/index.vue`:

```vue
<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Panel de Administración</h1>

    <!-- Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <q-card v-for="metric in metrics" :key="metric.label">
        <q-card-section class="flex items-center gap-4">
          <div class="p-3 rounded-lg" :class="`bg-${metric.color}-100`">
            <q-icon :name="metric.icon" size="28px" :color="metric.color" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ metric.value }}</p>
            <p class="text-sm text-gray-500">{{ metric.label }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Citas recientes -->
    <q-card>
      <q-card-section>
        <h2 class="text-lg font-bold">Citas Recientes</h2>
      </q-card-section>
      <q-table
        :rows="recentAppointments"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 5 }"
      >
        <!-- Columna personalizada para el estado -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="statusColor(props.value)" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',  // Solo admins pueden acceder
  layout: 'admin',
})

useSeoMeta({ title: 'Admin - Mobauto' })

const metrics = [
  { label: 'Citas hoy', value: '3', icon: 'event', color: 'primary' },
  { label: 'Pendientes', value: '5', icon: 'pending', color: 'warning' },
  { label: 'Completadas (mes)', value: '47', icon: 'check_circle', color: 'positive' },
  { label: 'Clientes totales', value: '124', icon: 'people', color: 'info' },
]

// Columnas de la tabla (configuración de q-table)
const columns = [
  { name: 'date', label: 'Fecha', field: 'scheduledDate', align: 'left' as const },
  { name: 'time', label: 'Hora', field: 'scheduledTime', align: 'left' as const },
  { name: 'customer', label: 'Cliente', field: 'customerName', align: 'left' as const },
  { name: 'services', label: 'Servicios', field: (row: any) => row.services.join(', '), align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
]

const recentAppointments = ref<any[]>([])

// Cargar citas
onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/appointments')
    recentAppointments.value = response.data
  } catch (err) {
    console.error('Error al cargar citas:', err)
  }
})

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'warning', CONFIRMED: 'primary', IN_PROGRESS: 'info',
    COMPLETED: 'positive', CANCELLED: 'negative',
  }
  return colors[status] || 'grey'
}
</script>
```

**`<q-table>`** es uno de los componentes más potentes de Quasar:
- `rows`: los datos (array de objetos)
- `columns`: define qué campos mostrar y cómo
- `row-key`: campo único para identificar cada fila
- Soporta paginación, filtrado, ordenamiento, y slots personalizados para celdas.

---

### Paso 5.3 — API de admin

Crea `server/api/admin/appointments.get.ts`:

```typescript
// server/api/admin/appointments.get.ts
// ─── GET /api/admin/appointments ───
// Solo accesible por admins.

export default defineEventHandler((event) => {
  // Verificar autenticación
  const authData = getUserFromEvent(event)
  if (!authData) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  // Verificar rol admin
  if (authData.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'No autorizado' })
  }

  const appointments = getAllAppointments()
  return { success: true, data: appointments }
})
```

---

### Resumen Fase 5

| Concepto | Qué es |
|----------|--------|
| `<q-table>` | Tabla avanzada con paginación, orden y filtros |
| Slots de tabla | `#body-cell-nombre` personaliza cómo se renderiza una celda |
| Layout admin | Layout oscuro con sidebar colapsable |
| Middleware admin | Protección de rutas solo para rol ADMIN |
| Verificación de roles | En el backend: leer JWT → verificar role === 'ADMIN' |

---
---

## FASES 6-8: Resumen de Funcionalidades Avanzadas, Testing y Deploy

> Las siguientes fases siguen los mismos patrones que ya has aprendido.
> Aquí te doy la guía resumida de qué implementar en cada una.

### Fase 6 — Funcionalidades Avanzadas

**Blog (patrón similar a servicios):**
```bash
# Estructura de archivos
app/pages/blog/index.vue          # Lista de posts
app/pages/blog/[slug].vue         # Detalle del post
server/api/blog/index.get.ts      # Lista de posts (API)
server/api/blog/[slug].get.ts     # Detalle del post (API)
server/api/admin/blog/index.post.ts  # Crear post (admin)
```

**Calculadora de mantenimiento:**
```vue
<!-- Ejemplo simplificado: app/pages/calculadora.vue -->
<script setup>
const km = ref(0)
const lastService = ref('')
const recommendation = computed(() => {
  if (km.value > 15000) return 'Necesitas cambio de aceite urgente'
  if (km.value > 10000) return 'Pronto necesitarás un cambio de aceite'
  return 'Todo en orden'
})
</script>
```

### Fase 7 — Testing

```bash
# Instalar Vitest
npm install -D vitest @vue/test-utils happy-dom

# Instalar Playwright para E2E
npm install -D @playwright/test
```

Ejemplo de test con Vitest:
```typescript
// tests/utils/services.test.ts
import { describe, it, expect } from 'vitest'
import { getServices, getServiceBySlug } from '~/app/utils/services-data'

describe('Services data', () => {
  it('devuelve una lista de servicios', () => {
    const services = getServices()
    expect(services.length).toBeGreaterThan(0)
  })

  it('encuentra un servicio por slug', () => {
    const service = getServiceBySlug('cambio-aceite')
    expect(service).toBeDefined()
    expect(service?.name).toBe('Cambio de Aceite')
  })

  it('devuelve undefined para slug inexistente', () => {
    const service = getServiceBySlug('no-existe')
    expect(service).toBeUndefined()
  })
})
```

### Fase 8 — Deploy

**Opción más sencilla (Vercel):**
```bash
# Instalar CLI de Vercel
npm install -g vercel

# Desplegar
vercel
```

**Docker Compose (para VPS):**
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: mobauto
      POSTGRES_PASSWORD: password_segura
      POSTGRES_DB: mobauto
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@mobauto.es
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  pgdata:
```

```bash
# Levantar la base de datos
docker-compose up -d

# Verificar que está corriendo
docker-compose ps
```

---

## Mapa Completo de Archivos

Al completar todas las fases, tu proyecto tendrá esta estructura:

```
project-mobauto/
├── app/
│   ├── app.vue
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── SectionTitle.vue
│   │   │   ├── TestimonialCard.vue
│   │   │   └── ContactForm.vue
│   │   ├── booking/
│   │   │   └── DateTimePicker.vue
│   │   ├── admin/
│   │   └── client/
│   ├── composables/
│   │   └── useAuth.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── client.vue
│   │   └── admin.vue
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── pages/
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── register.vue
│   │   ├── servicios/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── reservar/
│   │   │   └── index.vue
│   │   ├── blog/
│   │   │   └── index.vue
│   │   ├── mi-cuenta/
│   │   │   ├── index.vue
│   │   │   ├── citas.vue
│   │   │   ├── vehiculos.vue
│   │   │   └── perfil.vue
│   │   └── admin/
│   │       └── index.vue
│   ├── plugins/
│   │   └── auth.ts
│   ├── stores/
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── services-data.ts
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.post.ts
│   │   │   ├── login.post.ts
│   │   │   └── me.get.ts
│   │   ├── contact.post.ts
│   │   ├── appointments/
│   │   │   ├── slots.get.ts
│   │   │   └── index.post.ts
│   │   └── admin/
│   │       └── appointments.get.ts
│   └── utils/
│       ├── db.ts
│       ├── auth.ts
│       └── appointments.ts
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── PLANIFICACION_PROYECTO.md
```

---

## Glosario Rápido

| Término | Definición |
|---------|-----------|
| **SSR** | Server-Side Rendering: HTML se genera en el servidor, mejor para SEO |
| **SPA** | Single Page Application: todo se carga una vez, navegación instantánea |
| **Composable** | Función reutilizable que usa reactividad de Vue (`useAuth()`, `useRoute()`) |
| **Store** | Almacén global de estado accesible desde cualquier componente |
| **Middleware** | Código que se ejecuta antes de una acción (antes de cargar página, antes de API) |
| **Plugin** | Código que se ejecuta una vez al arrancar la app |
| **Layout** | Plantilla que envuelve páginas (header + footer + sidebar) |
| **Slot** | "Hueco" en un componente donde se inyecta contenido externo |
| **Props** | Datos que pasan de padre a hijo |
| **Emit** | Eventos que pasan de hijo a padre |
| **ref()** | Variable reactiva para valores simples |
| **reactive()** | Variable reactiva para objetos |
| **computed()** | Valor derivado que se recalcula automáticamente |
| **watch()** | Ejecuta código cuando una variable cambia |
| **$fetch** | Función de Nuxt para peticiones HTTP (mejor que fetch nativo) |
| **JWT** | JSON Web Token: token firmado para autenticación |
| **Hash** | Transformación irreversible de un dato (ej: contraseña → hash) |
| **CRUD** | Create, Read, Update, Delete: las 4 operaciones básicas |
| **REST API** | API que usa URLs + métodos HTTP (GET, POST, PUT, DELETE) |
| **Endpoint** | Una URL específica de una API (ej: POST /api/auth/login) |

---

**¡Felicidades!** Si has llegado hasta aquí, ya tienes las bases para construir la aplicación completa. Cada fase se puede implementar copiando el código de esta guía y adaptándolo a tus necesidades.

**Orden recomendado de implementación:**
1. Fase 0: Setup → Ejecuta los comandos, crea los archivos, verifica que `npm run dev` funciona.
2. Fase 1: Auth → Crea las APIs y páginas de login/registro.
3. Fase 2: Landing → Construye la página pública.
4. Fase 3: Reservas → El sistema de citas.
5. Fase 4-5: Portales → Cliente y Admin.
6. Fase 6-8: Mejoras, testing y deploy.
