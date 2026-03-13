// app/types/index.ts
// ─── Tipos del frontend alineados con el schema de Prisma y las respuestas API ───

export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string | null
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plate: string
  color?: string | null
}

export type ServiceCategory = 'BODYWORK' | 'REPAIR' | 'MAINTENANCE' | 'INSPECTION' | 'OTHER'

export interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
  fullDescription: string
  icon: string
  category: ServiceCategory
  estimatedDuration: string
  priceRange: string
  features: string[]
  faqs: Array<{ question: string; answer: string }>
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Appointment {
  id: string
  scheduledDate: string
  scheduledTime: string
  status: AppointmentStatus
  notes?: string | null
  vehicleBrand?: string | null
  vehicleModel?: string | null
  vehiclePlate?: string | null
  services: string[]
  customerName?: string
  customerEmail?: string
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  createdAt: string
  totalAppointments: number
  totalVehicles: number
}

// ─── Tipos para formularios y API ───

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  total?: number
  page?: number
  limit?: number
}

export interface AuthResponse {
  user: User
  token: string
}
