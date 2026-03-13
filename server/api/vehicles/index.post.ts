// server/api/vehicles/index.post.ts
// ─── POST /api/vehicles ───
// Crea un vehículo para el usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const { brand, model, year, plate, color } = validateBody(createVehicleSchema, await readBody(event))

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        brand,
        model,
        year,
        plate,
        color: color ?? null,
        ownerId: authUser.userId,
      },
    })

    setResponseStatus(event, 201)
    return {
      success: true,
      data: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color,
      },
    }
  } catch (error) {
    console.error('Error al crear vehículo:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al crear el vehículo' })
  }
})
