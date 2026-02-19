<template>
  <div class="min-h-screen flex flex-col">
    <!-- ─── HEADER / NAVEGACIÓN ─── -->
    <header class="bg-white shadow-sm sticky top-0 z-30">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <CommonLogo />

          <!-- Menú desktop (visible >= 768px) -->
          <div class="desktop-nav">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="nav-link"
              active-class="nav-link--active"
            >
              {{ link.label }}
            </NuxtLink>

            <div class="nav-separator" />

            <!-- No autenticado -->
            <template v-if="!isAuthenticated">
              <NuxtLink to="/login" class="nav-link" active-class="nav-link--active">
                Iniciar Sesión
              </NuxtLink>
              <q-btn to="/reservar" color="primary" label="Pedir Cita"
                unelevated rounded no-caps size="md" style="margin-left: 8px" />
            </template>

            <!-- Autenticado -->
            <template v-else>
              <q-btn flat no-caps color="primary" style="margin-left: 8px">
                <div class="flex items-center gap-2">
                  <q-icon name="account_circle" size="24px" />
                  <span class="text-sm">{{ user?.firstName || user?.email }}</span>
                  <q-icon name="arrow_drop_down" size="20px" />
                </div>
                <q-menu>
                  <q-list style="min-width: 220px">
                    <q-item-label header class="text-xs text-gray-500">{{ user?.email }}</q-item-label>
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

          <!-- Botón hamburguesa (visible < 768px) -->
          <div class="mobile-toggle">
            <q-btn flat round icon="menu" @click="menuOpen = true" />
          </div>
        </div>
      </nav>
    </header>

    <!-- ─── DRAWER MÓVIL ─── -->
    <Transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="menuOpen = false"
      />
    </Transition>
    <div
      class="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300"
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

        <div class="border-t my-3 mx-4" />

        <template v-if="!isAuthenticated">
          <NuxtLink
            to="/login"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            @click="menuOpen = false"
          >
            <q-icon name="login" size="24px" />
            <span>Iniciar Sesión</span>
          </NuxtLink>
          <div class="px-4 mt-2">
            <q-btn to="/reservar" color="primary" label="Pedir Cita"
              unelevated rounded no-caps class="w-full" @click="menuOpen = false" />
          </div>
        </template>
        <template v-else>
          <div class="px-4 py-2 text-sm text-gray-500">{{ user?.email }}</div>
          <NuxtLink
            to="/mi-cuenta"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            @click="menuOpen = false"
          >
            <q-icon name="dashboard" size="24px" />
            <span>Mi Cuenta</span>
          </NuxtLink>
          <NuxtLink
            to="/reservar"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            @click="menuOpen = false"
          >
            <q-icon name="event" size="24px" />
            <span>Reservar Cita</span>
          </NuxtLink>
          <button
            class="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition-colors"
            @click="logout(); menuOpen = false"
          >
            <q-icon name="logout" size="24px" />
            <span>Cerrar Sesión</span>
          </button>
        </template>
      </nav>
    </div>

    <!-- ─── CONTENIDO PRINCIPAL ─── -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- ─── FOOTER ─── -->
    <footer class="bg-gray-900 text-gray-300 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Mobauto</h3>
            <p class="text-sm">
              Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid.
              Más de 10 años de experiencia. Diagnóstico preciso y presupuestos sin compromiso.
            </p>
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Enlaces</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/servicios" class="hover:text-white">Servicios</NuxtLink></li>
              <li><NuxtLink to="/reservar" class="hover:text-white">Reservar Cita</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-white">Blog</NuxtLink></li>
            </ul>
          </div>
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
const { isAuthenticated, user, logout } = useAuth()

const navLinks = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/servicios', label: 'Servicios', icon: 'build' },
  { to: '/reservar', label: 'Reservar Cita', icon: 'event' },
  { to: '/blog', label: 'Blog', icon: 'article' },
]
</script>

<style scoped>
/* ─── Menú desktop: oculto en móvil, visible en escritorio ─── */
.desktop-nav {
  display: none;
  align-items: center;
  gap: 4px;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

/* ─── Hamburguesa: visible en móvil, oculta en escritorio ─── */
.mobile-toggle {
  display: block;
}

@media (min-width: 768px) {
  .mobile-toggle {
    display: none;
  }
}

/* ─── Estilos de los links del nav ─── */
.nav-link {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
}

.nav-link:hover {
  color: #1B3A5C;
  background-color: #f9fafb;
}

.nav-link--active {
  color: #1B3A5C;
  background-color: #eff6ff;
  font-weight: 600;
}

/* ─── Separador vertical ─── */
.nav-separator {
  width: 1px;
  height: 24px;
  background-color: #e5e7eb;
  margin: 0 8px;
}

/* ─── Transición del fondo oscuro del drawer ─── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>