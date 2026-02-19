// server/api/appointments/slots.get.ts
// ─── GET /api/appointments/slots?date=2026-03-15 ───
// Devuelve los horarios disponibles para una fecha.

export default defineEventHandler((event) => {
  // getQuery() lee los parámetros de la URL (?date=2026-03-15)
  const query = getQuery(event);
  const date = query.date as string;

  if (!date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El parámetro "date" es obligatorio. Formato: YYYY-MM-DD',
    });
  }

  const slots = getAvailableSlots(date);

  return {
    success: true,
    data: { date, slots },
  };
});
