<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Configuración del Taller</h1>
      <q-btn
        color="primary"
        icon="save"
        label="Guardar cambios"
        :loading="guardando"
        @click="guardar"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- ─── Turno de mañana ─── -->
      <q-card>
        <q-card-section>
          <div class="flex items-center gap-2 mb-4">
            <q-icon name="wb_sunny" color="warning" size="22px" />
            <h2 class="text-lg font-bold">Turno de mañana</h2>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">Hora de apertura</p>
              <q-input v-model="form.morningOpen" type="time" outlined dense />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Hora de cierre</p>
              <q-input v-model="form.morningClose" type="time" outlined dense />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ─── Turno de tarde ─── -->
      <q-card>
        <q-card-section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <q-icon name="nights_stay" color="primary" size="22px" />
              <h2 class="text-lg font-bold">Turno de tarde</h2>
            </div>
            <q-toggle
              v-model="form.afternoonEnabled"
              :label="form.afternoonEnabled ? 'Activo' : 'Desactivado'"
              color="primary"
            />
          </div>
          <div
            class="grid grid-cols-2 gap-4 transition-opacity"
            :class="{ 'opacity-40 pointer-events-none': !form.afternoonEnabled }"
          >
            <div>
              <p class="text-sm text-gray-500 mb-1">Hora de apertura</p>
              <q-input
                v-model="form.afternoonOpen"
                type="time"
                outlined
                dense
                :disable="!form.afternoonEnabled"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Hora de cierre</p>
              <q-input
                v-model="form.afternoonClose"
                type="time"
                outlined
                dense
                :disable="!form.afternoonEnabled"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ─── Configuración de citas ─── -->
      <q-card>
        <q-card-section>
          <div class="flex items-center gap-2 mb-4">
            <q-icon name="schedule" color="info" size="22px" />
            <h2 class="text-lg font-bold">Configuración de citas</h2>
          </div>

          <div class="mb-5">
            <p class="text-sm text-gray-500 mb-2">Intervalo entre citas</p>
            <q-btn-toggle
              v-model="form.slotMinutes"
              :options="[
                { label: '30 min', value: 30 },
                { label: '1 hora', value: 60 },
                { label: '2 horas', value: 120 },
              ]"
              spread
              outline
              color="primary"
              toggle-color="primary"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">Primera cita del día</p>
              <q-input
                v-model="form.firstSlot"
                type="time"
                outlined
                dense
                hint="Puede ser posterior a la apertura"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Última cita del día</p>
              <q-input
                v-model="form.lastSlot"
                type="time"
                outlined
                dense
                hint="Puede ser anterior al cierre"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ─── Días laborables ─── -->
      <q-card>
        <q-card-section>
          <div class="flex items-center gap-2 mb-4">
            <q-icon name="calendar_month" color="positive" size="22px" />
            <h2 class="text-lg font-bold">Días laborables</h2>
          </div>

          <div class="grid grid-cols-2 gap-1">
            <q-toggle
              v-for="dia in DIAS_SEMANA"
              :key="dia.value"
              :label="dia.label"
              :model-value="form.workDays.includes(dia.value)"
              color="primary"
              @update:model-value="(v) => toggleDia(dia.value, v)"
            />
          </div>

          <q-banner
            v-if="form.workDays.length === 0"
            class="mt-3 rounded"
            style="background: #fff3cd; color: #856404;"
            dense
          >
            <template #avatar>
              <q-icon name="warning" color="warning" />
            </template>
            Debes seleccionar al menos un día laborable.
          </q-banner>
        </q-card-section>
      </q-card>

    </div>

    <!-- ─── Resumen visual ─── -->
    <q-card class="mt-6">
      <q-card-section>
        <div class="flex items-center gap-2 mb-3">
          <q-icon name="preview" color="grey" size="20px" />
          <span class="text-base font-bold text-gray-600">Vista previa del horario</span>
        </div>
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <q-icon name="wb_sunny" color="warning" size="16px" />
            <span>Mañana: <strong>{{ form.morningOpen }} – {{ form.morningClose }}</strong></span>
          </div>
          <div v-if="form.afternoonEnabled" class="flex items-center gap-1">
            <q-icon name="nights_stay" color="primary" size="16px" />
            <span>Tarde: <strong>{{ form.afternoonOpen }} – {{ form.afternoonClose }}</strong></span>
          </div>
          <div v-else class="flex items-center gap-1 text-gray-400">
            <q-icon name="nights_stay" size="16px" />
            <span>Sin turno de tarde</span>
          </div>
          <div class="flex items-center gap-1">
            <q-icon name="schedule" color="info" size="16px" />
            <span>
              Citas cada <strong>{{ form.slotMinutes }} min</strong>
              ({{ form.firstSlot }} – {{ form.lastSlot }})
            </span>
          </div>
          <div class="flex items-center gap-1">
            <q-icon name="today" color="positive" size="16px" />
            <span><strong>{{ diasSeleccionadosLabel }}</strong></span>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import type { BusinessConfig } from '~/utils/businessConstants'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

useSeoMeta({ title: 'Configuración - Admin MobautoRomero' })

const { config } = useBusinessConfig()
const auth = useAuthStore()
const $q = useQuasar()
const guardando = ref(false)

// Copia local para editar — no modifica el estado global hasta guardar
const form = reactive<BusinessConfig>({ ...config.value, workDays: [...config.value.workDays] })

// Cargar config real desde la BD al entrar en la página
onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: BusinessConfig }>('/api/admin/config', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.success) {
      Object.assign(form, { ...res.data, workDays: [...res.data.workDays] })
      Object.assign(config.value, res.data)
    }
  } catch {
    // Si falla, se mantiene lo que hay en el estado global (defaults o lo último cargado)
  }
})

const diasSeleccionadosLabel = computed<string>(() => {
  if (form.workDays.length === 0) return 'Ningún día seleccionado'
  return DIAS_SEMANA
    .filter(d => form.workDays.includes(d.value))
    .map(d => d.label.slice(0, 3))
    .join(', ')
})

function toggleDia(dia: number, activo: boolean): void {
  if (activo) {
    if (!form.workDays.includes(dia)) {
      form.workDays = [...form.workDays, dia].sort((a, b) => a - b)
    }
  } else {
    form.workDays = form.workDays.filter(d => d !== dia)
  }
}

async function guardar(): Promise<void> {
  if (form.workDays.length === 0) {
    $q.notify({ type: 'warning', message: 'Selecciona al menos un día laborable' })
    return
  }

  guardando.value = true
  try {
    await $fetch('/api/admin/config', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: { ...form, workDays: [...form.workDays] },
    })

    // Actualizar también el estado global en memoria (afecta al DateTimePicker inmediatamente)
    Object.assign(config.value, { ...form, workDays: [...form.workDays] })

    $q.notify({ type: 'positive', message: 'Configuración guardada correctamente' })
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar la configuración' })
  } finally {
    guardando.value = false
  }
}
</script>
