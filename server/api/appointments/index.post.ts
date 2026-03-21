// server/api/appointments/index.post.ts
// ─── POST /api/appointments ───
// Crea una nueva cita.

import { appointmentConfirmationCustomer, appointmentNotificationShop } from '../../utils/emailTemplates'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const authUser = getUserFromEvent(event)

  const {
    customerName, customerEmail, customerPhone,
    vehicleId, vehicleBrand, vehicleModel, vehicleYear, vehiclePlate,
    services, scheduledDate, scheduledTime, duration, notes,
  } = validateBody(createAppointmentSchema, body)

  try {
    // Si se envía vehicleId, verificar que existe y pertenece al usuario
    let linkedVehicle: { id: string; brand: string; model: string; year: number; plate: string } | null = null
    if (vehicleId && authUser) {
      linkedVehicle = await prisma.vehicle.findFirst({
        where: { id: vehicleId, ownerId: authUser.userId },
        select: { id: true, brand: true, model: true, year: true, plate: true },
      })
      if (!linkedVehicle) {
        throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado' })
      }
    }

    // Transacción atómica: verificar disponibilidad + crear cita
    // Evita race conditions donde dos requests reservan el mismo slot
    const appointment = await prisma.$transaction(async (tx) => {
      // Verificar que el slot sigue disponible (dentro de la transacción)
      const booked = await tx.appointment.findFirst({
        where: {
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          status: { not: 'CANCELLED' },
        },
      })
      if (booked) {
        throw createError({
          statusCode: 409,
          statusMessage: "El horario seleccionado ya no está disponible",
        })
      }

      // Buscar los IDs de los servicios a partir de sus slugs
      const serviceRecords = await tx.service.findMany({
        where: { slug: { in: services as string[] } },
      })

      if (serviceRecords.length !== services.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Uno o más servicios seleccionados no existen',
        })
      }

      // Si hay vehículo vinculado, usar sus datos; si no, usar los del formulario
      const vBrand = linkedVehicle?.brand || vehicleBrand || null
      const vModel = linkedVehicle?.model || vehicleModel || null
      const vYear = linkedVehicle?.year || vehicleYear || null
      const vPlate = linkedVehicle?.plate || vehiclePlate || null

      return tx.appointment.create({
        data: {
          userId: authUser?.userId || null,
          vehicleId: linkedVehicle?.id || null,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          vehicleBrand: vBrand,
          vehicleModel: vModel,
          vehicleYear: vYear,
          vehiclePlate: vPlate,
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          duration: duration || 60,
          notes: notes || null,
          services: {
            create: serviceRecords.map((s) => ({ serviceId: s.id })),
          },
        },
        include: {
          services: { include: { service: true } },
        },
      })
    })

    const emailData = {
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      vehicleBrand: vehicleBrand || null,
      vehicleModel: vehicleModel || null,
      vehicleYear: vehicleYear || null,
      vehiclePlate: vehiclePlate || null,
      scheduledDate,
      scheduledTime,
      services: appointment.services.map((s) => s.service.name),
      notes: notes || null,
    }

    // send email customer
    sendEmail({
      to: customerEmail,
      subject: 'Cita registrada — MobautoRomero',
      html: appointmentConfirmationCustomer(emailData),
    }).catch(err => console.error('Email cliente:', err))

    // send email taller
    sendEmail({
      to: process.env.GMAIL_USER ?? '',
      subject: `Nueva reserva: ${customerName} — ${scheduledDate} ${scheduledTime}`,
      html: appointmentNotificationShop(emailData),
    }).catch(err => console.error('Email taller:', err))

    setResponseStatus(event, 201)
    return {
      success: true,
      data: {
        ...appointment,
        scheduledDate: scheduledDate, // devolver como string YYYY-MM-DD
        services: appointment.services.map((s) => s.service.slug),
      },
    }
  } catch (error) {
    // Re-lanzar errores HTTP ya creados (409, etc.)
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error al crear cita:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al crear la cita' })
  }
});
