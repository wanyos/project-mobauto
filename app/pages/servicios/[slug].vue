<!-- app/pages/servicios/[slug].vue → URL: /servicios/cambio-aceite, /servicios/frenos, etc. -->
<!--
  [slug] es un parámetro dinámico.
  Nuxt extrae el valor de la URL y lo pone disponible via useRoute().

  /servicios/cambio-aceite → route.params.slug = "cambio-aceite"
  /servicios/frenos        → route.params.slug = "frenos"
-->
<template>
  <div v-if="service">
    <!-- Header del servicio -->
    <section class="bg-gradient-to-r from-mobauto-dark to-mobauto text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <NuxtLink to="/servicios" class="text-blue-200 hover:text-white mb-4 inline-flex items-center gap-1">
          <q-icon name="arrow_back" /> Volver a servicios
        </NuxtLink>
        <div class="flex items-center gap-4 mt-4">
          <q-icon :name="service.icon" size="56px" />
          <div>
            <h1 class="text-4xl font-bold">{{ service.name }}</h1>
            <p class="text-blue-100 text-lg mt-2">{{ service.shortDescription }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Columna principal -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Descripción -->
            <div>
              <h2 class="text-2xl font-bold mb-4">Descripción del servicio</h2>
              <p class="text-gray-600 text-lg leading-relaxed">{{ service.fullDescription }}</p>
            </div>

            <!-- Qué incluye -->
            <div>
              <h2 class="text-2xl font-bold mb-4">¿Qué incluye?</h2>
              <ul class="space-y-3">
                <li v-for="feature in service.features" :key="feature"
                  class="flex items-start gap-3">
                  <q-icon name="check_circle" color="positive" size="24px" class="mt-0.5" />
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- FAQs -->
            <div v-if="service.faqs.length">
              <h2 class="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
              <q-list bordered separator class="rounded-lg">
                <q-expansion-item
                  v-for="(faq, i) in service.faqs"
                  :key="i"
                  :label="faq.question"
                  header-class="font-medium"
                >
                  <q-card>
                    <q-card-section class="text-gray-600">
                      {{ faq.answer }}
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </div>

          <!-- Sidebar -->
          <div>
            <q-card class="sticky top-4">
              <q-card-section>
                <h3 class="text-lg font-bold mb-4">Resumen</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Duración estimada</span>
                    <span class="font-medium">{{ service.estimatedDuration }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Precio</span>
                    <span class="font-bold text-primary text-lg">{{ service.priceRange }}</span>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions vertical>
                <q-btn color="primary" label="Reservar este servicio" no-caps
                  unelevated class="w-full" size="lg"
                  :to="`/reservar?servicio=${service.slug}`" />
                <q-btn flat color="primary" label="Contactar para más info" no-caps
                  class="w-full" to="/#contacto" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Si el servicio no existe -->
  <div v-else class="max-w-7xl mx-auto px-4 py-16 text-center">
    <q-icon name="error_outline" size="64px" color="grey" />
    <h1 class="text-2xl font-bold mt-4">Servicio no encontrado</h1>
    <p class="text-gray-500 mt-2 mb-6">El servicio que buscas no existe.</p>
    <q-btn to="/servicios" color="primary" label="Ver todos los servicios" no-caps />
  </div>
</template>

<script setup lang="ts">
// ─── Obtener el slug de la URL ───
const route = useRoute()
const slug = route.params.slug as string

// ─── Buscar el servicio en la API ───
const { data } = await useFetch(`/api/services/${slug}`)
const service = computed(() => data.value?.data ?? null)

// ─── SEO dinámico ───
useSeoMeta({
  title: () => service.value ? `${service.value.name} - Mobauto Taller Mecánico` : 'Servicio no encontrado - Mobauto',
  description: () => service.value?.fullDescription?.slice(0, 160) ?? '',
  ogTitle: () => service.value ? `${service.value.name} - Mobauto` : '',
  ogDescription: () => service.value?.shortDescription ?? '',
})

// FAQ Schema (le dice a Google que esta página tiene FAQs)
useHead({
  script: computed(() =>
    service.value?.faqs?.length
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: service.value.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          },
        ]
      : []
  ),
})
</script>