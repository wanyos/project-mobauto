<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Servicios</h1>
      <q-btn color="primary" label="Nuevo Servicio" icon="add" no-caps @click="openCreate" />
    </div>

    <q-card>
      <q-table
        :rows="services"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 20, sortBy: 'sortOrder' }"
        :loading="loadingTable"
      >
        <template #body-cell-icon="props">
          <q-td :props="props">
            <q-icon :name="props.value" size="24px" color="primary" />
          </q-td>
        </template>

        <template #body-cell-isActive="props">
          <q-td :props="props">
            <q-badge :color="props.value ? 'positive' : 'grey'" :label="props.value ? 'Activo' : 'Inactivo'" />
          </q-td>
        </template>

        <template #body-cell-category="props">
          <q-td :props="props">
            <q-badge outline :color="categoryColor(props.value)" :label="categoryLabel(props.value)" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat dense icon="edit" color="primary" size="sm" @click="openEdit(props.row)" />
            <q-btn flat dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ─── Diálogo crear/editar servicio ─── -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 95vw">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ isEditing ? 'Editar Servicio' : 'Nuevo Servicio' }}</q-toolbar-title>
          <q-btn flat round icon="close" @click="showDialog = false" />
        </q-toolbar>

        <q-card-section style="max-height: 75vh; overflow-y: auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <q-input v-model="form.name" label="Nombre *" outlined
              :rules="[(v: string) => !!v || 'Obligatorio']" />
            <q-input v-model="form.slug" label="Slug (URL) *" outlined
              hint="Ej: chapa-pintura"
              :rules="[(v: string) => !!v || 'Obligatorio', (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Solo minúsculas, números y guiones']" />
            <q-select
              v-model="form.icon"
              label="Icono *"
              outlined
              :options="iconOptions"
              emit-value
              map-options
              :rules="[(v: string) => !!v || 'Obligatorio']"
            >
              <template #prepend>
                <q-icon :name="form.icon || 'help_outline'" size="24px" />
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.value" size="24px" color="primary" />
                  </q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select v-model="form.category" label="Categoría *" outlined
              :options="categoryOptions" emit-value map-options
              :rules="[(v: string) => !!v || 'Obligatorio']" />
          </div>

          <q-input v-model="form.shortDescription" label="Descripción corta *" outlined class="mt-4"
            :rules="[(v: string) => !!v || 'Obligatorio']" />
          <q-input v-model="form.fullDescription" label="Descripción completa *" outlined class="mt-4"
            type="textarea" rows="4"
            :rules="[(v: string) => !!v || 'Obligatorio']" />

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <q-input v-model.number="form.estimatedMinutes" label="Duración (min)" outlined type="number" />
            <q-input v-model.number="form.priceMin" label="Precio mín (€)" outlined type="number" step="0.01" />
            <q-input v-model.number="form.priceMax" label="Precio máx (€)" outlined type="number" step="0.01" />
            <q-input v-model="form.priceLabel" label="Etiqueta precio" outlined
              hint="Ej: Desde 49€" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <q-input v-model.number="form.sortOrder" label="Orden" outlined type="number" />
            <div class="flex items-center">
              <q-toggle v-model="form.isActive" label="Servicio activo" color="positive" />
            </div>
          </div>

          <!-- Características -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold">Características</span>
              <q-btn flat dense icon="add" label="Añadir" no-caps size="sm" color="primary"
                @click="form.features.push('')" />
            </div>
            <div v-for="(_, i) in form.features" :key="i" class="flex gap-2 mb-2">
              <q-input v-model="form.features[i]" outlined dense class="flex-1"
                placeholder="Ej: Pintura con garantía de 3 años" />
              <q-btn flat dense icon="delete" color="negative" size="sm" @click="form.features.splice(i, 1)" />
            </div>
            <p v-if="form.features.length === 0" class="text-sm text-gray-400">Sin características</p>
          </div>

          <!-- FAQs -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold">Preguntas frecuentes</span>
              <q-btn flat dense icon="add" label="Añadir FAQ" no-caps size="sm" color="primary"
                @click="form.faqs.push({ question: '', answer: '', sortOrder: form.faqs.length })" />
            </div>
            <q-card v-for="(faq, i) in form.faqs" :key="i" flat bordered class="mb-3">
              <q-card-section class="q-pa-sm">
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-400">FAQ {{ i + 1 }}</span>
                  <q-btn flat dense icon="delete" color="negative" size="xs" @click="form.faqs.splice(i, 1)" />
                </div>
                <q-input v-model="faq.question" label="Pregunta" outlined dense class="mt-1" />
                <q-input v-model="faq.answer" label="Respuesta" outlined dense type="textarea" rows="2" class="mt-2" />
              </q-card-section>
            </q-card>
            <p v-if="form.faqs.length === 0" class="text-sm text-gray-400">Sin preguntas frecuentes</p>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" no-caps @click="showDialog = false" />
          <q-btn color="primary" :label="isEditing ? 'Guardar cambios' : 'Crear servicio'" no-caps
            :loading="saving" @click="saveService" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Servicios - Admin MobautoRomero' })

