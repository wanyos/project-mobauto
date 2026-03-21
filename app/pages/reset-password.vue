<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="lock_reset" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Nueva Contraseña</h1>
        <p class="text-gray-500 mt-2">Introduce tu nueva contraseña</p>
      </q-card-section>

      <q-card-section v-if="!success">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <q-input
            v-model="form.password"
            label="Nueva contraseña"
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
            label="Confirmar contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'Confirma la contraseña',
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
            label="Cambiar contraseña"
            class="w-full"
            size="lg"
            :loading="loading"
            unelevated
            no-caps
          />
        </form>
      </q-card-section>

      <!-- Estado de éxito -->
      <q-card-section v-else class="text-center py-8">
        <q-icon name="check_circle" size="48px" color="positive" />
        <p class="text-gray-600 mt-4">Tu contraseña ha sido actualizada correctamente.</p>
        <q-btn
          color="primary"
          label="Iniciar sesión"
          class="mt-4"
          to="/login"
          unelevated
          no-caps
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Restablecer Contraseña - MobautoRomero',
  description: 'Establece una nueva contraseña para tu cuenta.',
})

const route = useRoute()
const token = route.query.token as string

// Si no hay token, redirigir
if (!token) {
  navigateTo('/forgot-password')
}

const form = reactive({
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function onSubmit() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password: form.password },
    })
    success.value = true
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; statusMessage?: string }
    error.value = e?.data?.message || e?.statusMessage || 'Error al cambiar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>
