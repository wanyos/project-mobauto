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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <q-card
            v-for="service in availableServices"
            :key="service.slug"
            flat
            bordered
            class="cursor-pointer transition-all"
            :class="form.services.includes(service.slug)
              ? 'border-2 border-blue-500 bg-blue-50/50'
              : 'border hover:border-gray-400'"
            @click="toggleService(service.slug)"
          >
            <q-card-section class="flex items-start gap-3 py-3 px-4">
              <q-icon
                :name="service.icon"
                size="28px"
                :color="form.services.includes(service.slug) ? 'primary' : 'grey-6'"
                class="mt-0.5"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold text-sm leading-tight">{{ service.name }}</span>
                  <q-icon
                    v-if="form.services.includes(service.slug)"
                    name="check_circle"
                    color="primary"
                    size="20px"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ service.shortDescription }}</p>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <p v-if="form.services.length > 0" class="text-sm text-primary mt-3 font-medium">
          {{ form.services.length }} servicio{{ form.services.length > 1 ? 's' : '' }} seleccionado{{ form.services.length > 1 ? 's' : '' }}
        </p>

        <q-stepper-navigation class="mt-4">
          <q-btn color="primary" label="Siguiente" no-caps
            :disable="form.services.length === 0"
            @click="step = 2" />
        </q-stepper-navigation>
      </q-step>

      <!-- ─── PASO 2: Datos del vehículo ─── -->
      <q-step :name="2" title="Vehículo" icon="directions_car" :done="step > 2">
        <!-- Selector de vehículo existente (solo usuarios autenticados con vehículos) -->
        <div v-if="auth.isAuthenticated && userVehicles.length > 0" class="mb-6">
          <p class="text-gray-600 mb-3">Selecciona uno de tus vehículos o introduce los datos manualmente:</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <q-card
              v-for="vehicle in userVehicles"
              :key="vehicle.id"
              flat
              bordered
              class="cursor-pointer transition-all"
              :class="selectedVehicleId === vehicle.id
                ? 'border-2 border-blue-500 bg-blue-50/50'
                : 'border hover:border-gray-400'"
              @click="selectVehicle(vehicle)"
            >
              <q-card-section class="flex items-center gap-3 py-3 px-4">
                <q-icon name="directions_car" size="28px"
                  :color="selectedVehicleId === vehicle.id ? 'primary' : 'grey-6'" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-semibold text-sm">{{ vehicle.brand }} {{ vehicle.model }}</span>
                    <q-icon
                      v-if="selectedVehicleId === vehicle.id"
                      name="check_circle"
                      color="primary"
                      size="20px"
                    />
                  </div>
                  <p class="text-xs text-gray-500">{{ vehicle.year }} · {{ vehicle.plate }}</p>
                </div>
              </q-card-section>
            </q-card>

            <!-- Opción: introducir manualmente -->
            <q-card
              flat
              bordered
              class="cursor-pointer transition-all"
              :class="selectedVehicleId === 'manual'
                ? 'border-2 border-blue-500 bg-blue-50/50'
                : 'border hover:border-gray-400'"
              @click="selectManualEntry()"
            >
              <q-card-section class="flex items-center gap-3 py-3 px-4">
                <q-icon name="edit" size="28px"
                  :color="selectedVehicleId === 'manual' ? 'primary' : 'grey-6'" />
                <div>
                  <span class="font-semibold text-sm">Otro vehículo</span>
                  <p class="text-xs text-gray-500">Introducir datos manualmente</p>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Formulario manual (siempre visible si no está logueado, o si eligió "manual") -->
        <div v-if="showManualVehicleForm" class="space-y-4">
          <p v-if="!auth.isAuthenticated || userVehicles.length === 0" class="text-gray-600 mb-2">
            Introduce los datos de tu vehículo:
          </p>
          <q-input v-model="form.vehicleBrand" label="Marca" outlined
            placeholder="Ej: Toyota, Seat, VW..." />
          <q-input v-model="form.vehicleModel" label="Modelo" outlined
            placeholder="Ej: Corolla, León, Golf..." />
          <q-input v-model="form.vehicleYear" label="Año" outlined
            placeholder="Ej: 2020" mask="####" unmasked-value
            :rules="[(v: string) => !v || (Number(v) >= 1900 && Number(v) <= 2100) || 'Año válido (1900–2100)']" />
          <q-input v-model="form.vehiclePlate" label="Matrícula" outlined
            placeholder="Ej: 1234 ABC" maxlength="15" />
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
            placeholder="Ej: Juan García López"
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerEmail" label="Email" type="email" outlined
            placeholder="Ej: cliente@email.com"
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.customerPhone" label="Teléfono" outlined
            placeholder="Ej: 612 345 678" maxlength="15" />
          <q-input v-model="form.notes" label="Notas adicionales (opcional)"
            placeholder="Ej: El coche tiene un golpe en el lateral derecho..."
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
                <span>{{ vehicleSummary }}</span>
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
          <h2 class="text-2xl font-bold mt-4">¡Cita Registrada!</h2>
          <p class="text-gray-500 mt-2">
            Te hemos enviado los detalles de tu reserva a {{ form.customerEmail }}.
          </p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Volver al inicio" no-caps to="/" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ─── Diálogo: guardar vehículo ─── -->
    <q-dialog v-model="showSaveVehicle" persistent>
      <q-card class="max-w-sm">
        <q-card-section class="text-center py-6">
          <q-icon name="directions_car" size="48px" color="primary" />
          <h3 class="text-lg font-bold mt-3">¿Guardar este vehículo?</h3>
          <p class="text-gray-500 mt-2 text-sm">
            <strong>{{ form.vehicleBrand }} {{ form.vehicleModel }}</strong>
            ({{ form.vehiclePlate }})<br>
            Así podrás seleccionarlo rápidamente en futuras citas.
          </p>
        </q-card-section>
        <q-card-actions align="center" class="gap-2 pb-4">
          <q-btn flat label="No, gracias" no-caps color="grey-7"
            @click="finishBooking()" />
          <q-btn color="primary" label="Guardar vehículo" no-caps
            :loading="savingVehicle" @click="saveVehicle()" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'

