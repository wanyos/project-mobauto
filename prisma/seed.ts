// prisma/seed.ts
// Prisma v7: importar desde el archivo client.ts de la ruta de output del schema
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // ─── Crear usuario admin ───
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mobauto.es' },
    update: {},
    create: {
      email: 'admin@mobauto.es',
      passwordHash: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Mobauto',
      phone: '916041262',
    },
  })
  console.log('Admin creado:', admin.email)

  // ─── Crear servicios ───
  const servicesData = [
    {
      slug: 'chapa-pintura',
      name: 'Chapa y Pintura',
      shortDescription: 'Reparacion de carroceria, abolladuras, aranazos y pintado profesional.',
      fullDescription: 'Nuestro servicio estrella. En Mobauto somos especialistas en chapa y pintura con mas de 10 anos de experiencia.',
      icon: 'format_paint',
      category: 'BODYWORK' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Reparacion de abolladuras y golpes',
        'Pintado parcial o completo del vehiculo',
        'Igualacion de color con tecnologia computerizada',
        'Coche de sustitucion disponible',
      ],
      sortOrder: 1,
    },
    {
      slug: 'cristales',
      name: 'Cristales para Automoviles',
      shortDescription: 'Reparacion y sustitucion de lunas, parabrisas y cristales laterales.',
      fullDescription: 'Servicio integral de cristales para tu vehiculo.',
      icon: 'window',
      category: 'REPAIR' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Reparacion de impactos en parabrisas',
        'Sustitucion de lunas delanteras y traseras',
        'Cristales homologados',
      ],
      sortOrder: 2,
    },
    {
      slug: 'reparacion-general',
      name: 'Reparacion de Automoviles',
      shortDescription: 'Mecanica general: motor, frenos, suspension, embrague y mas.',
      fullDescription: 'Taller de reparacion integral.',
      icon: 'build',
      category: 'REPAIR' as const,
      priceLabel: 'Presupuesto sin compromiso',
      features: [
        'Diagnostico electronico avanzado',
        'Reparacion de motor',
        'Sistemas de frenado',
        'Suspension y amortiguadores',
      ],
      sortOrder: 3,
    },
    {
      slug: 'mantenimiento',
      name: 'Mantenimiento Preventivo',
      shortDescription: 'Cambio de aceite, filtros, revisiones y mantenimiento periodico.',
      fullDescription: 'El mantenimiento preventivo es clave para alargar la vida de tu vehiculo.',
      icon: 'oil_barrel',
      category: 'MAINTENANCE' as const,
      priceMin: 49,
      priceLabel: 'Desde 49€',
      features: [
        'Cambio de aceite y filtros',
        'Revision de niveles',
        'Cambio de pastillas de freno',
      ],
      sortOrder: 4,
    },
    {
      slug: 'pre-itv',
      name: 'Pre-ITV',
      shortDescription: 'Revision completa previa a la ITV.',
      fullDescription: 'Revisamos todos los puntos que se evaluan en la ITV.',
      icon: 'verified',
      category: 'INSPECTION' as const,
      priceMin: 39,
      priceLabel: 'Desde 39€',
      features: [
        'Revision de emisiones',
        'Comprobacion de luces y senalizacion',
        'Estado de frenos',
      ],
      sortOrder: 5,
    },
    {
      slug: 'peritaje-siniestros',
      name: 'Peritaje y Siniestros',
      shortDescription: 'Gestion completa de siniestros con aseguradoras.',
      fullDescription: 'Nos encargamos de todo el proceso de gestion con tu aseguradora.',
      icon: 'description',
      category: 'OTHER' as const,
      priceLabel: 'Segun peritaje',
      features: [
        'Gestion integral con aseguradoras',
        'Peritaje in situ',
        'Coche de sustitucion',
      ],
      sortOrder: 6,
    },
  ]

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }
  console.log(`${servicesData.length} servicios creados`)

  // ─── Configuracion del negocio ───
  const configData = [
    { key: 'morning_open', value: '08:00' },
    { key: 'morning_close', value: '14:00' },
    { key: 'afternoon_open', value: '15:30' },
    { key: 'afternoon_close', value: '19:00' },
    { key: 'slot_minutes', value: '30' },
    { key: 'work_days', value: '1,2,3,4,5' },
  ]

  for (const config of configData) {
    await prisma.businessConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }
  console.log('Configuracion del negocio creada')

  console.log('Seed completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })