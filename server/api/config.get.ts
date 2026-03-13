// server/api/config.get.ts
// ─── GET /api/config ───
// Endpoint PÚBLICO — devuelve la config necesaria para el frontend de reservas.
// No requiere autenticación (la usan el DateTimePicker y la página de reservar).

import { getBusinessConfig } from '../utils/businessConfig'

export default defineEventHandler(async () => {
  try {
    return { success: true, data: await getBusinessConfig() }
  } catch (error) {
    console.error('Error al obtener configuración pública:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener la configuración' })
  }
})
