// server/api/admin/appointments/[id].patch.ts
// ─── PATCH /api/admin/appointments/:id ───
// Permite al admin cambiar el estado de una cita.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const { status } = validateBody(updateAppointmentStatusSchema, await readBody(event))

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    return { success: true, data: { id: appointment.id, status: appointment.status } }
  } catch (error) {
    console.error('Error al actualizar cita:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar la cita' })
  }
})
