// ─── Endpoint: POST /api/contact ───
// Recibe mensajes del formulario de contacto.

import { contactNotificationShop } from '../utils/emailTemplates'

export default defineEventHandler(async (event) => {
  const { name, email, message } = validateBody(contactSchema, await readBody(event))

  try {
    // Guardar en la base de datos
    await prisma.contactMessage.create({
      data: { name, email, message },
    })

    // Enviar email al taller con los datos del formulario
    sendEmail({
      to: process.env.GMAIL_USER ?? '',
      subject: `Nuevo mensaje de contacto: ${name}`,
      html: contactNotificationShop({ name, email, message }),
    }).catch(err => console.error('Email contacto:', err))

    return { success: true, data: { message: "Mensaje recibido correctamente" } };
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al enviar el mensaje' })
  }
});
