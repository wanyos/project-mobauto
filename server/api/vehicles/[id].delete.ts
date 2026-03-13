// server/api/vehicles/[id].delete.ts
// ─── DELETE /api/vehicles/:id ───
// Elimina un vehículo del usuario autenticado.

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const id = getRouterParam(event, 'id')

  try {
    // Operación atómica: verificar ownership y eliminar en una sola query
    const result = await prisma.vehicle.deleteMany({
      where: { id, ownerId: authUser.userId },
    })

    if (result.count === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado' })
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error al eliminar vehículo:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el vehículo' })
  }
})
