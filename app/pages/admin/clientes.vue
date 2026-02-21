<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Clientes Registrados</h1>

    <q-card>
      <q-card-section class="flex items-center gap-4">
        <q-input
          v-model="busqueda"
          placeholder="Buscar por nombre o email..."
          outlined dense clearable
          style="min-width: 280px"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <span class="text-sm text-gray-500">{{ clientesFiltrados.length }} clientes</span>
      </q-card-section>

      <q-table
        :rows="clientesFiltrados"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-nombre="props">
          <q-td :props="props">
            {{ props.row.firstName }} {{ props.row.lastName }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Clientes - Admin MobautoRomero' })

const auth = useAuthStore()

const clientes = ref<any[]>([])
const busqueda = ref('')

const columns = [
  { name: 'nombre', label: 'Nombre', field: (row: any) => `${row.firstName} ${row.lastName}`, align: 'left' as const, sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left' as const },
  { name: 'createdAt', label: 'Registro', field: 'createdAt', align: 'left' as const, sortable: true },
  { name: 'totalAppointments', label: 'Citas', field: 'totalAppointments', align: 'center' as const, sortable: true },
  { name: 'totalVehicles', label: 'Vehículos', field: 'totalVehicles', align: 'center' as const },
]

const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value
  const q = busqueda.value.toLowerCase()
  return clientes.value.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    clientes.value = response.data
  } catch (err) {
    console.error('Error cargando clientes:', err)
  }
})
</script>
