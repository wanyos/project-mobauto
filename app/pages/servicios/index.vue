<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F8A] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">Nuestros Servicios</h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Ofrecemos servicios profesionales de mantenimiento, reparación y diagnóstico
          para todo tipo de vehículos.
        </p>
      </div>
    </section>

    <!-- Lista de servicios -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <q-card
            v-for="service in services"
            :key="service.slug"
            class="hover:shadow-lg transition-shadow"
          >
            <q-card-section>
              <div class="flex items-center gap-3 mb-4">
                <q-icon :name="service.icon" size="36px" color="primary" />
                <h2 class="text-xl font-bold">{{ service.name }}</h2>
              </div>
              <p class="text-gray-600 mb-4">{{ service.shortDescription }}</p>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span><q-icon name="schedule" size="16px" /> {{ service.estimatedDuration }}</span>
                <span class="font-semibold text-primary text-base">{{ service.priceRange }}</span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn flat color="primary" label="Más detalles" no-caps
                :to="`/servicios/${service.slug}`" />
              <q-space />
              <q-btn flat color="positive" label="Reservar" no-caps
                :to="`/reservar?servicio=${service.slug}`" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Servicios — Chapa, Pintura, Cristales y Mecánica | Mobauto Humanes de Madrid',
  description: 'Servicios de chapa y pintura, reparación de cristales, mecánica general, mantenimiento y pre-ITV en Humanes de Madrid. Presupuesto sin compromiso.',
})

const services = getServices()
</script>