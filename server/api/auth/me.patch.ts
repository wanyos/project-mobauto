// server/api/auth/me.patch.ts
// ─── PATCH /api/auth/me ───
// Actualiza los datos del usuario autenticado (nombre, apellidos, teléfono).

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const { firstName, lastName, phone } = validateBody(updateProfileSchema, await readBody(event))

  try {
    const user = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone ?? null,
      },
    })

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el perfil' })
  }
})
