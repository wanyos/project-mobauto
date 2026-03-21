// server/api/admin/services/[id].delete.ts
// ─── DELETE /api/admin/services/:id ───
// Elimina un servicio. Solo si no tiene citas asociadas.

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  const service = await prisma.service.findUnique({
    where: { id },
    include: { _count: { select: { appointments: true } } },
  })

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado' })
  }

  if (service._count.appointments > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `No se puede eliminar: tiene ${service._count.appointments} cita(s) asociada(s). Desactívalo en su lugar.`,
    })
  }

  try {
    await prisma.service.delete({ where: { id } })
    return { success: true, message: 'Servicio eliminado correctamente' }
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el servicio' })
  }
})
