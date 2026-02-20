// server/api/services/index.get.ts
// ─── GET /api/services ───
// Devuelve todos los servicios activos con sus FAQs, ordenados por sortOrder.

export default defineEventHandler(async () => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      faqs: { orderBy: { sortOrder: 'asc' } },
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
      estimatedDuration: s.estimatedMinutes ? `${s.estimatedMinutes} min` : 'Consultar',
      priceRange: s.priceLabel ?? 'Consultar',
      features: s.features,
      faqs: s.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    })),
  }
})
