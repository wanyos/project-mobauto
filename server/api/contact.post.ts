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

  // TODO: Integrar con Resend para enviar email al taller
  // Por ahora, solo lo logueamos en la consola del servidor
  console.log("📩 Nuevo mensaje de contacto:", { name, email, message });

  return { success: true, message: "Mensaje recibido correctamente" };
});
