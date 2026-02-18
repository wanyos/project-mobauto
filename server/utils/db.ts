// ─── "Base de datos" temporal en memoria ───
// IMPORTANTE: Esto se borra cada vez que reinicias el servidor.
// Es solo para aprender. Luego lo reemplazaremos con Prisma + PostgreSQL.

export interface DbUser {
  id: string
  email: string
  passwordHash: string
  role: 'CUSTOMER' | 'MECHANIC' | 'ADMIN'
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
}

// Este array actúa como nuestra "tabla de usuarios"
const users: DbUser[] = []

// ─── Funciones para interactuar con la "base de datos" ───

// Buscar usuario por email
export function findUserByEmail(email: string): DbUser | undefined {
  return users.find(u => u.email === email)
}

// Buscar usuario por ID
export function findUserById(id: string): DbUser | undefined {
  return users.find(u => u.id === id)
}

// Crear nuevo usuario
export function createUser(data: Omit<DbUser, 'id' | 'createdAt'>): DbUser {
  const newUser: DbUser = {
    ...data,
    id: crypto.randomUUID(), // Genera un ID único
    createdAt: new Date(),
  }
  users.push(newUser)
  return newUser
}

// Obtener todos los usuarios (para el admin)
export function getAllUsers(): DbUser[] {
  return users
}