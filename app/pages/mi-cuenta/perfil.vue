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