import { describe, it, expect, vi } from 'vitest'
import {
  appointmentConfirmationCustomer,
  appointmentNotificationShop,
  contactNotificationShop,
  passwordResetEmail,
} from '../../server/utils/emailTemplates'

// ─── Datos de prueba ───

const appointmentData = {
  customerName: 'Juan García',
  customerEmail: 'juan@test.com',
  customerPhone: '612345678',
  vehicleBrand: 'Toyota',
  vehicleModel: 'Corolla',
  vehicleYear: 2020,
  vehiclePlate: '1234ABC',
  scheduledDate: '2026-03-25',
  scheduledTime: '10:00',
  services: ['Chapa y Pintura', 'Pre-ITV'],
  notes: 'Golpe lateral derecho',
}

const appointmentMinimalData = {
  customerName: 'Ana López',
  customerEmail: 'ana@test.com',
  customerPhone: null,
  vehicleBrand: null,
  vehicleModel: null,
  vehicleYear: null,
  vehiclePlate: null,
  scheduledDate: '2026-04-10',
  scheduledTime: '16:30',
  services: ['Revisión general'],
  notes: null,
}

// ─── appointmentConfirmationCustomer ───

describe('appointmentConfirmationCustomer', () => {
  it('genera HTML con los datos del cliente', () => {
    const html = appointmentConfirmationCustomer(appointmentData)

    expect(html).toContain('Cita registrada')
    expect(html).toContain('Juan Garc')
    expect(html).toContain('10:00')
    expect(html).toContain('Chapa y Pintura')
    expect(html).toContain('Pre-ITV')
    expect(html).toContain('Toyota')
    expect(html).toContain('Corolla')
    expect(html).toContain('1234ABC')
    expect(html).toContain('Golpe lateral derecho')
  })

  it('genera HTML válido sin campos opcionales', () => {
    const html = appointmentConfirmationCustomer(appointmentMinimalData)

    expect(html).toContain('Cita registrada')
    expect(html).toContain('Ana L')
    expect(html).toContain('16:30')
    expect(html).not.toContain('1234ABC')
    expect(html).not.toContain('Observaciones')
  })

  it('incluye preheader con fecha y servicios', () => {
    const html = appointmentConfirmationCustomer(appointmentData)

    // El preheader está en un div oculto
    expect(html).toContain('display:none')
    expect(html).toContain('10:00')
  })

  it('contiene la estructura base del email', () => {
    const html = appointmentConfirmationCustomer(appointmentData)

    expect(html).toContain('MobautoRomero')
    expect(html).toContain('916 04 12 62')
    expect(html).toContain('Humanes de Madrid')
  })
})

// ─── appointmentNotificationShop ───

describe('appointmentNotificationShop', () => {
  it('genera HTML con datos del cliente y la cita', () => {
    const html = appointmentNotificationShop(appointmentData)

    expect(html).toContain('Nueva reserva recibida')
    expect(html).toContain('Juan Garc')
    expect(html).toContain('juan@test.com')
    expect(html).toContain('612345678')
    expect(html).toContain('10:00')
    expect(html).toContain('Chapa y Pintura')
  })

  it('omite teléfono cuando es null', () => {
    const html = appointmentNotificationShop(appointmentMinimalData)

    expect(html).not.toContain('fono')
  })
})

// ─── contactNotificationShop ───

describe('contactNotificationShop', () => {
  const contactData = {
    name: 'María Pérez',
    email: 'maria@test.com',
    message: 'Me gustaría pedir presupuesto para reparar el parachoques.',
  }

  it('genera HTML con datos del remitente y mensaje', () => {
    const html = contactNotificationShop(contactData)

    expect(html).toContain('Nuevo mensaje de contacto')
    expect(html).toContain('María')
    expect(html).toContain('maria@test.com')
    expect(html).toContain('presupuesto para reparar el parachoques')
  })

  it('convierte saltos de línea a <br> en el mensaje', () => {
    const data = { ...contactData, message: 'Línea 1\nLínea 2\nLínea 3' }
    const html = contactNotificationShop(data)

    expect(html).toContain('Línea 1<br>Línea 2<br>Línea 3')
  })

  it('incluye preheader con nombre y preview del mensaje', () => {
    const html = contactNotificationShop(contactData)

    expect(html).toContain('display:none')
    expect(html).toContain('María')
  })
})

// ─── passwordResetEmail ───

describe('passwordResetEmail', () => {
  const resetData = {
    userName: 'Carlos',
    resetUrl: 'https://mobautoromero.es/reset-password?token=abc123',
  }

  it('genera HTML con nombre y enlace de reset', () => {
    const html = passwordResetEmail(resetData)

    expect(html).toContain('Carlos')
    expect(html).toContain('https://mobautoromero.es/reset-password?token=abc123')
  })

  it('contiene botón de acción con el enlace', () => {
    const html = passwordResetEmail(resetData)

    expect(html).toContain('href="https://mobautoromero.es/reset-password?token=abc123"')
  })

  it('indica que el enlace expira en 1 hora', () => {
    const html = passwordResetEmail(resetData)

    expect(html).toContain('1 hora')
  })

  it('incluye URL como texto plano para fallback', () => {
    const html = passwordResetEmail(resetData)

    // La URL aparece dos veces: en el botón y como texto
    const matches = html.match(/token=abc123/g)
    expect(matches?.length).toBeGreaterThanOrEqual(2)
  })

  it('contiene preheader descriptivo', () => {
    const html = passwordResetEmail(resetData)

    expect(html).toContain('display:none')
    expect(html).toContain('Restablece tu contrase')
  })
})
