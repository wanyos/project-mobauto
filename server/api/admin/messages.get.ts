// server/api/admin/messages.get.ts
// ─── GET /api/admin/messages ───
// Lista todos los mensajes de contacto. Solo accesible por admins.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  // Filtro opcional por estado de lectura: ?read=true|false
  const readFilter = query.read === 'true' ? true : query.read === 'false' ? false : undefined

  try {
    const where = readFilter !== undefined ? { isRead: readFilter } : {}

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ])

    return { success: true, data: messages, total, unreadCount, page, limit }
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los mensajes' })
  }
})
