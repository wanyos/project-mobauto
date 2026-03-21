// ─── Endpoint: POST /api/auth/reset-password ───
// Ejecuta el cambio de contraseña con el token recibido por email.

export default defineEventHandler(async (event) => {
  rateLimit(event, 5, 15 * 60 * 1000) // 5 intentos cada 15 min por IP

  const body = await readBody(event)
  const { token, password } = validateBody(resetPasswordSchema, body)

  try {
    // Buscar token válido (no usado y no expirado)
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El enlace ha expirado o no es válido. Solicita uno nuevo.',
      })
    }

    // Cambiar contraseña y marcar token como usado
    const newHash = await hashPassword(password)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ])

    return {
      success: true,
      data: { message: 'Contraseña actualizada correctamente.' },
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error en reset-password:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error interno del servidor' })
  }
})
