// ─── Endpoint: GET /api/auth/me ───
// Devuelve los datos del usuario logueado.
// El frontend llama a esto al cargar la app para verificar si el token sigue válido.

export default defineEventHandler(async (event) => {
  const authData = requireAuth(event)

  try {
    const user = await prisma.user.findUnique({ where: { id: authData.userId } })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuario no encontrado',
      })
    }

    // 3. Devolver datos del usuario (SIN el hash de la contraseña)
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
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error al obtener usuario:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener los datos del usuario' })
  }
})
