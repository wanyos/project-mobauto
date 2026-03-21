<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="lock_reset" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Recuperar Contraseña</h1>
        <p class="text-gray-500 mt-2">Introduce tu email y te enviaremos un enlace</p>
      </q-card-section>

      <q-card-section v-if="!sent">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            placeholder="Ej: cliente@email.com"
            :rules="[
              (val: string) => !!val || 'El email es obligatorio',
              (val: string) => val.includes('@') || 'Email no válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            label="Enviar enlace"
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
        <q-icon name="mark_email_read" size="48px" color="positive" />
        <p class="text-gray-600 mt-4">
          Si el email está registrado, recibirás un enlace para restablecer tu contraseña.
        </p>
        <p class="text-gray-400 text-sm mt-2">Revisa también la carpeta de spam.</p>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <NuxtLink to="/login" class="text-blue-600 font-medium hover:underline">
          Volver al inicio de sesión
        </NuxtLink>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Recuperar Contraseña - MobautoRomero',
  description: 'Recupera el acceso a tu cuenta de MobautoRomero.',
})

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    sent.value = true
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; statusMessage?: string }
    error.value = e?.data?.message || e?.statusMessage || 'Error al enviar el enlace'
  } finally {
    loading.value = false
  }
}
</script>
