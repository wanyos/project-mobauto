// ─── Endpoint: GET /api/auth/me ───
// Devuelve los datos del usuario logueado.
// El frontend llama a esto al cargar la app para verificar si el token sigue válido.

export default defineEventHandler((event) => {
  // 1. Extraer datos del token JWT
  const authData = getUserFromEvent(event)

  if (!authData) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado. Envía el token en el header Authorization.',
    })
  }

  // 2. Buscar usuario en la "base de datos"
  const user = findUserById(authData.userId)

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
})