useSeoMeta({
  title: 'Reservar Cita Online - MobautoRomero',
  description: 'Reserva tu cita en nuestro taller mecánico de forma rápida y sencilla.',
})

// ─── Estado ───
const step = ref(1)
const loading = ref(false)
const error = ref('')
const showSuccess = ref(false)
const showSaveVehicle = ref(false)
const savingVehicle = ref(false)

const auth = useAuthStore()
const $q = useQuasar()

// Obtener servicio preseleccionado de la URL (?servicio=cambio-aceite)
const route = useRoute()
const preselectedService = computed(() => route.query.servicio as string)

// Vehículos del usuario autenticado
const userVehicles = ref<Vehicle[]>([])
const selectedVehicleId = ref<string | null>(null)

const form = reactive({
  services: preselectedService.value ? [preselectedService.value] : [] as string[],
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

// Cargar vehículos si el usuario está autenticado
async function loadUserVehicles() {
  if (!auth.isAuthenticated || !auth.token) return
  try {
    const response = await $fetch<{ success: boolean; data: Vehicle[] }>('/api/vehicles', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    userVehicles.value = response.data
  } catch {
    // Silencioso: si falla, simplemente no muestra vehículos guardados
  }
}

onMounted(loadUserVehicles)

// Mostrar formulario manual cuando no hay vehículos, no está logueado, o eligió "manual"
const showManualVehicleForm = computed(() => {
  if (!auth.isAuthenticated || userVehicles.value.length === 0) return true
  return selectedVehicleId.value === 'manual'
})

// Seleccionar un vehículo existente
function selectVehicle(vehicle: Vehicle) {
  selectedVehicleId.value = vehicle.id
  form.vehicleBrand = vehicle.brand
  form.vehicleModel = vehicle.model
  form.vehicleYear = String(vehicle.year)
  form.vehiclePlate = vehicle.plate
}

// Elegir "introducir manualmente"
function selectManualEntry() {
  selectedVehicleId.value = 'manual'
  form.vehicleBrand = ''
  form.vehicleModel = ''
  form.vehicleYear = ''
  form.vehiclePlate = ''
}

// Resumen del vehículo para el paso de confirmación
const vehicleSummary = computed(() => {
  if (form.vehicleBrand && form.vehiclePlate) {
    return `${form.vehicleBrand} ${form.vehicleModel} (${form.vehiclePlate})`
  }
  if (form.vehicleBrand) {
    return `${form.vehicleBrand} ${form.vehicleModel}`
  }
  return 'No especificado'
})

const { data: servicesData } = await useFetch('/api/services')
const availableServices = computed(() => servicesData.value?.data ?? [])

// Toggle de selección de servicio (para las tarjetas clickables)
function toggleService(slug: string) {
  const idx = form.services.indexOf(slug)
  if (idx >= 0) form.services.splice(idx, 1)
  else form.services.push(slug)
}

// Nombres de los servicios seleccionados (para el resumen)
const selectedServiceNames = computed(() => {
  return form.services.map((slug) => {
    const service = availableServices.value.find((s: { slug: string; name: string }) => s.slug === slug)
    return service?.name || slug
  })
})

// Duración estimada según servicios seleccionados
const estimatedDuration = computed(() => {
  let total = 0
  for (const slug of form.services) {
    const service = availableServices.value.find((s: { slug: string; estimatedDuration?: string }) => s.slug === slug)
    const minutes = parseInt(service?.estimatedDuration ?? '0') || 0
    total += minutes
  }
  return total || 60 // fallback 60 min si no hay datos
})

// ¿El vehículo fue introducido manualmente? (no seleccionado de la lista)
const isManualVehicle = computed(() => {
  return selectedVehicleId.value === 'manual' || selectedVehicleId.value === null
})

// ¿El vehículo manual ya existe en la lista del usuario?
const vehicleAlreadySaved = computed(() => {
  if (!isManualVehicle.value || !form.vehiclePlate) return false
  const plateUpper = form.vehiclePlate.trim().toUpperCase()
  return userVehicles.value.some(v => v.plate.toUpperCase() === plateUpper)
})

// ─── Enviar reserva ───
async function submitBooking() {
  loading.value = true
  error.value = ''

  // Determinar si se envía vehicleId (vehículo existente) o datos manuales
  const isExistingVehicle = selectedVehicleId.value && selectedVehicleId.value !== 'manual'

  try {
    await $fetch('/api/appointments', {
      method: 'POST',
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      body: {
        ...form,
        vehicleId: isExistingVehicle ? selectedVehicleId.value : undefined,
        vehicleYear: parseInt(form.vehicleYear) || 0,
        duration: estimatedDuration.value,
      },
    })

    // Si el usuario está logueado, usó datos manuales, y el vehículo no está guardado, preguntar
    if (auth.isAuthenticated && isManualVehicle.value && form.vehiclePlate && !vehicleAlreadySaved.value) {
      showSaveVehicle.value = true
    } else {
      showSuccess.value = true
    }
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; statusMessage?: string }
    error.value = e?.data?.message || e?.statusMessage || 'Error al crear la cita'
  } finally {
    loading.value = false
  }
}

// Guardar vehículo tras la reserva
async function saveVehicle() {
  savingVehicle.value = true
  try {
    await $fetch('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        brand: form.vehicleBrand,
        model: form.vehicleModel,
        year: parseInt(form.vehicleYear) || 0,
        plate: form.vehiclePlate,
      },
    })
    $q.notify({ type: 'positive', message: 'Vehículo guardado correctamente' })
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    const msg = e?.data?.statusMessage || 'Error al guardar el vehículo'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    savingVehicle.value = false
    finishBooking()
  }
}

// Cerrar el diálogo de guardar vehículo y mostrar éxito
function finishBooking() {
  showSaveVehicle.value = false
  showSuccess.value = true
}
</script>
