// server/api/appointments/slots.get.ts
// ─── GET /api/appointments/slots?date=2026-03-15 ───
// Devuelve los horarios disponibles para una fecha.

import { getBusinessConfig, generateSlots } from '../../utils/businessConfig'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string

  if (!date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "date" es obligatorio. Formato: YYYY-MM-DD',
    })
  }

  const config = await getBusinessConfig()

  // Verificar que es día laboral según la configuración de la BD
  const dayOfWeek = new Date(date).getDay()
  if (!config.workDays.includes(dayOfWeek)) {
    return { success: true, data: { date, slots: [] } }
  }

  // Consultar slots ya ocupados en la base de datos
  const booked = await prisma.appointment.findMany({
    where: {
      scheduledDate: new Date(date),
      status: { not: 'CANCELLED' },
    },
    select: { scheduledTime: true },
  })

  const bookedTimes = booked.map((a) => a.scheduledTime)
  const slots = generateSlots(config).filter((s) => !bookedTimes.includes(s))

  return { success: true, data: { date, slots } }
})
