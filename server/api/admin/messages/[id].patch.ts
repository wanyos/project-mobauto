// server/api/admin/messages/[id].patch.ts
// ─── PATCH /api/admin/messages/:id ───
// Marca un mensaje como leído/no leído. Solo accesible por admins.

import { z } from 'zod'

const updateMessageSchema = z.object({
  isRead: z.boolean(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de mensaje requerido' })
  }

  const { isRead } = validateBody(updateMessageSchema, await readBody(event))

  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    })

    return { success: true, data: message }
  } catch (error) {
    console.error('Error al actualizar mensaje:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el mensaje' })
  }
})
