import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createAppointmentSchema,
  createVehicleSchema,
  contactSchema,
  updateAppointmentStatusSchema,
} from '../../server/utils/validation'

// ─── registerSchema ───

describe('registerSchema', () => {
  const validData = {
    email: 'test@example.com',
    password: '123456',
    firstName: 'Juan',
    lastName: 'García',
  }

  it('acepta datos válidos', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true)
  })

  it('acepta phone opcional', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '612345678' })
    expect(result.success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'no-es-email' })
    expect(result.success).toBe(false)
  })

  it('rechaza contraseña corta (< 6 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, password: '123' })
    expect(result.success).toBe(false)
  })

  it('rechaza sin nombre', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza sin apellido', () => {
    const result = registerSchema.safeParse({ ...validData, lastName: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza sin email', () => {
    const { email, ...noEmail } = validData
    const result = registerSchema.safeParse(noEmail)
    expect(result.success).toBe(false)
  })
})

// ─── loginSchema ───

describe('loginSchema', () => {
  it('acepta email y password válidos', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'abc' })
    expect(result.success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rechaza password vacía', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

// ─── updateProfileSchema ───

describe('updateProfileSchema', () => {
  it('acepta campos opcionales', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true)
  })

  it('acepta solo firstName', () => {
    expect(updateProfileSchema.safeParse({ firstName: 'Ana' }).success).toBe(true)
  })

  it('rechaza firstName vacío', () => {
    expect(updateProfileSchema.safeParse({ firstName: '' }).success).toBe(false)
  })

  it('acepta phone null', () => {
    expect(updateProfileSchema.safeParse({ phone: null }).success).toBe(true)
  })
})

// ─── createAppointmentSchema ───

describe('createAppointmentSchema', () => {
  const validAppointment = {
    customerName: 'Juan García',
    customerEmail: 'juan@test.com',
    services: ['srv-1'],
    scheduledDate: '2026-03-20',
    scheduledTime: '10:00',
  }

  it('acepta datos mínimos válidos', () => {
    expect(createAppointmentSchema.safeParse(validAppointment).success).toBe(true)
  })

  it('acepta todos los campos opcionales', () => {
    const full = {
      ...validAppointment,
      customerPhone: '612345678',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: 2020,
      vehiclePlate: '1234ABC',
      duration: 60,
      notes: 'Revisar frenos',
    }
    expect(createAppointmentSchema.safeParse(full).success).toBe(true)
  })

  it('rechaza sin servicios', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, services: [] })
    expect(result.success).toBe(false)
  })

  it('rechaza fecha con formato incorrecto', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, scheduledDate: '20-03-2026' })
    expect(result.success).toBe(false)
  })

  it('rechaza hora con formato incorrecto', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, scheduledTime: '10:00:00' })
    expect(result.success).toBe(false)
  })

  it('rechaza nombre vacío', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, customerName: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza email inválido', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, customerEmail: 'noemail' })
    expect(result.success).toBe(false)
  })

  it('rechaza año de vehículo fuera de rango', () => {
    const result = createAppointmentSchema.safeParse({ ...validAppointment, vehicleYear: 1800 })
    expect(result.success).toBe(false)
  })
})

// ─── createVehicleSchema ───

describe('createVehicleSchema', () => {
  const validVehicle = { brand: 'Toyota', model: 'Corolla', year: 2020, plate: '1234ABC' }

  it('acepta datos válidos', () => {
    expect(createVehicleSchema.safeParse(validVehicle).success).toBe(true)
  })

  it('acepta year como string (coerce)', () => {
    const result = createVehicleSchema.safeParse({ ...validVehicle, year: '2020' })
    expect(result.success).toBe(true)
  })

  it('acepta color opcional', () => {
    const result = createVehicleSchema.safeParse({ ...validVehicle, color: 'Rojo' })
    expect(result.success).toBe(true)
  })

  it('rechaza sin marca', () => {
    const result = createVehicleSchema.safeParse({ ...validVehicle, brand: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza sin matrícula', () => {
    const result = createVehicleSchema.safeParse({ ...validVehicle, plate: '' })
    expect(result.success).toBe(false)
  })
})

// ─── contactSchema ───

describe('contactSchema', () => {
  it('acepta datos válidos', () => {
    const result = contactSchema.safeParse({ name: 'Ana', email: 'ana@test.com', message: 'Hola' })
    expect(result.success).toBe(true)
  })

  it('rechaza mensaje vacío', () => {
    const result = contactSchema.safeParse({ name: 'Ana', email: 'ana@test.com', message: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza mensaje demasiado largo (>5000)', () => {
    const result = contactSchema.safeParse({ name: 'Ana', email: 'ana@test.com', message: 'x'.repeat(5001) })
    expect(result.success).toBe(false)
  })
})

// ─── updateAppointmentStatusSchema ───

describe('updateAppointmentStatusSchema', () => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

  it.each(validStatuses)('acepta estado "%s"', (status) => {
    expect(updateAppointmentStatusSchema.safeParse({ status }).success).toBe(true)
  })

  it('rechaza estado inválido', () => {
    const result = updateAppointmentStatusSchema.safeParse({ status: 'UNKNOWN' })
    expect(result.success).toBe(false)
  })

  it('rechaza sin estado', () => {
    const result = updateAppointmentStatusSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
