<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <q-card v-for="stat in stats" :key="stat.label">
        <q-card-section class="flex items-center gap-4">
          <q-icon :name="stat.icon" size="40px" :color="stat.color" />
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Acciones rápidas -->
    <h2 class="text-lg font-semibold mb-4">Acciones rápidas</h2>
    <div class="flex flex-wrap gap-4">
      <q-btn color="primary" label="Reservar Nueva Cita" icon="add"
        no-caps unelevated to="/reservar" />
      <q-btn outline color="primary" label="Ver Mis Citas" icon="event"
        no-caps to="/mi-cuenta/citas" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'client',
})

useSeoMeta({ title: 'Mi Cuenta - MobautoRomero' })

const auth = useAuthStore()

const proximasCitas = ref(0)
const serviciosRealizados = ref(0)
const vehiculosRegistrados = ref(0)

onMounted(async () => {
  try {
    const [appointmentsRes, vehiclesRes] = await Promise.all([
      $fetch('/api/appointments/my', {
        headers: { Authorization: `Bearer ${auth.token}` },
      }),
      $fetch('/api/vehicles', {
        headers: { Authorization: `Bearer ${auth.token}` },
      }),
    ])
    const appointments = appointmentsRes.data
    proximasCitas.value = appointments.filter(
      (a: any) => ['PENDING', 'CONFIRMED'].includes(a.status)
    ).length
    serviciosRealizados.value = appointments.filter(
      (a: any) => a.status === 'COMPLETED'
    ).length
    vehiculosRegistrados.value = vehiclesRes.data.length
  } catch (err) {
    console.error('Error cargando stats:', err)
  }
})

const stats = computed(() => [
  { label: 'Próximas citas', value: proximasCitas.value, icon: 'event', color: 'primary' },
  { label: 'Vehículos registrados', value: vehiculosRegistrados.value, icon: 'directions_car', color: 'secondary' },
  { label: 'Servicios realizados', value: serviciosRealizados.value, icon: 'check_circle', color: 'positive' },
])
</script>