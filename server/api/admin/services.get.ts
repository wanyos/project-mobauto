// server/api/admin/services.get.ts
// ─── GET /api/admin/services ───
// Devuelve TODOS los servicios (activos e inactivos) para el admin.

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        faqs: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { appointments: true } },
      },
    })

    return {
      success: true,
      data: services.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        icon: s.icon,
        category: s.category,
        estimatedMinutes: s.estimatedMinutes,
        priceMin: s.priceMin ? Number(s.priceMin) : null,
        priceMax: s.priceMax ? Number(s.priceMax) : null,
        priceLabel: s.priceLabel,
        features: s.features,
        isActive: s.isActive,
        sortOrder: s.sortOrder,
        totalAppointments: s._count.appointments,
        faqs: s.faqs.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
        })),
      })),
    }
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los servicios' })
  }
})
