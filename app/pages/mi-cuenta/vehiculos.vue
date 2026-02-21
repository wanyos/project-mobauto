<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mis Vehículos</h1>
      <q-btn color="primary" label="Añadir Vehículo" icon="add"
        no-caps @click="showDialog = true" />
    </div>

    <!-- Lista de vehículos -->
    <div v-if="vehicles.length === 0" class="text-center py-12">
      <q-icon name="directions_car" size="64px" color="grey-4" />
      <p class="text-gray-500 mt-4">No tienes vehículos registrados.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <q-card v-for="vehicle in vehicles" :key="vehicle.id">
        <q-card-section>
          <div class="flex items-center gap-4">
            <q-icon name="directions_car" size="40px" color="primary" />
            <div>
              <h3 class="font-bold text-lg">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="text-gray-500">{{ vehicle.year }} · {{ vehicle.plate }}</p>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="negative" label="Eliminar" no-caps
            @click="removeVehicle(vehicle.id)" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Diálogo para añadir vehículo -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <h3 class="text-lg font-bold">Añadir Vehículo</h3>
        </q-card-section>
        <q-card-section class="space-y-4">
          <q-input v-model="newVehicle.brand" label="Marca" outlined />
          <q-input v-model="newVehicle.model" label="Modelo" outlined />
          <q-input v-model="newVehicle.year" label="Año" type="number" outlined />
          <q-input v-model="newVehicle.plate" label="Matrícula" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" no-caps v-close-popup />
          <q-btn color="primary" label="Guardar" no-caps :loading="saving" @click="addVehicle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'client' })
useSeoMeta({ title: 'Mis Vehículos - MobautoRomero' })

const auth = useAuthStore()
const $q = useQuasar()

const vehicles = ref<Array<{
  id: string; brand: string; model: string; year: number; plate: string
}>>([])

const showDialog = ref(false)
const saving = ref(false)
const newVehicle = reactive({ brand: '', model: '', year: '', plate: '' })

async function loadVehicles() {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/vehicles', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    vehicles.value = response.data
  } catch (err) {
    console.error('Error cargando vehículos:', err)
  }
}

async function addVehicle() {
  if (!newVehicle.brand || !newVehicle.model || !newVehicle.year || !newVehicle.plate) return
  saving.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        brand: newVehicle.brand,
        model: newVehicle.model,
        year: newVehicle.year,
        plate: newVehicle.plate,
      },
    })
    vehicles.value.push(response.data)
    Object.assign(newVehicle, { brand: '', model: '', year: '', plate: '' })
    showDialog.value = false
  } catch (err) {
    console.error('Error añadiendo vehículo:', err)
  } finally {
    saving.value = false
  }
}

function removeVehicle(id: string) {
  $q.dialog({
    title: 'Eliminar vehículo',
    message: '¿Seguro que quieres eliminar este vehículo?',
    cancel: { flat: true, label: 'Cancelar', noCaps: true },
    ok: { color: 'negative', label: 'Eliminar', noCaps: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await $fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      vehicles.value = vehicles.value.filter(v => v.id !== id)
    } catch (err) {
      console.error('Error eliminando vehículo:', err)
    }
  })
}

onMounted(loadVehicles)
</script>
