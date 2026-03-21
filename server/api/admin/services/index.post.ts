// server/api/admin/services/index.post.ts
// ─── POST /api/admin/services ───
// Crea un nuevo servicio.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const data = validateBody(createServiceSchema, await readBody(event))

  // Verificar slug único
  const existing = await prisma.service.findUnique({ where: { slug: data.slug } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Ya existe un servicio con ese slug' })
  }

  const { faqs = [], ...serviceData } = data

  try {
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        priceMin: serviceData.priceMin ?? null,
        priceMax: serviceData.priceMax ?? null,
        faqs: {
          create: faqs.map((f, i) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder ?? i,
          })),
        },
      },
      include: { faqs: true },
    })

    setResponseStatus(event, 201)
    return { success: true, data: service }
  } catch (error) {
    console.error('Error al crear servicio:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al crear el servicio' })
  }
})
