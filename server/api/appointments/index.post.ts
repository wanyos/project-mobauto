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
  const availableSlots = getAvailableSlots(scheduledDate);
  if (!availableSlots.includes(scheduledTime)) {
    throw createError({
      statusCode: 409,
      statusMessage: "El horario seleccionado ya no está disponible",
    });
  }

  const appointment = createAppointment({
    customerName,
    customerEmail,
    customerPhone: customerPhone || "",
    vehicleBrand: vehicleBrand || "",
    vehicleModel: vehicleModel || "",
    vehicleYear: vehicleYear || 0,
    vehiclePlate: vehiclePlate || "",
    services,
    scheduledDate,
    scheduledTime,
    duration: duration || 60,
    notes,
  });

  console.log(
    "📅 Nueva cita creada:",
    appointment.id,
    scheduledDate,
    scheduledTime,
  );

  setResponseStatus(event, 201);
  return { success: true, data: appointment };
});
