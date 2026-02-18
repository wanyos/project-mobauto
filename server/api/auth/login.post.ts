// ─── Endpoint: POST /api/auth/login ───

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // 1. Validar campos
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email y contraseña son obligatorios',
    })
  }

  // 2. Buscar usuario por email
  const user = findUserByEmail(email)
  if (!user) {
    // IMPORTANTE: no decimos "usuario no encontrado" por seguridad.
    // Si decimos eso, un atacante sabría qué emails están registrados.
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos',
    })
  }

  // 3. Comparar la contraseña
  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos', // Mismo mensaje a propósito
    })
  }

  // 4. Crear token JWT
  const token = createToken({ userId: user.id, role: user.role })

  // 5. Devolver usuario + token
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  }
})