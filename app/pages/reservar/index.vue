<!-- app/pages/reservar/index.vue → URL: /reservar -->
<!--
  Stepper = asistente paso a paso.
  El usuario avanza por pasos: Servicio → Vehículo → Fecha → Datos → Confirmar
-->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Reservar Cita</h1>

    <q-stepper
      v-model="step"
      color="primary"
      animated
    >
      <!-- ─── PASO 1: Seleccionar servicios ─── -->
      <q-step :name="1" title="Servicios" icon="build" :done="step > 1">
        <p class="text-gray-600 mb-4">Selecciona los servicios que necesitas:</p>
        <div class="space-y-2">
          <q-checkbox
            v-for="service in availableServices"
            :key="service.slug"
            v-model="form.services"
            :val="service.slug"
            :label="`${service.name} — ${service.priceRange}`"
          />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" no-caps
            :disable="form.services.length === 0"
            @click="step = 2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 2: Datos del vehículo ─── -->
      <q-step :name="2" title="Vehículo" icon="directions_car" :done="step > 2">
        <div class="space-y-4">
          <q-input v-model="form.vehicleBrand" label="Marca" outlined
            placeholder="Ej: Toyota, Seat, VW..." />
          <q-input v-model="form.vehicleModel" label="Modelo" outlined
            placeholder="Ej: Corolla, León, Golf..." />
          <q-input v-model="form.vehicleYear" label="Año" outlined type="number"
            placeholder="Ej: 2020" />
          <q-input v-model="form.vehiclePlate" label="Matrícula" outlined
            placeholder="Ej: 1234 ABC" />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" no-caps @click="step = 3" />
          <q-btn flat label="Atrás" no-caps @click="step = 1" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 3: Fecha y hora ─── -->
      <q-step :name="3" title="Fecha y Hora" icon="event" :done="step > 3">
        <BookingDateTimePicker
          @update:date="(d) => form.scheduledDate = d"
          @update:time="(t) => form.scheduledTime = t"
        />
        <q-stepper-navigation class="mt-4">
          <q-btn color="primary" label="Siguiente" no-caps
            :disable="!form.scheduledDate || !form.scheduledTime"
            @click="step = 4" />
          <q-btn flat label="Atrás" no-caps @click="step = 2" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 4: Datos de contacto ─── -->
      <q-step :name="4" title="Tus Datos" icon="person" :done="step > 4">
        <div class="space-y-4">
          <q-input v-model="form.customerName" label="Nombre completo" outlined
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerEmail" label="Email" type="email" outlined
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerPhone" label="Teléfono" outlined />
          <q-input v-model="form.notes" label="Notas adicionales (opcional)"
            type="textarea" outlined />
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Revisar y Confirmar" no-caps
            :disable="!form.customerName || !form.customerEmail"
            @click="step = 5" />
          <q-btn flat label="Atrás" no-caps @click="step = 3" class="ml-2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 5: Confirmación ─── -->
      <q-step :name="5" title="Confirmar" icon="check">
        <q-card bordered class="mb-4">
          <q-card-section>
            <h3 class="font-bold text-lg mb-4">Resumen de tu cita</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Servicios:</span>
                <span class="font-medium">{{ selectedServiceNames.join(', ') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Vehículo:</span>
                <span>{{ form.vehicleBrand }} {{ form.vehicleModel }} ({{ form.vehiclePlate }})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Fecha:</span>
                <span class="font-medium">{{ form.scheduledDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Hora:</span>
                <span class="font-medium">{{ form.scheduledTime }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Contacto:</span>
                <span>{{ form.customerName }} ({{ form.customerEmail }})</span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-banner v-if="error" class="bg-red-50 text-red-700 rounded-lg mb-4">
          {{ error }}
        </q-banner>

        <q-stepper-navigation>
          <q-btn color="primary" label="Confirmar Cita" no-caps
            icon="check" :loading="loading" @click="submitBooking" />
          <q-btn flat label="Atrás" no-caps @click="step = 4" class="ml-2" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <!-- ─── Diálogo de éxito ─── -->
    <q-dialog v-model="showSuccess" persistent>
      <q-card class="max-w-sm">
        <q-card-section class="text-center py-8">
          <q-icon name="check_circle" size="64px" color="positive" />
          <h2 class="text-2xl font-bold mt-4">¡Cita Reservada!</h2>
          <p class="text-gray-500 mt-2">
            Te hemos enviado un email de confirmación a {{ form.customerEmail }}.
          </p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Volver al inicio" no-caps to="/" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Reservar Cita Online - Mobauto',
  description: 'Reserva tu cita en nuestro taller mecánico de forma rápida y sencilla.',
})

// ─── Estado ───
const step = ref(1)
const loading = ref(false)
const error = ref('')
const showSuccess = ref(false)

const auth = useAuthStore()

// Obtener servicio preseleccionado de la URL (?servicio=cambio-aceite)
const route = useRoute()
const preselectedService = route.query.servicio as string

const form = reactive({
  services: preselectedService ? [preselectedService] : [] as string[],
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
  vehiclePlate: '',
  scheduledDate: '',
  scheduledTime: '',
  customerName: auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : '',
  customerEmail: auth.user?.email ?? '',
  customerPhone: auth.user?.phone ?? '',
  notes: '',
})

const { data: servicesData } = await useFetch('/api/services')
const availableServices = computed(() => servicesData.value?.data ?? [])

// Nombres de los servicios seleccionados (para el resumen)
const selectedServiceNames = computed(() => {
  return form.services.map((slug) => {
    const service = availableServices.value.find((s) => s.slug === slug)
    return service?.name || slug
  })
})

// ─── Enviar reserva ───
async function submitBooking() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/appointments', {
      method: 'POST',
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      body: {
        ...form,
        vehicleYear: parseInt(form.vehicleYear) || 0,
        duration: 60, // TODO: calcular según servicios
      },
    })
    showSuccess.value = true
  } catch (err: any) {
    error.value = err?.data?.message || err?.statusMessage || 'Error al crear la cita'
  } finally {
    loading.value = false
  }
}
</script>