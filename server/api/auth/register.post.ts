// ─── Endpoint: POST /api/auth/register ───
//
// En Nuxt, el nombre del archivo define la ruta y el método HTTP:
// - server/api/auth/register.post.ts → POST /api/auth/register
// - server/api/users/index.get.ts   → GET /api/users
// - server/api/users/[id].get.ts    → GET /api/users/:id (dinámico)

export default defineEventHandler(async (event) => {
  rateLimit(event, 5, 15 * 60 * 1000) // 5 registros cada 15 min por IP

  const body = await readBody(event)
  const { email, password, firstName, lastName, phone } = validateBody(registerSchema, body)

  try {
    // 3. Verificar que el email no esté ya registrado
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ya existe un usuario con ese email',
      })
    }

    // 4. Hashear la contraseña (NUNCA guardar la contraseña en texto plano)
    const passwordHash = await hashPassword(password)

    // 5. Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CUSTOMER',
        firstName,
        lastName,
        phone: phone || null,
      },
    })

    // 6. Crear el token JWT
    const token = createToken({ userId: user.id, role: user.role })

    // 7. Devolver la respuesta
    setResponseStatus(event, 201)
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
    console.error('Error en registro:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al registrar el usuario' })
  }
})
