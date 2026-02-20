// server/api/services/[slug].get.ts
// ─── GET /api/services/:slug ───
// Devuelve un servicio por su slug con sus FAQs.

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      faqs: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado' })
  }

  return {
    success: true,
    data: {
      id: service.id,
      slug: service.slug,
      name: service.name,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      icon: service.icon,
      category: service.category,
      estimatedDuration: service.estimatedMinutes ? `${service.estimatedMinutes} min` : 'Consultar',
      priceRange: service.priceLabel ?? 'Consultar',
      features: service.features,
      faqs: service.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    },
  }
})
