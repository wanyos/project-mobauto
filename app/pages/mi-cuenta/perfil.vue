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

    <!-- Cambiar contraseña -->
    <h2 class="text-xl font-bold mt-8 mb-4">Cambiar contraseña</h2>
    <q-card class="max-w-lg">
      <q-card-section class="space-y-4">
        <q-input v-model="passwords.current" label="Contraseña actual" outlined
          :type="showCurrent ? 'text' : 'password'">
          <template #append>
            <q-icon :name="showCurrent ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showCurrent = !showCurrent" />
          </template>
        </q-input>
        <q-input v-model="passwords.newPassword" label="Nueva contraseña" outlined
          :type="showNew ? 'text' : 'password'" hint="Mínimo 6 caracteres">
          <template #append>
            <q-icon :name="showNew ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showNew = !showNew" />
          </template>
        </q-input>
        <q-input v-model="passwords.confirm" label="Confirmar nueva contraseña" outlined
          :type="showConfirm ? 'text' : 'password'"
          :error="passwords.confirm.length > 0 && passwords.confirm !== passwords.newPassword"
          error-message="Las contraseñas no coinciden">
          <template #append>
            <q-icon :name="showConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showConfirm = !showConfirm" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" label="Cambiar contraseña" no-caps unelevated
          @click="changePassword" :loading="changingPassword"
          :disable="!passwords.current || !passwords.newPassword || passwords.newPassword !== passwords.confirm" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mi Perfil - MobautoRomero' })

const { $q } = useNuxtApp()
const auth = useAuthStore()
const saving = ref(false)
const changingPassword = ref(false)

const profile = reactive({
  email: auth.user?.email ?? '',
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  phone: auth.user?.phone ?? '',
})

const passwords = reactive({
  current: '',
  newPassword: '',
  confirm: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

async function changePassword() {
  changingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      },
    })
    passwords.current = ''
    passwords.newPassword = ''
    passwords.confirm = ''
    $q.notify({ type: 'positive', message: 'Contraseña actualizada correctamente' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al cambiar la contraseña'
    $q.notify({ type: 'negative', message })
  } finally {
    changingPassword.value = false
  }
}

async function saveProfile() {
  saving.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/auth/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      },
    })
    // Actualizar el store con los nuevos datos
    auth.user = response.data
  } catch (err) {
    console.error('Error guardando perfil:', err)
  } finally {
    saving.value = false
  }
}
</script>
