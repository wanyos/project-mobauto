// server/api/admin/appointments.get.ts
// ─── GET /api/admin/appointments ───
// Solo accesible por admins.

export default defineEventHandler((event) => {
  // Verificar autenticación
  const authData = getUserFromEvent(event);
  if (!authData) {
    throw createError({ statusCode: 401, statusMessage: "No autenticado" });
  }

  // Verificar rol admin
  if (authData.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "No autorizado" });
  }

  const appointments = getAllAppointments();
  return { success: true, data: appointments };
});
