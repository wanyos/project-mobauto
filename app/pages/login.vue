<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <q-card class="w-full max-w-md">
      <q-card-section class="text-center">
        <q-icon name="lock" size="48px" color="primary" />
        <h1 class="text-2xl font-bold mt-4">Iniciar Sesión</h1>
        <p class="text-gray-500 mt-2">Accede a tu cuenta de Mobauto</p>
      </q-card-section>

      <q-card-section>
        <!-- ─── FORMULARIO ─── -->
        <!--
          @submit.prevent="onSubmit"
          - @submit: escucha el evento "submit" del formulario
          - .prevent: ejecuta preventDefault() (evita que la página se recargue)
          - ="onSubmit": llama a nuestra función
        -->
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Campo Email -->
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (val: string) => !!val || 'El email es obligatorio',
              (val: string) => val.includes('@') || 'Email no válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- Campo Contraseña -->
          <q-input
            v-model="form.password"
            label="Contraseña"
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
            <!-- Botón para mostrar/ocultar contraseña -->
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Mensaje de error -->
          <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg">
            {{ error }}
          </q-banner>

          <!-- Botón Submit -->
          <q-btn
            type="submit"
            color="primary"
            label="Iniciar Sesión"
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
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="text-blue-600 font-medium hover:underline">
            Regístrate aquí
          </NuxtLink>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// ─── SEO ───
useSeoMeta({
  title: 'Iniciar Sesión - Mobauto',
  description: 'Accede a tu cuenta de Mobauto para gestionar tus citas y vehículos.',
})

// ─── Estado del formulario ───
const { login, loading: authLoading } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const error = ref('')
const loading = computed(() => authLoading.value)

// ─── Manejar submit ───
async function onSubmit() {
  error.value = '' // Limpiar error previo
  try {
    await login(form.email, form.password)
    // Si llega aquí, login exitoso → el composable redirige a /mi-cuenta
  } catch (err: any) {
    // Mostrar error al usuario
    error.value = err?.data?.message || err?.statusMessage || 'Error al iniciar sesión'
  }
}
</script>