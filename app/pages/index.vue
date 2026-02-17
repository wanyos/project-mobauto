<template>
  <div>
    <!-- ─── HERO SECTION ─── -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold font-heading mb-6">
          Chapa, pintura y mecánica en Humanes de Madrid
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Más de 10 años cuidando tu vehículo. Diagnóstico preciso,
          presupuesto sin compromiso y coche de sustitución.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn
            to="/reservar"
            color="white"
            text-color="primary"
            label="Reservar Cita"
            size="lg"
            unelevated
            rounded
            no-caps
            icon="event"
          />
          <q-btn
            to="/servicios"
            outline
            color="white"
            label="Ver Servicios"
            size="lg"
            rounded
            no-caps
            icon="build"
          />
        </div>
      </div>
    </section>

    <!-- ─── SERVICIOS DESTACADOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <q-card
            v-for="service in featuredServices"
            :key="service.title"
            class="hover:shadow-lg transition-shadow"
          >
            <q-card-section class="text-center">
              <q-icon :name="service.icon" size="48px" color="primary" />
              <h3 class="text-xl font-semibold mt-4 mb-2">{{ service.title }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn flat color="primary" label="Más info" no-caps :to="service.link" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ─── CTA FINAL ─── -->
    <section class="py-16 bg-blue-600 text-white text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold font-heading mb-4">¿Necesitas presupuesto?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Llámanos al 916 04 12 62 o reserva tu cita online. Sin compromiso.
        </p>
        <q-btn
          to="/reservar"
          color="white"
          text-color="primary"
          label="Reservar Cita Ahora"
          size="lg"
          unelevated
          rounded
          no-caps
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ─── SEO ───
// useSeoMeta() configura los meta tags de esta página específica.
// Esto es CRUCIAL para que Google muestre tu página correctamente en los resultados.
useSeoMeta({
  title: 'Mobauto — Taller de Chapa, Pintura y Mecánica en Humanes de Madrid',
  description: 'Taller especializado en chapa, pintura y mecánica en Humanes de Madrid. Presupuesto sin compromiso. Tel: 916 04 12 62.',
  ogTitle: 'Mobauto — Taller en Humanes de Madrid',
  ogDescription: 'Chapa, pintura y mecánica. Presupuesto sin compromiso.',
})

// ─── Datos ───
// Servicios destacados para la landing page
const featuredServices = [
  {
    title: 'Chapa y Pintura',
    description: 'Nuestra especialidad. Reparación de golpes, arañazos y pintado profesional con acabado de fábrica.',
    icon: 'format_paint',
    link: '/servicios/chapa-pintura',
  },
  {
    title: 'Cristales',
    description: 'Reparación de impactos y sustitución de lunas y parabrisas. Gestión con el seguro.',
    icon: 'window',
    link: '/servicios/cristales',
  },
  {
    title: 'Mecánica General',
    description: 'Diagnóstico y reparación de motor, frenos, suspensión, embrague y más.',
    icon: 'build',
    link: '/servicios/reparacion-general',
  },
]
</script>