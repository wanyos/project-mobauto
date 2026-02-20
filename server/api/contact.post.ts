// ─── Endpoint: POST /api/contact ───
// Recibe mensajes del formulario de contacto.
// Por ahora solo los logueamos. Luego integraremos email con Resend.

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, message } = body;

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nombre, email y mensaje son obligatorios",
    });
  }

  // Guardar en la base de datos
  await prisma.contactMessage.create({
    data: { name, email, message },
  })

  return { success: true, message: "Mensaje recibido correctamente" };
});
