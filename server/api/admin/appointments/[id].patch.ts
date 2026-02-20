// server/api/admin/appointments/[id].patch.ts
// ─── PATCH /api/admin/appointments/:id ───
// Permite al admin cambiar el estado de una cita.

export default defineEventHandler(async (event) => {
  const authData = getUserFromEvent(event)

  if (!authData) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  if (authData.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'No autorizado' })
  }

  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event)

  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Estado no válido' })
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
  })

  return { success: true, data: { id: appointment.id, status: appointment.status } }
})
