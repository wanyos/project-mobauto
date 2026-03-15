<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mensajes de Contacto</h1>

    <q-card>
      <q-card-section class="flex items-center gap-4">
        <q-select
          v-model="filtro"
          :options="filtroOpciones"
          label="Filtrar"
          outlined dense clearable
          emit-value map-options
          style="min-width: 200px"
        />
        <q-space />
        <q-badge v-if="unreadCount > 0" color="negative" :label="`${unreadCount} sin leer`" />
        <span class="text-sm text-gray-500">{{ mensajes.length }} mensajes</span>
      </q-card-section>

      <!-- Vista vacía -->
      <q-card-section v-if="mensajes.length === 0 && !cargando" class="text-center py-12">
        <q-icon name="mark_email_read" size="64px" color="grey-4" />
        <p class="text-gray-500 mt-4">No hay mensajes de contacto.</p>
      </q-card-section>

      <!-- Lista de mensajes -->
      <q-list v-else separator>
        <q-item
          v-for="msg in mensajesFiltrados"
          :key="msg.id"
          class="py-4"
          :class="{ 'bg-blue-50/50': !msg.isRead }"
        >
          <q-item-section avatar>
            <q-icon
              :name="msg.isRead ? 'drafts' : 'mail'"
              :color="msg.isRead ? 'grey' : 'primary'"
              size="24px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="flex items-center gap-2">
              <span :class="{ 'font-bold': !msg.isRead }">{{ msg.name }}</span>
              <q-badge v-if="!msg.isRead" color="primary" label="Nuevo" dense />
            </q-item-label>
            <q-item-label caption>
              {{ msg.email }}
              <span v-if="msg.phone"> · {{ msg.phone }}</span>
            </q-item-label>
            <q-item-label class="mt-2 text-gray-700 text-sm whitespace-pre-line">
              {{ msg.message }}
            </q-item-label>
            <q-item-label caption class="mt-1">
              {{ formatFecha(msg.createdAt) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="flex flex-col gap-1">
            <q-btn
              flat dense round
              :icon="msg.isRead ? 'mark_email_unread' : 'mark_email_read'"
              :color="msg.isRead ? 'grey' : 'primary'"
              @click="toggleLeido(msg)"
            >
              <q-tooltip>{{ msg.isRead ? 'Marcar como no leído' : 'Marcar como leído' }}</q-tooltip>
            </q-btn>
            <q-btn
              flat dense round
              icon="delete"
              color="negative"
              @click="eliminar(msg)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Mensajes - Admin MobautoRomero' })

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  createdAt: string
}

const auth = useAuthStore()
const $q = useQuasar()

const mensajes = ref<ContactMessage[]>([])
const unreadCount = ref(0)
const cargando = ref(false)
const filtro = ref<string | null>(null)

const filtroOpciones = [
  { label: 'Sin leer', value: 'unread' },
  { label: 'Leídos', value: 'read' },
]

const mensajesFiltrados = computed(() => {
  if (!filtro.value) return mensajes.value
  if (filtro.value === 'unread') return mensajes.value.filter((m: ContactMessage) => !m.isRead)
  if (filtro.value === 'read') return mensajes.value.filter((m: ContactMessage) => m.isRead)
  return mensajes.value
})

function formatFecha(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function cargarMensajes() {
  cargando.value = true
  try {
    const response = await $fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    mensajes.value = response.data as ContactMessage[]
    unreadCount.value = response.unreadCount
  } catch (err) {
    console.error('Error cargando mensajes:', err)
    $q.notify({ type: 'negative', message: 'Error al cargar los mensajes' })
  } finally {
    cargando.value = false
  }
}

async function toggleLeido(msg: ContactMessage) {
  try {
    await $fetch(`/api/admin/messages/${msg.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: { isRead: !msg.isRead },
    })
    msg.isRead = !msg.isRead
    unreadCount.value += msg.isRead ? -1 : 1
  } catch (err) {
    console.error('Error actualizando mensaje:', err)
    $q.notify({ type: 'negative', message: 'Error al actualizar el mensaje' })
  }
}

function eliminar(msg: ContactMessage) {
  $q.dialog({
    title: 'Eliminar mensaje',
    message: `¿Eliminar el mensaje de ${msg.name}?`,
    cancel: { flat: true, label: 'Cancelar', noCaps: true },
    ok: { color: 'negative', label: 'Eliminar', noCaps: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await $fetch(`/api/admin/messages/${msg.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      mensajes.value = mensajes.value.filter((m: ContactMessage) => m.id !== msg.id)
      if (!msg.isRead) unreadCount.value--
      $q.notify({ type: 'positive', message: 'Mensaje eliminado' })
    } catch (err) {
      console.error('Error eliminando mensaje:', err)
      $q.notify({ type: 'negative', message: 'Error al eliminar el mensaje' })
    }
  })
}

onMounted(cargarMensajes)
</script>
