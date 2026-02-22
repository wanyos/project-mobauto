// server/api/admin/config.get.ts
// ─── GET /api/admin/config ───
// Devuelve la configuración del taller. Solo accesible por admins.

import { getBusinessConfig } from '../../utils/businessConfig'

export default defineEventHandler(async (event) => {
  const authData = getUserFromEvent(event)
  if (!authData) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  if (authData.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'No autorizado' })

  return { success: true, data: await getBusinessConfig() }
})
