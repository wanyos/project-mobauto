// server/api/appointments/[id].patch.ts
// ─── PATCH /api/appointments/:id ───
// Permite al cliente cancelar su propia cita (solo si faltan > 24h).

import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const { status } = validateBody(
    z.object({ status: z.literal('CANCELLED') }),
    await readBody(event),
  )

  const appointment = await prisma.appointment.findFirst({
    where: { id, userId: authUser.userId },
  })

  if (!appointment) {
    throw createError({ statusCode: 404, statusMessage: 'Cita no encontrada' })
  }

  if (appointment.status === 'CANCELLED') {
    throw createError({ statusCode: 400, statusMessage: 'La cita ya está cancelada' })
  }

  if (appointment.status === 'COMPLETED') {
    throw createError({ statusCode: 400, statusMessage: 'No se puede cancelar una cita completada' })
  }

  // Regla de 24h: calcular la fecha/hora de la cita
  const parts = appointment.scheduledTime.split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  const appointmentDate = new Date(appointment.scheduledDate)
  appointmentDate.setHours(h, m, 0, 0)

  const hoursUntilAppointment = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60)

  if (hoursUntilAppointment < 24) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No se puede cancelar con menos de 24 horas de antelación. Contacta con el taller por teléfono: 916 04 12 62',
    })
  }

  await prisma.appointment.update({
    where: { id },
    data: { status },
  })

  return { success: true, message: 'Cita cancelada correctamente' }
})
