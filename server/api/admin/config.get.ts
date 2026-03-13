// server/api/admin/config.get.ts
// ─── GET /api/admin/config ───
// Devuelve la configuración del taller. Solo accesible por admins.

import { getBusinessConfig } from '../../utils/businessConfig'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    return { success: true, data: await getBusinessConfig() }
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener la configuración' })
  }
})
