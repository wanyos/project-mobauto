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
          <span class="text-sm text-gray-300 hidden sm:inline">{{ user?.email }}</span>
          <q-btn flat round icon="logout" size="sm" color="white" @click="logout" />
        </div>
      </div>
    </header>

    <!-- Overlay para cerrar sidebar en móvil -->
    <div
      v-if="drawer && $q.screen.lt.md"
      class="fixed inset-0 bg-black/50 z-40"
      @click="drawer = false"
    />

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="bg-gray-800 text-white transition-all duration-300 z-50 shrink-0"
        :class="[
          drawer ? 'w-64' : 'w-0 overflow-hidden',
          $q.screen.lt.md ? 'fixed top-14 bottom-0 left-0' : 'relative'
        ]"
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
            @click="$q.screen.lt.md && (drawer = false)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>{{ link.label }}</q-item-section>
          </q-item>
        </q-list>
      </aside>

      <!-- Contenido -->
      <main class="flex-1 p-3 sm:p-6 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()
const $q = useQuasar()
const drawer = ref(!$q.screen.lt.md)

const adminLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/citas', icon: 'event', label: 'Citas' },
  { to: '/admin/clientes', icon: 'people', label: 'Clientes' },
  { to: '/admin/configuracion', icon: 'settings', label: 'Configuración' },
]
</script>