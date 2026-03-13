// server/api/appointments/my.get.ts
// ─── GET /api/appointments/my ───
// Devuelve las citas del usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: authUser.userId },
      include: {
        services: { include: { service: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    })

    return {
      success: true,
      data: appointments.map((apt) => ({
        id: apt.id,
        scheduledDate: apt.scheduledDate.toISOString().split('T')[0],
        scheduledTime: apt.scheduledTime,
        status: apt.status,
        notes: apt.notes,
        vehicleBrand: apt.vehicleBrand,
        vehicleModel: apt.vehicleModel,
        vehiclePlate: apt.vehiclePlate,
        services: apt.services.map((s) => s.service.name),
      })),
    }
  } catch (error) {
    console.error('Error al obtener citas del usuario:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener tus citas' })
  }
})
