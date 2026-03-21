import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Por defecto usa .env (desarrollo local).
// Para producción, ejecutar con: PRISMA_ENV=production npx prisma db push
const envFile = process.env.PRISMA_ENV === 'production' ? '.env.production' : '.env'
config({ path: envFile, override: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})