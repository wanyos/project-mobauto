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
        :pagination="{ rowsPerPage: 5 }"
      >
        <!-- Columna personalizada para el estado -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="statusColor(props.value)" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',  // Solo admins pueden acceder
  layout: 'admin',
})

useSeoMeta({ title: 'Admin - Mobauto' })

const metrics = [
  { label: 'Citas hoy', value: '3', icon: 'event', color: 'primary' },
  { label: 'Pendientes', value: '5', icon: 'pending', color: 'warning' },
  { label: 'Completadas (mes)', value: '47', icon: 'check_circle', color: 'positive' },
  { label: 'Clientes totales', value: '124', icon: 'people', color: 'info' },
]

// Columnas de la tabla (configuración de q-table)
const columns = [
  { name: 'date', label: 'Fecha', field: 'scheduledDate', align: 'left' as const },
  { name: 'time', label: 'Hora', field: 'scheduledTime', align: 'left' as const },
  { name: 'customer', label: 'Cliente', field: 'customerName', align: 'left' as const },
  { name: 'services', label: 'Servicios', field: (row: any) => row.services.join(', '), align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
]

const recentAppointments = ref<any[]>([])

// Cargar citas
onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/appointments')
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
</script>