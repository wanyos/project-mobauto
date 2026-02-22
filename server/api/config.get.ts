// server/api/config.get.ts
// ─── GET /api/config ───
// Endpoint PÚBLICO — devuelve la config necesaria para el frontend de reservas.
// No requiere autenticación (la usan el DateTimePicker y la página de reservar).

import { getBusinessConfig } from '../utils/businessConfig'

export default defineEventHandler(async () => {
  return { success: true, data: await getBusinessConfig() }
})
