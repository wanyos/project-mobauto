// shared/types/models.ts
// ─── Tipos compartidos para modelos del dominio ───
// Nuxt auto-importa el directorio shared/ en cliente y servidor.
// Los campos Date de Prisma se serializan como string | undefined por Nuxt (SerializeObject).

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Appointment {
  id: string
  scheduledDate?: string
  scheduledTime: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  vehicleBrand?: string | null
  vehicleModel?: string | null
  vehicleYear?: number | null
  vehiclePlate?: string | null
  services: string[]
  status: AppointmentStatus
  notes?: string | null
  duration?: number
  createdAt?: string
  updatedAt?: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plate: string
  color?: string | null
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  createdAt?: string
  totalAppointments: number
  totalVehicles: number
}
