<template>
  <div>
    <!-- ─── HERO ─── -->
    <section class="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F8A] text-white py-20 md:py-28">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold font-heading mb-6">
          Chapa, pintura y mecánica en Humanes de Madrid
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Más de 10 años cuidando tu vehículo. Diagnóstico preciso,
          presupuesto sin compromiso y la calidad que nos avala.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn to="/reservar" color="white" text-color="primary"
            label="Reservar Cita" size="lg" unelevated rounded no-caps icon="event" />
          <q-btn to="/servicios" outline color="white"
            label="Ver Servicios" size="lg" rounded no-caps icon="build" />
        </div>
        <!-- Indicadores de confianza (datos reales de Mobauto) -->
        <div class="flex flex-wrap justify-center gap-8 mt-12 text-blue-100">
          <div class="text-center">
            <p class="text-3xl font-bold text-white">4.8★</p>
            <p class="text-sm">Valoración en Google</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-white">+58</p>
            <p class="text-sm">Opiniones de clientes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-white">+10</p>
            <p class="text-sm">Años de experiencia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SERVICIOS DESTACADOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="Nuestros Servicios"
          subtitle="Ofrecemos una amplia gama de servicios para mantener tu vehículo en perfectas condiciones."
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <q-card
            v-for="service in featuredServices"
            :key="service.slug"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/servicios/${service.slug}`)"
          >
            <q-card-section class="text-center py-8">
              <q-icon :name="service.icon" size="56px" color="primary" />
              <h3 class="text-xl font-semibold mt-4 mb-2">{{ service.name }}</h3>
              <p class="text-gray-600">{{ service.shortDescription }}</p>
              <p class="text-primary font-semibold mt-3">{{ service.priceRange }}</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center mt-8">
          <q-btn to="/servicios" color="primary" outline label="Ver todos los servicios"
            no-caps rounded icon-right="arrow_forward" />
        </div>
      </div>
    </section>

    <!-- ─── POR QUÉ ELEGIRNOS ─── -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="¿Por qué elegirnos?"
          subtitle="Nos diferenciamos por la calidad, transparencia y atención personalizada."
        />
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="reason in reasons" :key="reason.title" class="text-center p-6">
            <q-icon :name="reason.icon" size="48px" color="primary" />
            <h3 class="text-lg font-semibold mt-4 mb-2">{{ reason.title }}</h3>
            <p class="text-gray-600 text-sm">{{ reason.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIOS ─── -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <CommonSectionTitle
          title="Lo que dicen nuestros clientes"
          subtitle="La satisfacción de nuestros clientes es nuestra mejor carta de presentación."
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CommonTestimonialCard
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            v-bind="testimonial"
          />
        </div>
      </div>
    </section>

    <!-- ─── CONTACTO ─── -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <!-- Info de contacto -->
          <div>
            <h2 class="text-3xl font-bold mb-6">¿Tienes alguna duda?</h2>
            <p class="text-gray-600 mb-8">
              Contáctanos y te responderemos lo antes posible.
              También puedes reservar tu cita directamente online.
            </p>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <q-icon name="location_on" size="24px" color="primary" />
                <span>C. del Álamo, 44, 28970 Humanes de Madrid</span>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="phone" size="24px" color="primary" />
                <a href="tel:916041262" class="hover:text-blue-600">916 04 12 62</a>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="email" size="24px" color="primary" />
                <span>info@mobauto.es</span>
              </div>
              <div class="flex items-center gap-4">
                <q-icon name="schedule" size="24px" color="primary" />
                <div>
                  <p>{{ diasLaboralesTexto }}: {{ horarioTexto }}</p>
                  <p v-if="diasCerradoTexto" class="text-sm text-gray-400">{{ diasCerradoTexto }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Formulario -->
          <CommonContactForm />
        </div>
      </div>
    </section>

    <!-- ─── CTA FINAL ─── -->
    <section class="py-16 bg-[#234B73] text-white text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold font-heading mb-4">¿Necesitas presupuesto?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Llámanos al 916 04 12 62 o reserva tu cita online. Presupuesto sin compromiso.
        </p>
        <q-btn to="/reservar" color="white" text-color="primary"
          label="Reservar Cita Ahora" size="lg" unelevated rounded no-caps />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DIAS_SEMANA } from '~/utils/businessConstants'

// ─── Horario dinámico (desde la BD vía composable) ───
const { config, cargarConfig } = useBusinessConfig()
onMounted(() => { cargarConfig() })

// Nombres en inglés para Schema.org JSON-LD
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const diasLaboralesTexto = computed(() => {
  const workDays = [...config.value.workDays].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
  const nombres = workDays.map(d => DIAS_SEMANA.find(ds => ds.value === d)?.label ?? '')
    .filter(Boolean)
  if (nombres.length === 0) return ''
  if (nombres.length <= 2) return nombres.join(' y ')
  // Comprobar si son consecutivos (Lunes a Viernes, etc.)
  const esConsecutivo = workDays.every((d, i) => {
    if (i === 0) return true
    const prev = workDays[i - 1] ?? 0
    return (d === 0 ? 7 : d) - (prev === 0 ? 7 : prev) === 1
  })
  if (esConsecutivo) return `${nombres[0]} a ${nombres[nombres.length - 1]}`
  return nombres.join(', ')
})

const horarioTexto = computed(() => {
  const { morningOpen, morningClose, afternoonEnabled, afternoonOpen, afternoonClose } = config.value
  let texto = `${morningOpen}–${morningClose}`
  if (afternoonEnabled) texto += ` / ${afternoonOpen}–${afternoonClose}`
  return texto
})

const diasCerradoTexto = computed(() => {
  const cerrados = DIAS_SEMANA.filter(d => !config.value.workDays.includes(d.value))
  if (cerrados.length === 0) return ''
  return cerrados.map(d => d.label).join(' y ') + ': Cerrado'
})

// ─── SEO ───
useSeoMeta({
  title: 'MobautoRomero',
  description: 'Mobauto: taller de chapa, pintura y reparación en Humanes de Madrid. +10 años de experiencia, 4.8★ en Google. Presupuesto sin compromiso. Tel: 916 04 12 62',
  ogTitle: 'Mobauto — Taller en Humanes de Madrid',
  ogDescription: 'Chapa, pintura y reparación de vehículos. Presupuesto sin compromiso.',
  ogType: 'website',
})

// ─── Structured Data (JSON-LD) para SEO ───
// Esto le dice a Google "somos un negocio de automoción en esta dirección"
// Aparecerá como rich snippet en los resultados de búsqueda.
const jsonLd = computed(() => {
  const dayOfWeek = config.value.workDays.map(d => DAY_NAMES_EN[d])
  const specs = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek,
      opens: config.value.morningOpen,
      closes: config.value.morningClose,
    },
    ...(config.value.afternoonEnabled ? [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek,
      opens: config.value.afternoonOpen,
      closes: config.value.afternoonClose,
    }] : []),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    name: 'Mobauto',
    description: 'Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C. del Álamo, 44',
      addressLocality: 'Humanes de Madrid',
      addressRegion: 'Madrid',
      postalCode: '28970',
      addressCountry: 'ES',
    },
    telephone: '+34916041262',
    openingHoursSpecification: specs,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '58',
    },
    priceRange: '€€',
    url: 'https://mobautoromero.es',
  }
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(jsonLd.value)),
    },
  ],
})

// ─── Datos ───
const { data: servicesData } = await useFetch('/api/services')
const featuredServices = computed(() => (servicesData.value?.data ?? []).slice(0, 3))

const reasons = [
  { icon: 'verified', title: 'Profesionalidad', description: 'Mecánicos certificados con más de 10 años de experiencia.' },
  { icon: 'handshake', title: 'Transparencia', description: 'Presupuesto detallado sin sorpresas. Sin letra pequeña.' },
  { icon: 'schedule', title: 'Rapidez', description: 'Respetamos los plazos. Tu vehículo listo cuando lo prometemos.' },
  { icon: 'workspace_premium', title: 'Garantía', description: 'Garantía en todas nuestras reparaciones y piezas.' },
]

// Testimonios basados en opiniones reales de clientes de Mobauto
const testimonials = [
  { name: 'Roberto G.', text: 'Mis dos coches han pasado por chapa y pintura, fenomenal, mejor imposible. Grandes profesionales y con coche de sustitución gratis.', rating: 5, vehicle: 'Seat León 2019' },
  { name: 'Laura M.', text: 'Muy profesionales. Me dieron un presupuesto detallado antes de tocar nada y el resultado de la pintura fue impecable. Repetiré seguro.', rating: 5, vehicle: 'VW Polo 2021' },
  { name: 'Daniel P.', text: 'Me repararon el parachoques y quedó como nuevo. Buen trato, precio justo y cumplieron con el plazo que me dijeron.', rating: 5, vehicle: 'Hyundai Tucson 2020' },
]
</script>