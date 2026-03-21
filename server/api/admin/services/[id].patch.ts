// server/api/admin/services/[id].patch.ts
// ─── PATCH /api/admin/services/:id ───
// Actualiza un servicio existente.

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  const data = validateBody(updateServiceSchema, await readBody(event))

  const existing = await prisma.service.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado' })
  }

  // Si se cambia el slug, verificar que no esté en uso
  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.service.findUnique({ where: { slug: data.slug } })
    if (slugTaken) {
      throw createError({ statusCode: 409, statusMessage: 'Ya existe un servicio con ese slug' })
    }
  }

  const { faqs, ...serviceData } = data

  try {
    const service = await prisma.$transaction(async (tx) => {
      // Si se envían FAQs, reemplazar todas
      if (faqs !== undefined) {
        await tx.serviceFaq.deleteMany({ where: { serviceId: id } })
        if (faqs.length > 0) {
          await tx.serviceFaq.createMany({
            data: faqs.map((f, i) => ({
              serviceId: id!,
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder ?? i,
            })),
          })
        }
      }

      return tx.service.update({
        where: { id },
        data: {
          ...serviceData,
          priceMin: serviceData.priceMin !== undefined ? serviceData.priceMin ?? null : undefined,
          priceMax: serviceData.priceMax !== undefined ? serviceData.priceMax ?? null : undefined,
        },
        include: { faqs: { orderBy: { sortOrder: 'asc' } } },
      })
    })

    return { success: true, data: service }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error al actualizar servicio:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el servicio' })
  }
})