const auth = useAuthStore()
const $q = useQuasar()

interface AdminService {
  id: string
  slug: string
  name: string
  shortDescription: string
  fullDescription: string
  icon: string
  category: string
  estimatedMinutes: number | null
  priceMin: number | null
  priceMax: number | null
  priceLabel: string | null
  features: string[]
  isActive: boolean
  sortOrder: number
  totalAppointments: number
  faqs: Array<{ id?: string; question: string; answer: string; sortOrder: number }>
}

interface FaqForm {
  question: string
  answer: string
  sortOrder: number
}

const services = ref<AdminService[]>([])
const loadingTable = ref(false)
const showDialog = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const isEditing = computed(() => editingId.value !== null)

const emptyForm = () => ({
  name: '',
  slug: '',
  icon: '',
  category: '',
  shortDescription: '',
  fullDescription: '',
  estimatedMinutes: null as number | null,
  priceMin: null as number | null,
  priceMax: null as number | null,
  priceLabel: '',
  features: [] as string[],
  isActive: true,
  sortOrder: 0,
  faqs: [] as FaqForm[],
})

const form = reactive(emptyForm())

const iconOptions = [
  { label: 'Chapa / Pintura', value: 'format_paint' },
  { label: 'Herramienta / Reparación', value: 'build' },
  { label: 'Coche', value: 'directions_car' },
  { label: 'Motor / Ingeniería', value: 'engineering' },
  { label: 'Aceite / Gota', value: 'water_drop' },
  { label: 'Velocímetro', value: 'speed' },
  { label: 'Batería', value: 'battery_charging_full' },
  { label: 'Aire acondicionado', value: 'ac_unit' },
  { label: 'Rueda / Neumático', value: 'tire_repair' },
  { label: 'Frenos', value: 'disc_full' },
  { label: 'Electricidad', value: 'electrical_services' },
  { label: 'Cristal / Ventana', value: 'window' },
  { label: 'Diagnóstico', value: 'troubleshoot' },
  { label: 'ITV / Verificación', value: 'verified' },
  { label: 'Llave inglesa', value: 'plumbing' },
  { label: 'Configuración', value: 'settings' },
  { label: 'Luces', value: 'light' },
  { label: 'Seguridad', value: 'security' },
  { label: 'Carrocería', value: 'car_repair' },
  { label: 'Limpieza', value: 'cleaning_services' },
  { label: 'Llave mecánica', value: 'handyman' },
  { label: 'Escáner', value: 'document_scanner' },
  { label: 'Revisión general', value: 'checklist' },
  { label: 'Emergencia', value: 'warning' },
]

