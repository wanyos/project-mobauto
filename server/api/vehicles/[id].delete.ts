// server/api/vehicles/[id].delete.ts
// ─── DELETE /api/vehicles/:id ───
// Elimina un vehículo del usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = getUserFromEvent(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const id = getRouterParam(event, 'id')

  const vehicle = await prisma.vehicle.findFirst({
    where: { id, ownerId: authUser.userId },
  })

  if (!vehicle) {
    throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado' })
  }

  await prisma.vehicle.delete({ where: { id } })

  return { success: true }
})
