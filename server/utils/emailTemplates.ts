// server/utils/emailTemplates.ts
// Plantillas HTML para emails de MobautoRomero

interface AppointmentEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string | null
  vehicleBrand: string | null
  vehicleModel: string | null
  vehicleYear: number | null
  vehiclePlate: string | null
  scheduledDate: string
  scheduledTime: string
  services: string[]
  notes: string | null
}

function baseLayout(content: string, preheader: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1B3A5C;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">MobautoRomero</h1>
              <p style="margin:4px 0 0;color:#8bb0d4;font-size:13px;">Taller de chapa, pintura y reparaci&oacute;n</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 32px;border-top:1px solid #e9ecef;">
              <p style="margin:0;color:#6c757d;font-size:12px;text-align:center;">
                MobautoRomero &mdash; Tel: 916 04 12 62<br>
                Humanes de Madrid
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function infoRow(label: string, value: string) {
  return `
  <tr>
    <td style="padding:8px 12px;color:#6c757d;font-size:14px;border-bottom:1px solid #f0f0f0;width:140px;">${label}</td>
    <td style="padding:8px 12px;color:#212529;font-size:14px;border-bottom:1px solid #f0f0f0;font-weight:500;">${value}</td>
  </tr>`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function appointmentConfirmationCustomer(data: AppointmentEmailData): string {
  const vehicleInfo = [data.vehicleBrand, data.vehicleModel, data.vehicleYear]
    .filter(Boolean).join(' ')

  const content = `
    <h2 style="margin:0 0 8px;color:#1B3A5C;font-size:20px;">Cita registrada</h2>
    <p style="margin:0 0 24px;color:#495057;font-size:15px;">
      Hola <strong>${data.customerName}</strong>, tu cita ha sido registrada correctamente.
    </p>

    <!-- Detalles de la cita -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td colspan="2" style="background-color:#E8712B;padding:10px 12px;">
          <strong style="color:#ffffff;font-size:14px;">Detalles de tu cita</strong>
        </td>
      </tr>
      ${infoRow('Fecha', formatDate(data.scheduledDate))}
      ${infoRow('Hora', data.scheduledTime + ' h')}
      ${infoRow('Servicios', data.services.join(', '))}
      ${vehicleInfo ? infoRow('Veh&iacute;culo', vehicleInfo) : ''}
      ${data.vehiclePlate ? infoRow('Matr&iacute;cula', data.vehiclePlate) : ''}
      ${data.notes ? infoRow('Observaciones', data.notes) : ''}
    </table>

    <p style="margin:0 0 8px;color:#495057;font-size:14px;">
      Si necesitas modificar o cancelar tu cita, cont&aacute;ctanos por tel&eacute;fono o responde a este email.
    </p>
    <p style="margin:0;color:#6c757d;font-size:13px;">
      &iexcl;Gracias por confiar en MobautoRomero!
    </p>`

  const preheader = `Cita para el ${formatDate(data.scheduledDate)} a las ${data.scheduledTime} h — ${data.services.join(', ')}`
  return baseLayout(content, preheader)
}

export function appointmentNotificationShop(data: AppointmentEmailData): string {
  const vehicleInfo = [data.vehicleBrand, data.vehicleModel, data.vehicleYear]
    .filter(Boolean).join(' ')

  const content = `
    <h2 style="margin:0 0 8px;color:#1B3A5C;font-size:20px;">Nueva reserva recibida</h2>
    <p style="margin:0 0 24px;color:#495057;font-size:15px;">
      Se ha registrado una nueva cita desde la web.
    </p>

    <!-- Datos del cliente -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;overflow:hidden;margin-bottom:16px;">
      <tr>
        <td colspan="2" style="background-color:#1B3A5C;padding:10px 12px;">
          <strong style="color:#ffffff;font-size:14px;">Cliente</strong>
        </td>
      </tr>
      ${infoRow('Nombre', data.customerName)}
      ${infoRow('Email', data.customerEmail)}
      ${data.customerPhone ? infoRow('Tel&eacute;fono', data.customerPhone) : ''}
    </table>

    <!-- Datos de la cita -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;overflow:hidden;margin-bottom:16px;">
      <tr>
        <td colspan="2" style="background-color:#E8712B;padding:10px 12px;">
          <strong style="color:#ffffff;font-size:14px;">Cita</strong>
        </td>
      </tr>
      ${infoRow('Fecha', formatDate(data.scheduledDate))}
      ${infoRow('Hora', data.scheduledTime + ' h')}
      ${infoRow('Servicios', data.services.join(', '))}
      ${vehicleInfo ? infoRow('Veh&iacute;culo', vehicleInfo) : ''}
      ${data.vehiclePlate ? infoRow('Matr&iacute;cula', data.vehiclePlate) : ''}
      ${data.notes ? infoRow('Observaciones', data.notes) : ''}
    </table>`

  const preheader = `${data.customerName} — ${formatDate(data.scheduledDate)} a las ${data.scheduledTime} h — ${data.services.join(', ')}`
  return baseLayout(content, preheader)
}
