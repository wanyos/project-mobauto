// server/api/appointments/slots.get.ts
// ─── GET /api/appointments/slots?date=2026-03-15 ───
// Devuelve los horarios disponibles para una fecha.

// Horarios del taller — modificar aquí para cambiar horarios
const BUSINESS_HOURS = {
  morningOpen: 8,
  morningClose: 14,
  afternoonOpen: 15, // 15:30
  afternoonClose: 19,
  slotMinutes: 30,
  workDays: [1, 2, 3, 4, 5], // Lunes a Viernes
}

function generateAllSlots(): string[] {
  const slots: string[] = []
  for (let h = BUSINESS_HOURS.morningOpen; h < BUSINESS_HOURS.morningClose; h++) {
    for (let m = 0; m < 60; m += BUSINESS_HOURS.slotMinutes) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }
  for (let h = BUSINESS_HOURS.afternoonOpen; h < BUSINESS_HOURS.afternoonClose; h++) {
    const startMin = h === 15 ? 30 : 0
    for (let m = startMin; m < 60; m += BUSINESS_HOURS.slotMinutes) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }
  return slots
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string

  if (!date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "date" es obligatorio. Formato: YYYY-MM-DD',
    })
  }

  // Verificar que es día laboral
  const dayOfWeek = new Date(date).getDay()
  if (!BUSINESS_HOURS.workDays.includes(dayOfWeek)) {
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
  const slots = generateAllSlots().filter((s) => !bookedTimes.includes(s))

  return { success: true, data: { date, slots } }
})
