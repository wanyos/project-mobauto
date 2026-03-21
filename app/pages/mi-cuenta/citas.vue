<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mis Citas</h1>
      <q-btn color="primary" label="Nueva Cita" icon="add" no-caps to="/reservar" />
    </div>

    <q-card>
      <q-card-section v-if="appointments.length === 0" class="text-center py-12">
        <q-icon name="event_busy" size="64px" color="grey-4" />
        <p class="text-gray-500 mt-4">No tienes citas aún.</p>
        <q-btn color="primary" label="Reservar tu primera cita" no-caps
          to="/reservar" class="mt-4" />
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="apt in appointments" :key="apt.id">
          <q-item-section avatar>
            <q-icon name="event" :color="statusColor(apt.status)" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ apt.services.join(', ') }}</q-item-label>
            <q-item-label caption>
              {{ apt.scheduledDate }} a las {{ apt.scheduledTime }}
            </q-item-label>
            <q-item-label v-if="apt.vehicleBrand" caption>
              {{ apt.vehicleBrand }} {{ apt.vehicleModel }} · {{ apt.vehiclePlate }}
            </q-item-label>
          </q-item-section>
          <q-item-section side class="flex items-center gap-2">
            <q-badge :color="statusColor(apt.status)" :label="statusLabel(apt.status)" />
            <q-btn
              v-if="canCancel(apt)"
              flat dense no-caps
              color="negative"
              icon="cancel"
              label="Cancelar"
              size="sm"
              class="mt-1"
              @click="confirmCancel(apt)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mis Citas - MobautoRomero' })

const auth = useAuthStore()
const $q = useQuasar()
const appointments = ref<Appointment[]>([])

onMounted(async () => {
  try {
    const response = await $fetch('/api/appointments/my', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    appointments.value = response.data as Appointment[]
  } catch (err) {
    console.error('Error cargando citas:', err)
  }
})

// Solo se puede cancelar si no está completada/cancelada
function canCancel(apt: Appointment): boolean {
  return apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'
}

function confirmCancel(apt: Appointment) {
  // Verificar regla de 24h en el frontend (informativo)
  const parts = apt.scheduledTime.split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  const appointmentDate = new Date(apt.scheduledDate as string)
  appointmentDate.setHours(h, m, 0, 0)
  const hoursLeft = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60)

  if (hoursLeft < 24) {
    $q.dialog({
      title: 'No se puede cancelar',
      message: 'Faltan menos de 24 horas para tu cita. Para cancelarla, contacta con el taller por teléfono: 916 04 12 62',
      ok: { label: 'Entendido', flat: true, noCaps: true },
      persistent: true,
    })
    return
  }

  $q.dialog({
    title: 'Cancelar cita',
    message: `¿Seguro que quieres cancelar tu cita del ${apt.scheduledDate} a las ${apt.scheduledTime}?`,
    cancel: { flat: true, label: 'No', noCaps: true },
    ok: { color: 'negative', label: 'Sí, cancelar', noCaps: true },
    persistent: true,
  }).onOk(() => cancelAppointment(apt.id))
}

async function cancelAppointment(id: string) {
  try {
    await $fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: { status: 'CANCELLED' },
    })
    const apt = appointments.value.find(a => a.id === id)
    if (apt) apt.status = 'CANCELLED'
    $q.notify({ type: 'positive', message: 'Cita cancelada correctamente' })
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    $q.notify({ type: 'negative', message: e?.data?.statusMessage || 'Error al cancelar la cita' })
  }
}

// statusColor, statusLabel — auto-importados desde app/utils/statusHelpers.ts
</script>
