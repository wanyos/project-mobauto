// server/api/admin/users.get.ts
// ─── GET /api/admin/users ───
// Lista todos los usuarios registrados. Solo admins.

export default defineEventHandler(async (event) => {
  const authData = getUserFromEvent(event)

  if (!authData) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  if (authData.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'No autorizado' })
  }

  const users = await prisma.user.findMany({
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
  })

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
  }
})
