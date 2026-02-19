<template>
  <q-card class="h-full">
    <q-card-section>
      <!-- Estrellas -->
      <div class="flex gap-1 mb-3">
        <q-icon
          v-for="i in 5"
          :key="i"
          name="star"
          :color="i <= rating ? 'yellow-8' : 'grey-4'"
          size="20px"
        />
      </div>
      <!-- Texto del testimonio -->
      <p class="text-gray-600 italic mb-4">"{{ text }}"</p>
      <!-- Autor -->
      <div class="flex items-center gap-3">
        <q-avatar color="primary" text-color="white" size="40px">
          {{ initials }}
        </q-avatar>
        <div>
          <p class="font-semibold text-gray-900">{{ name }}</p>
          <p class="text-sm text-gray-500">{{ vehicle }}</p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  text: string
  rating: number
  vehicle: string
}>()

// Computed: valor que se recalcula automáticamente cuando cambian sus dependencias.
// Aquí extrae las iniciales del nombre: "Juan García" → "JG"
const initials = computed(() => {
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>