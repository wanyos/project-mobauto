// ─── Endpoint: POST /api/auth/register ───
//
// En Nuxt, el nombre del archivo define la ruta y el método HTTP:
// - server/api/auth/register.post.ts → POST /api/auth/register
// - server/api/users/index.get.ts   → GET /api/users
// - server/api/users/[id].get.ts    → GET /api/users/:id (dinámico)

export default defineEventHandler(async (event) => {
  // 1. Leer el body de la petición (los datos que envía el frontend)
  const body = await readBody(event)

  // 2. Validar que los campos necesarios existan
  //    (En Fase 3 usaremos Zod para validaciones más robustas)
  const { email, password, firstName, lastName, phone } = body

  if (!email || !password || !firstName || !lastName) {
    // throw createError() envía un error HTTP al frontend
    throw createError({
      statusCode: 400, // 400 = Bad Request (datos incorrectos)
      statusMessage: 'Faltan campos obligatorios: email, password, firstName, lastName',
    })
  }

  // Validar formato de email (básico)
  if (!email.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El email no tiene un formato válido',
    })
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 6 caracteres',
    })
  }

  // 3. Verificar que el email no esté ya registrado
  const existingUser = findUserByEmail(email)
  if (existingUser) {
    throw createError({
      statusCode: 409, // 409 = Conflict (ya existe)
      statusMessage: 'Ya existe un usuario con ese email',
    })
  }

  // 4. Hashear la contraseña (NUNCA guardar la contraseña en texto plano)
  const passwordHash = await hashPassword(password)

  // 5. Crear el usuario
  const user = createUser({
    email,
    passwordHash,
    role: 'CUSTOMER', // Por defecto, todos son clientes
    firstName,
    lastName,
    phone,
  })

  // 6. Crear el token JWT
  const token = createToken({ userId: user.id, role: user.role })

  // 7. Devolver la respuesta
  //    setResponseStatus establece el código HTTP (201 = Created)
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
})