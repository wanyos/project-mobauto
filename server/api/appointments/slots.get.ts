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

  try {
    // Rechazar fechas pasadas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (new Date(date) < today) {
      return { success: true, data: { date, slots: [] } }
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
    let slots = generateSlots(config).filter((s) => !bookedTimes.includes(s))

    // Filtrar horas pasadas si la fecha es hoy
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10) // "YYYY-MM-DD"
    if (date === todayStr) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      slots = slots.filter((s) => {
        const parts = s.split(':').map(Number)
        return (parts[0] ?? 0) * 60 + (parts[1] ?? 0) > currentMinutes
      })
    }

    return { success: true, data: { date, slots } }
  } catch (error) {
    console.error('Error al obtener slots:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los horarios disponibles' })
  }
})
