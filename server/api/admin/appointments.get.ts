// server/api/admin/appointments.get.ts
// ─── GET /api/admin/appointments ───
// Solo accesible por admins.

export default defineEventHandler(async (event) => {
  // Verificar autenticación
  const authData = getUserFromEvent(event)
  if (!authData) {
    throw createError({ statusCode: 401, statusMessage: "No autenticado" })
  }

  // Verificar rol admin
  if (authData.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "No autorizado" })
  }

  const appointments = await prisma.appointment.findMany({
    orderBy: { scheduledDate: 'desc' },
    include: {
      services: { include: { service: true } },
    },
  })

  // Formatear para que el frontend reciba la misma estructura que antes
  const data = appointments.map((a) => ({
    ...a,
    scheduledDate: a.scheduledDate.toISOString().split('T')[0],
    services: a.services.map((s) => s.service.slug),
  }))

  return { success: true, data }
})
