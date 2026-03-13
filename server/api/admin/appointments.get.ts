// server/api/admin/appointments.get.ts
// ─── GET /api/admin/appointments ───
// Solo accesible por admins.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  try {
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        orderBy: { scheduledDate: 'desc' },
        include: { services: { include: { service: true } } },
        skip,
        take: limit,
      }),
      prisma.appointment.count(),
    ])

    const data = appointments.map((a) => ({
      ...a,
      scheduledDate: a.scheduledDate.toISOString().split('T')[0],
      services: a.services.map((s) => s.service.slug),
    }))

    return { success: true, data, total, page, limit }
  } catch (error) {
    console.error('Error al obtener citas:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener las citas' })
  }
})
