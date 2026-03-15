// server/api/appointments/index.post.ts
// ─── POST /api/appointments ───
// Crea una nueva cita.

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const authUser = getUserFromEvent(event)

  const {
    customerName, customerEmail, customerPhone,
    vehicleBrand, vehicleModel, vehicleYear, vehiclePlate,
    services, scheduledDate, scheduledTime, duration, notes,
  } = validateBody(createAppointmentSchema, body)

  try {
    // Transacción atómica: verificar disponibilidad + crear cita
    // Evita race conditions donde dos requests reservan el mismo slot
    const appointment = await prisma.$transaction(async (tx) => {
      // Verificar que el slot sigue disponible (dentro de la transacción)
      const booked = await tx.appointment.findFirst({
        where: {
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          status: { not: 'CANCELLED' },
        },
      })
      if (booked) {
        throw createError({
          statusCode: 409,
          statusMessage: "El horario seleccionado ya no está disponible",
        })
      }

      // Buscar los IDs de los servicios a partir de sus slugs
      const serviceRecords = await tx.service.findMany({
        where: { slug: { in: services as string[] } },
      })

      if (serviceRecords.length !== services.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Uno o más servicios seleccionados no existen',
        })
      }

      return tx.appointment.create({
        data: {
          userId: authUser?.userId || null,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          vehicleBrand: vehicleBrand || null,
          vehicleModel: vehicleModel || null,
          vehicleYear: vehicleYear || null,
          vehiclePlate: vehiclePlate || null,
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          duration: duration || 60,
          notes: notes || null,
          services: {
            create: serviceRecords.map((s) => ({ serviceId: s.id })),
          },
        },
        include: {
          services: { include: { service: true } },
        },
      })
    })

    setResponseStatus(event, 201)
    return {
      success: true,
      data: {
        ...appointment,
        scheduledDate: scheduledDate, // devolver como string YYYY-MM-DD
        services: appointment.services.map((s) => s.service.slug),
      },
    }
  } catch (error) {
    // Re-lanzar errores HTTP ya creados (409, etc.)
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error al crear cita:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al crear la cita' })
  }
});
