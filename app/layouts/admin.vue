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
]
</script>