import { config } from 'dotenv'
import { existsSync } from 'fs'
import { defineConfig } from 'prisma/config'

// Si existe .env.production (migraciones contra produccion), usarlo.
// Si no, usar .env (desarrollo local).
if (existsSync('.env.production')) {
  config({ path: '.env.production', override: true })
} else {
  config({ path: '.env' })
}

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