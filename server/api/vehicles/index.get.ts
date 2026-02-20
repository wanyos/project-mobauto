// server/api/vehicles/index.get.ts
// ─── GET /api/vehicles ───
// Devuelve los vehículos del usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = getUserFromEvent(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: authUser.userId },
    orderBy: { createdAt: 'desc' },
  })

  return {
    success: true,
    data: vehicles.map((v) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      plate: v.plate,
      color: v.color,
    })),
  }
})
