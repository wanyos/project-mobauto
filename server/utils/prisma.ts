// server/utils/prisma.ts
// Cliente de Prisma reutilizable en todo el servidor.
// En desarrollo, evita crear multiples conexiones por hot-reload.

// Prisma v7 requiere un Driver Adapter para conectarse a la base de datos.
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
