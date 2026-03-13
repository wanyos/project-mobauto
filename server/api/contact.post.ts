// ─── Endpoint: POST /api/contact ───
// Recibe mensajes del formulario de contacto.
// Por ahora solo los logueamos. Luego integraremos email con Resend.

export default defineEventHandler(async (event) => {
  const { name, email, message } = validateBody(contactSchema, await readBody(event))

  try {
    // Guardar en la base de datos
    await prisma.contactMessage.create({
      data: { name, email, message },
    })

    return { success: true, data: { message: "Mensaje recibido correctamente" } };
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al enviar el mensaje' })
  }
});
