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
          </q-item-section>
          <q-item-section side>
            <q-badge :color="statusColor(apt.status)" :label="statusLabel(apt.status)" />
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

// statusColor, statusLabel — auto-importados desde app/utils/statusHelpers.ts
</script>