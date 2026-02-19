<template>
  <q-card class="w-full">
    <q-card-section>
      <h3 class="text-xl font-bold mb-4">Contáctanos</h3>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <q-input v-model="form.name" label="Nombre completo" outlined
          :rules="[(v: string) => !!v || 'Obligatorio']" />
        <q-input v-model="form.email" label="Email" type="email" outlined
          :rules="[(v: string) => !!v || 'Obligatorio']" />
        <q-input v-model="form.phone" label="Teléfono (opcional)" outlined />
        <q-input v-model="form.message" label="Mensaje" type="textarea" outlined
          :rules="[(v: string) => !!v || 'Escribe tu mensaje']" />

        <q-banner v-if="success" class="bg-green-50 text-green-700 rounded-lg">
          Mensaje enviado correctamente. Te contactaremos pronto.
        </q-banner>

        <q-btn type="submit" color="primary" label="Enviar Mensaje"
          class="w-full" unelevated no-caps :loading="loading" />
      </form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const form = reactive({ name: '', email: '', phone: '', message: '' })
const loading = ref(false)
const success = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    })
    success.value = true
    // Limpiar formulario
    Object.assign(form, { name: '', email: '', phone: '', message: '' })
  } catch (err) {
    console.error('Error al enviar:', err)
  } finally {
    loading.value = false
  }
}
</script>