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