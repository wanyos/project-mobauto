// server/api/appointments/index.post.ts
// ─── POST /api/appointments ───
// Crea una nueva cita.

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    customerName,
    customerEmail,
    customerPhone,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    vehiclePlate,
    services,
    scheduledDate,
    scheduledTime,
    duration,
    notes,
  } = body;

  // Validaciones básicas
  if (
    !customerName ||
    !customerEmail ||
    !scheduledDate ||
    !scheduledTime ||
    !services?.length
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Faltan campos obligatorios",
    });
  }

  // Verificar que el slot sigue disponible
  const booked = await prisma.appointment.findFirst({
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
  const serviceRecords = await prisma.service.findMany({
    where: { slug: { in: services as string[] } },
  })

  const appointment = await prisma.appointment.create({
    data: {
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

  console.log("📅 Nueva cita creada:", appointment.id, scheduledDate, scheduledTime)

  setResponseStatus(event, 201)
  return {
    success: true,
    data: {
      ...appointment,
      scheduledDate: scheduledDate, // devolver como string YYYY-MM-DD
      services: appointment.services.map((s) => s.service.slug),
    },
  }
});
