<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Gestión de Citas</h1>

    <q-card>
      <q-card-section class="flex items-center gap-4">
        <q-select
          v-model="filtroEstado"
          :options="estadoOpciones"
          label="Filtrar por estado"
          outlined dense clearable
          style="min-width: 200px"
        />
        <q-space />
        <span class="text-sm text-gray-500">{{ appointments.length }} citas</span>
      </q-card-section>

      <q-table
        :rows="citasFiltradas"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 15, sortBy: 'date', descending: true }"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="statusColor(props.value)" :label="statusLabel(props.value)" />
          </q-td>
        </template>

        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn-dropdown
              flat dense no-caps
              :label="statusLabel(props.row.status)"
              :color="statusColor(props.row.status)"
              icon="edit"
            >
              <q-list>
                <q-item
                  v-for="opt in estadosDisponibles(props.row.status)"
                  :key="opt.value"
                  clickable v-close-popup
                  @click="cambiarEstado(props.row.id, opt.value)"
                >
                  <q-item-section avatar>
                    <q-icon :name="opt.icon" :color="opt.color" />
                  </q-item-section>
                  <q-item-section>{{ opt.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Citas - Admin MobautoRomero' })

const auth = useAuthStore()

const appointments = ref<any[]>([])
const filtroEstado = ref<string | null>(null)

const estadoOpciones = [
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Confirmada', value: 'CONFIRMED' },
  { label: 'En curso', value: 'IN_PROGRESS' },
  { label: 'Completada', value: 'COMPLETED' },
  { label: 'Cancelada', value: 'CANCELLED' },
]

const columns = [
  { name: 'date', label: 'Fecha', field: 'scheduledDate', align: 'left' as const, sortable: true },
  { name: 'time', label: 'Hora', field: 'scheduledTime', align: 'left' as const },
  { name: 'customer', label: 'Cliente', field: 'customerName', align: 'left' as const },
  { name: 'phone', label: 'Teléfono', field: 'customerPhone', align: 'left' as const },
  { name: 'vehicle', label: 'Vehículo', field: (row: any) => [row.vehicleBrand, row.vehicleModel, row.vehiclePlate].filter(Boolean).join(' · '), align: 'left' as const },
  { name: 'services', label: 'Servicios', field: (row: any) => row.services.join(', '), align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
  { name: 'acciones', label: 'Cambiar estado', field: 'acciones', align: 'center' as const },
]

const citasFiltradas = computed(() => {
  if (!filtroEstado.value) return appointments.value
  return appointments.value.filter(a => a.status === filtroEstado.value)
})

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/appointments', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    appointments.value = response.data
  } catch (err) {
    console.error('Error cargando citas:', err)
  }
})

async function cambiarEstado(id: string, nuevoEstado: string) {
  try {
    await $fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: { status: nuevoEstado },
    })
    const cita = appointments.value.find(a => a.id === id)
    if (cita) cita.status = nuevoEstado
  } catch (err) {
    console.error('Error cambiando estado:', err)
  }
}

function estadosDisponibles(estadoActual: string) {
  return estadoOpciones.filter(o => o.value !== estadoActual).map(o => ({
    ...o,
    icon: iconEstado(o.value),
    color: statusColor(o.value),
  }))
}

function iconEstado(status: string): string {
  const icons: Record<string, string> = {
    PENDING: 'schedule', CONFIRMED: 'event_available', IN_PROGRESS: 'build',
    COMPLETED: 'check_circle', CANCELLED: 'cancel',
  }
  return icons[status] || 'circle'
}

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'warning', CONFIRMED: 'primary', IN_PROGRESS: 'info',
    COMPLETED: 'positive', CANCELLED: 'negative',
  }
  return colors[status] || 'grey'
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente', CONFIRMED: 'Confirmada', IN_PROGRESS: 'En curso',
    COMPLETED: 'Completada', CANCELLED: 'Cancelada',
  }
  return labels[status] || status
}
</script>
