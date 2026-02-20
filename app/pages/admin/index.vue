<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Panel de Administración</h1>

    <!-- Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <q-card v-for="metric in metrics" :key="metric.label">
        <q-card-section class="flex items-center gap-4">
          <div class="p-3 rounded-lg" :class="`bg-${metric.color}-100`">
            <q-icon :name="metric.icon" size="28px" :color="metric.color" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ metric.value }}</p>
            <p class="text-sm text-gray-500">{{ metric.label }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Citas recientes -->
    <q-card>
      <q-card-section>
        <h2 class="text-lg font-bold">Citas Recientes</h2>
      </q-card-section>
      <q-table
        :rows="recentAppointments"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="statusColor(props.value)" :label="statusLabel(props.value)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

useSeoMeta({ title: 'Admin - Mobauto' })

const auth = useAuthStore()

const columns = [
  { name: 'date', label: 'Fecha', field: 'scheduledDate', align: 'left' as const, sortable: true },
  { name: 'time', label: 'Hora', field: 'scheduledTime', align: 'left' as const },
  { name: 'customer', label: 'Cliente', field: 'customerName', align: 'left' as const },
  { name: 'services', label: 'Servicios', field: (row: any) => row.services.join(', '), align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
]

const recentAppointments = ref<any[]>([])

const citasHoy = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return recentAppointments.value.filter(a => a.scheduledDate === today).length
})

const citasPendientes = computed(() =>
  recentAppointments.value.filter(a => a.status === 'PENDING').length
)

const citasCompletadasMes = computed(() => {
  const now = new Date()
  const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return recentAppointments.value.filter(
    a => a.status === 'COMPLETED' && a.scheduledDate.startsWith(mesActual)
  ).length
})

const metrics = computed(() => [
  { label: 'Citas hoy', value: citasHoy.value, icon: 'event', color: 'primary' },
  { label: 'Pendientes de confirmar', value: citasPendientes.value, icon: 'pending', color: 'warning' },
  { label: 'Completadas (mes)', value: citasCompletadasMes.value, icon: 'check_circle', color: 'positive' },
  { label: 'Total citas', value: recentAppointments.value.length, icon: 'list_alt', color: 'info' },
])

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/appointments', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    recentAppointments.value = response.data
  } catch (err) {
    console.error('Error al cargar citas:', err)
  }
})

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
