<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="person_add" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Crear Cuenta</h1>
        <p class="text-gray-500 mt-2">Regístrate para reservar citas online</p>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Nombre y Apellidos en fila -->
          <div class="grid grid-cols-2 gap-4">
            <q-input
              v-model="form.firstName"
              label="Nombre"
              outlined
              :rules="[(val: string) => !!val || 'Obligatorio']"
            />
            <q-input
              v-model="form.lastName"
              label="Apellidos"
              outlined
              :rules="[(val: string) => !!val || 'Obligatorio']"
            />
          </div>

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (val: string) => !!val || 'Obligatorio',
              (val: string) => val.includes('@') || 'Email no válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.phone"
            label="Teléfono (opcional)"
            type="tel"
            outlined
          >
            <template #prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'Obligatoria',
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
            label="Confirmar Contraseña"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[
              (val: string) => !!val || 'Confirma tu contraseña',
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
            label="Crear Cuenta"
            class="w-full"
            size="lg"
            :loading="loading"
            unelevated
            no-caps
          />
        </form>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <p class="text-gray-500">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </NuxtLink>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Crear Cuenta - MobautoRomero',
  description: 'Regístrate en Mobauto para gestionar tus citas y vehículos.',
})

const { register, loading: authLoading } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const error = ref('')
const loading = computed(() => authLoading.value)

async function onSubmit() {
  // Validación manual extra
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  error.value = ''
  try {
    await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || undefined,
    })
  } catch (err: any) {
    error.value = err?.data?.message || err?.statusMessage || 'Error al crear la cuenta'
  }
}
</script>