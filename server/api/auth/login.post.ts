// ─── Endpoint: POST /api/auth/login ───

export default defineEventHandler(async (event) => {
  rateLimit(event, 10, 15 * 60 * 1000) // 10 intentos cada 15 min por IP

  const body = await readBody(event)
  const { email, password } = validateBody(loginSchema, body)

  try {
    // 2. Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email } })
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
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error en login:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error interno del servidor' })
  }
})
