// server/api/auth/me.patch.ts
// ─── PATCH /api/auth/me ───
// Actualiza los datos del usuario autenticado (nombre, apellidos, teléfono).

export default defineEventHandler(async (event) => {
  const authUser = getUserFromEvent(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const { firstName, lastName, phone } = await readBody(event)

  const user = await prisma.user.update({
    where: { id: authUser.userId },
    data: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: phone || null,
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
})
