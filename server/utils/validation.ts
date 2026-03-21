// server/utils/validation.ts
// ─── Schemas de validación con Zod ───
// Nuxt auto-importa desde server/utils/ en todos los endpoints.

import { z } from 'zod'
import { createError } from 'h3'

// ─── Auth ───

export const registerSchema = z.object({
  email: z.string().email('El email no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
  phone: z.string().max(20).nullish(),
})

export const loginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email no válido'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).nullish(),
})

// ─── Citas ───

export const createAppointmentSchema = z.object({
  customerName: z.string().min(1, 'El nombre es obligatorio').max(200),
  customerEmail: z.string().email('Email no válido'),
  customerPhone: z.string().max(20).nullish(),
  vehicleBrand: z.string().max(100).nullish(),
  vehicleModel: z.string().max(100).nullish(),
  vehicleYear: z.number().int().min(1900).max(2100).nullish(),
  vehiclePlate: z.string().max(20).nullish(),
  services: z.array(z.string()).min(1, 'Selecciona al menos un servicio'),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha: YYYY-MM-DD'),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora: HH:MM'),
  duration: z.number().int().positive().optional(),
  notes: z.string().max(1000).nullish(),
})

// ─── Vehículos ───

export const createVehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es obligatoria').max(100),
  model: z.string().min(1, 'El modelo es obligatorio').max(100),
  year: z.coerce.number().int().min(1900).max(2100),
  plate: z.string().min(1, 'La matrícula es obligatoria').max(20),
  color: z.string().max(50).nullish(),
})

// ─── Contacto ───

export const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(200),
  email: z.string().email('Email no válido'),
  message: z.string().min(1, 'El mensaje es obligatorio').max(5000),
})

// ─── Admin ───

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Estado no válido' }),
  }),
})

// ─── Helper para validar body con Zod ───

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body)
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(', ')
    throw createError({ statusCode: 400, statusMessage: message })
  }
  return result.data
}
