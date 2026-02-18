
export type UserRole = 'CUSTOMER' | 'MECHANIC' | 'ADMIN'

export interface Profile {
    id: string
    firstname: string
    lastname: string
    phone?: string
    avatar?: string
}

export interface User {
    id: string
    email: string
    role: UserRole
    firstName?: string
    lastName?: string
    phone?: string
    profile?: Profile
    createAt?: string
    updateAt?: string
}

export interface Vehicle {
    id: string
    brand: string
    model: string
    year: number
    licensePlate: string // matricula
    vin?: string // bastidor
    kilometers?: number
    createAt: string
    updateAt: string
}

// Categorías de servicio
export type ServiceCategory =
  | 'MAINTENANCE'   // Mantenimiento
  | 'REPAIR'        // Reparación
  | 'DIAGNOSIS'     // Diagnóstico
  | 'BODYWORK'      // Chapa y pintura
  | 'TIRE_SERVICE'  // Neumáticos
  | 'INSPECTION'    // ITV / Inspección
  | 'OTHER'         // Otros

  // Servicio del taller
export interface Service {
  id: string
  name: string              // "Cambio de aceite"
  description?: string
  estimatedDuration: number // minutos
  basePrice: number         // euros
  category: ServiceCategory
  isActive: boolean
}

// Estados de una cita
export type AppointmentStatus =
  | 'PENDING'      // Pendiente de confirmar
  | 'CONFIRMED'    // Confirmada
  | 'IN_PROGRESS'  // En proceso
  | 'COMPLETED'    // Completada
  | 'CANCELLED'    // Cancelada
  | 'NO_SHOW'      // No se presentó

// Cita
export interface Appointment {
  id: string
  customerId: string
  vehicleId: string
  vehicle?: Vehicle
  services: AppointmentService[]
  scheduledAt: string     // ISO date string
  duration: number        // minutos
  status: AppointmentStatus
  notes?: string
  totalPrice?: number
  createdAt: string
  updatedAt: string
}

// Relación cita-servicio (con precio específico)
export interface AppointmentService {
  id: string
  serviceId: string
  service?: Service
  price: number
}

// ─── Tipos para formularios y API ───

// Lo que envías al backend para login
export interface LoginRequest {
  email: string
  password: string
}

// Lo que envías al backend para registro
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

// Respuesta genérica de la API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Respuesta de autenticación
export interface AuthResponse {
  user: User
  token: string
}

