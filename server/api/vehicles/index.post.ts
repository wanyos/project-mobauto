// server/api/vehicles/index.post.ts
// ─── POST /api/vehicles ───
// Crea un vehículo para el usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = getUserFromEvent(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const { brand, model, year, plate, color } = await readBody(event)

  if (!brand || !model || !year || !plate) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      brand,
      model,
      year: parseInt(year),
      plate,
      color: color || null,
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
})
