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

    <!-- ─── MENÚ MÓVIL (panel lateral con Tailwind) ─── -->
    <!-- Fondo oscuro -->
    <div
      v-if="menuOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="menuOpen = false"
    />
    <!-- Panel -->
    <div
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300"
      :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex items-center justify-between px-4 h-16 border-b">
        <span class="text-lg font-bold">Mobauto</span>
        <q-btn flat round icon="close" size="sm" @click="menuOpen = false" />
      </div>
      <nav class="py-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          @click="menuOpen = false"
        >
          <q-icon :name="link.icon" size="24px" />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- ─── CONTENIDO PRINCIPAL + FOOTER ─── -->
    <!-- El footer va dentro del área scrollable para que no quede cortado -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- ─── FOOTER ─── -->
    <footer class="bg-gray-900 text-gray-300 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Columna 1: Info -->
            <div>
              <h3 class="text-white text-lg font-bold mb-4">Mobauto</h3>
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
          <div class="border-t border-gray-700 mt-4 pt-4 text-center text-sm">
            <p>&copy; {{ new Date().getFullYear() }} Mobauto — Taller en Humanes de Madrid. Todos los derechos reservados.</p>
          </div>
        </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/servicios', label: 'Servicios', icon: 'build' },
  { to: '/reservar', label: 'Reservar Cita', icon: 'event' },
  { to: '/blog', label: 'Blog', icon: 'article' },
]
</script>
