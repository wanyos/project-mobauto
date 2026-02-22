<!-- Selector de fecha y hora con slots disponibles -->
<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Selecciona fecha y hora</h3>

    <!-- Selector de fecha -->
    <q-date
      v-model="selectedDate"
      :options="dateOptions"
      minimal
      class="mb-4 w-full"
    />

    <!-- Slots de hora -->
    <div v-if="selectedDate">
      <p class="font-medium mb-2">Horarios disponibles:</p>

      <div v-if="loadingSlots" class="text-center py-4">
        <q-spinner color="primary" size="30px" />
        <p class="text-gray-500 mt-2">Cargando horarios...</p>
      </div>

      <div v-else-if="slots.length === 0" class="text-center py-4">
        <q-icon name="event_busy" size="32px" color="grey" />
        <p class="text-gray-500 mt-2">No hay horarios disponibles para esta fecha.</p>
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <q-btn
          v-for="slot in slots"
          :key="slot"
          :label="slot"
          :color="selectedTime === slot ? 'primary' : undefined"
          :outline="selectedTime !== slot"
          no-caps
          @click="selectTime(slot)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBusinessConfig } from '~/composables/useBusinessConfig'

// ─── Props y Emits ───
// emit() permite enviar datos del hijo al padre.
// Es lo contrario de props (padre → hijo). Emit va hijo → padre.
const emit = defineEmits<{
  (e: 'update:date', value: string): void
  (e: 'update:time', value: string): void
}>()

const { esDiaLaboral, cargarConfig } = useBusinessConfig()

// Cargar config del taller al montar (días laborables, etc.)
onMounted(() => { cargarConfig() })

const selectedDate = ref('')
const selectedTime = ref('')
const slots = ref<string[]>([])
const loadingSlots = ref(false)

// ─── Opciones de fecha ───
// Función que determina qué fechas se pueden seleccionar.
// Devuelve true = seleccionable, false = bloqueada.
function dateOptions(date: string): boolean {
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // No permitir fechas pasadas
  if (d < today) return false

  // Bloquear días no laborables según la configuración del admin
  const day = d.getDay()
  if (!esDiaLaboral(day)) return false

  return true
}

// ─── Watch: observar cambios en la fecha seleccionada ───
// watch() ejecuta una función cada vez que una variable reactiva cambia.
// Aquí: cuando el usuario selecciona una fecha, cargamos los slots disponibles.
watch(selectedDate, async (newDate) => {
  if (!newDate) return

  selectedTime.value = '' // Reset la hora seleccionada
  loadingSlots.value = true

  try {
    // Quasar date format es "YYYY/MM/DD", convertimos a "YYYY-MM-DD"
    const formattedDate = newDate.replace(/\//g, '-')
    const response = await $fetch(`/api/appointments/slots?date=${formattedDate}`)
    slots.value = response.data.slots
    emit('update:date', formattedDate)
  } catch (err) {
    console.error('Error al cargar slots:', err)
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
})

function selectTime(time: string) {
  selectedTime.value = time
  emit('update:time', time)
}
</script>