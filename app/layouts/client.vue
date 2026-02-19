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