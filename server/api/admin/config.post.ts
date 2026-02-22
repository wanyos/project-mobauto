// server/api/admin/config.post.ts
// ─── POST /api/admin/config ───
// Guarda la configuración del taller. Solo accesible por admins.
// Hace upsert de cada clave (inserta si no existe, actualiza si ya existe).

import type { BusinessConfig } from '../../utils/businessConfig'

export default defineEventHandler(async (event) => {
  const authData = getUserFromEvent(event)
  if (!authData) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  if (authData.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'No autorizado' })

  const body = await readBody<BusinessConfig>(event)

  // Convertir el objeto a pares clave-valor para la BD
  const entries: Array<{ key: string; value: string }> = [
    { key: 'morning_open',      value: body.morningOpen },
    { key: 'morning_close',     value: body.morningClose },
    { key: 'afternoon_enabled', value: String(body.afternoonEnabled) },
    { key: 'afternoon_open',    value: body.afternoonOpen },
    { key: 'afternoon_close',   value: body.afternoonClose },
    { key: 'slot_minutes',      value: String(body.slotMinutes) },
    { key: 'first_slot',        value: body.firstSlot },
    { key: 'last_slot',         value: body.lastSlot },
    { key: 'work_days',         value: body.workDays.join(',') },
  ]

  // Upsert en paralelo — actualiza si existe, crea si no
  await Promise.all(
    entries.map(({ key, value }) =>
      prisma.businessConfig.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      })
    )
  )

  return { success: true }
})
