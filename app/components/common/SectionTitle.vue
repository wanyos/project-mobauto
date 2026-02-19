<!-- Componente reutilizable para títulos de sección -->
<!--
  Uso: <SectionTitle title="Servicios" subtitle="Lo que ofrecemos" />
-->
<template>
  <div class="text-center mb-12">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900">{{ title }}</h2>
    <p v-if="subtitle" class="text-lg text-gray-500 mt-3 max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string // ? = opcional
}>()
</script>