// server/api/vehicles/index.get.ts
// ─── GET /api/vehicles ───
// Devuelve los vehículos del usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  try {
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
  } catch (error) {
    console.error('Error al obtener vehículos:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los vehículos' })
  }
})
