// ─── Endpoint: POST /api/auth/forgot-password ───
// Solicita un enlace de recuperación de contraseña.

import crypto from 'crypto'
import { passwordResetEmail } from '../../utils/emailTemplates'

export default defineEventHandler(async (event) => {
  rateLimit(event, 5, 15 * 60 * 1000) // 5 intentos cada 15 min por IP

  const body = await readBody(event)
  const { email } = validateBody(forgotPasswordSchema, body)

  // Siempre responder lo mismo para no revelar si el email existe
  const successResponse = {
    success: true,
    data: { message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' },
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return successResponse

    // Invalidar tokens anteriores no usados
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    })

    // Construir URL de reset
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    sendEmail({
      to: user.email,
      subject: 'Recuperar contraseña — MobautoRomero',
      html: passwordResetEmail({
        userName: user.firstName,
        resetUrl,
      }),
    }).catch(err => console.error('Email reset password:', err))

    return successResponse
  } catch (error) {
    console.error('Error en forgot-password:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error interno del servidor' })
  }
})
