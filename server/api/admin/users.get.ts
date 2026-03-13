// server/api/admin/users.get.ts
// ─── GET /api/admin/users ───
// Lista todos los usuarios registrados. Solo admins.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          _count: { select: { appointments: true, vehicles: true } },
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ])

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        createdAt: u.createdAt.toISOString().split('T')[0],
        totalAppointments: u._count.appointments,
        totalVehicles: u._count.vehicles,
      })),
      total,
      page,
      limit,
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los usuarios' })
  }
})