const categoryOptions = [
  { label: 'Chapa y Pintura', value: 'BODYWORK' },
  { label: 'Reparación', value: 'REPAIR' },
  { label: 'Mantenimiento', value: 'MAINTENANCE' },
  { label: 'Inspección / ITV', value: 'INSPECTION' },
  { label: 'Otros', value: 'OTHER' },
]

function categoryLabel(cat: string): string {
  return categoryOptions.find(o => o.value === cat)?.label || cat
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    BODYWORK: 'orange', REPAIR: 'red', MAINTENANCE: 'blue',
    INSPECTION: 'teal', OTHER: 'grey',
  }
  return colors[cat] || 'grey'
}

const columns = [
  { name: 'sortOrder', label: '#', field: 'sortOrder', align: 'center' as const, sortable: true, style: 'width: 50px' },
  { name: 'icon', label: 'Icono', field: 'icon', align: 'center' as const, style: 'width: 60px' },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' as const, sortable: true },
  { name: 'category', label: 'Categoría', field: 'category', align: 'center' as const },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center' as const },
  { name: 'totalAppointments', label: 'Citas', field: 'totalAppointments', align: 'center' as const, sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const },
]

async function loadServices() {
  loadingTable.value = true
  try {
    const response = await $fetch<{ success: boolean; data: AdminService[] }>('/api/admin/services', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    services.value = response.data
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar los servicios' })
  } finally {
    loadingTable.value = false
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showDialog.value = true
}

function openEdit(service: AdminService) {
  editingId.value = service.id
  Object.assign(form, {
    name: service.name,
    slug: service.slug,
    icon: service.icon,
    category: service.category,
    shortDescription: service.shortDescription,
    fullDescription: service.fullDescription,
    estimatedMinutes: service.estimatedMinutes,
    priceMin: service.priceMin,
    priceMax: service.priceMax,
    priceLabel: service.priceLabel || '',
    features: [...service.features],
    isActive: service.isActive,
    sortOrder: service.sortOrder,
    faqs: service.faqs.map(f => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder })),
  })
  showDialog.value = true
}

async function saveService() {
  if (!form.name || !form.slug || !form.icon || !form.category || !form.shortDescription || !form.fullDescription) {
    $q.notify({ type: 'warning', message: 'Rellena todos los campos obligatorios' })
    return
  }

  saving.value = true
  try {
    const body = {
      ...form,
      estimatedMinutes: form.estimatedMinutes || undefined,
      priceMin: form.priceMin || undefined,
      priceMax: form.priceMax || undefined,
      priceLabel: form.priceLabel || undefined,
      features: form.features.filter(f => f.trim() !== ''),
    }

    if (isEditing.value) {
      await $fetch(`/api/admin/services/${editingId.value}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${auth.token}` },
        body,
      })
      $q.notify({ type: 'positive', message: 'Servicio actualizado' })
    } else {
      await $fetch('/api/admin/services', {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
        body,
      })
      $q.notify({ type: 'positive', message: 'Servicio creado' })
    }

    showDialog.value = false
    await loadServices()
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    $q.notify({ type: 'negative', message: e?.data?.statusMessage || 'Error al guardar el servicio' })
  } finally {
    saving.value = false
  }
}

function confirmDelete(service: AdminService) {
  $q.dialog({
    title: 'Eliminar servicio',
    message: `¿Seguro que quieres eliminar "${service.name}"?${service.totalAppointments > 0 ? ` Tiene ${service.totalAppointments} cita(s) asociada(s), considera desactivarlo.` : ''}`,
    cancel: { flat: true, label: 'Cancelar', noCaps: true },
    ok: { color: 'negative', label: 'Eliminar', noCaps: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await $fetch(`/api/admin/services/${service.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      $q.notify({ type: 'positive', message: 'Servicio eliminado' })
      await loadServices()
    } catch (err: unknown) {
      const e = err as { data?: { statusMessage?: string } }
      $q.notify({ type: 'negative', message: e?.data?.statusMessage || 'Error al eliminar' })
    }
  })
}

onMounted(loadServices)
</script>
