// ─── Endpoint: POST /api/auth/change-password ───
// Cambia la contraseña del usuario autenticado.

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const body = await readBody(event)
  const { currentPassword, newPassword } = validateBody(changePasswordSchema, body)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
  }

  // Verificar que la contraseña actual es correcta
  const isValid = await comparePassword(currentPassword, user.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: 'La contraseña actual no es correcta' })
  }

  // Hashear y guardar la nueva contraseña
  const hashed = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashed },
  })

  return { success: true, data: { message: 'Contraseña actualizada correctamente' } }
})
