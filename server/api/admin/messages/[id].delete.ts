// server/api/admin/messages/[id].delete.ts
// ─── DELETE /api/admin/messages/:id ───
// Elimina un mensaje de contacto. Solo accesible por admins.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de mensaje requerido' })
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Error al eliminar mensaje:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el mensaje' })
  }
})
