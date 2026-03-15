# Plan de Implementación — Sistema de Notificaciones por Email

## Contexto

El taller MobautoRomero permite a clientes (registrados o no) reservar citas.
Actualmente las reservas se guardan en base de datos pero **no se envía ningún email**.
El admin ve las citas en su dashboard y puede cambiar el estado, pero ni el cliente ni el taller reciben notificación.

---

## Flujos de email a implementar

| # | Evento | Destinatario | Contenido |
|---|--------|-------------|-----------|
| 1 | Cliente crea una reserva | **Cliente** | Resumen de la cita + estado "Pendiente de confirmar" |
| 2 | Cliente crea una reserva | **Taller** | Datos del cliente, vehículo, servicios, fecha/hora |
| 3 | Admin cambia estado de cita | **Cliente** | Nuevo estado de la cita (Confirmada, En progreso, Completada, Cancelada) |
| 4 | Admin cambia estado de cita | **Taller** | Resumen del cambio de estado |

---

## Decisión técnica: Nodemailer + Gmail SMTP

### ¿Por qué Gmail y no Outlook/Hotmail?

- Outlook requiere OAuth2 complejo y tiene restricciones con "Less Secure Apps"
- Gmail permite usar **App Passwords** (contraseñas de aplicación) de forma sencilla
- Es más estable y mejor documentado para Nodemailer

### Cuenta de correo recomendada

Crear una cuenta corporativa tipo `info@mobautoromero.com` o usar una cuenta Gmail dedicada como `mobautoromero@gmail.com`.

**Opción A — Gmail gratuito:**
- Crear `mobautoromero@gmail.com` (o similar)
- Activar verificación en 2 pasos
- Generar una "Contraseña de aplicación" para Nodemailer
- Límite: ~500 emails/día (más que suficiente para un taller)

**Opción B — Google Workspace (dominio propio):**
- Contratar Google Workspace (~6€/mes)
- Crear `info@mobautoromero.com`
- Misma configuración de App Password
- Imagen más profesional

> **Recomendación:** Empezar con Opción A para validar que todo funciona. Migrar a Opción B cuando se desee.

---

## Fases de implementación

### FASE 1 — Configurar cuenta Gmail + variables de entorno

**Objetivo:** Tener las credenciales SMTP listas.

**Pasos:**

1. Crear/elegir la cuenta Gmail para el taller
2. Ir a `myaccount.google.com` → Seguridad → Verificación en 2 pasos (activar)
3. Ir a `myaccount.google.com` → Seguridad → Contraseñas de aplicación
4. Crear contraseña de aplicación para "Correo" → "Otro" → nombre "MobautoRomero Web"
5. Copiar la contraseña de 16 caracteres generada
6. Añadir variables de entorno al proyecto:

```env
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mobautoromero@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # contraseña de aplicación (16 chars)
SMTP_FROM="Mobauto Romero <mobautoromero@gmail.com>"
TALLER_EMAIL=mobautoromero@gmail.com   # email donde el taller recibe notificaciones
```

**Verificación:** Las variables están definidas y accesibles con `process.env.SMTP_*`.

---

### FASE 2 — Instalar Nodemailer y crear utilidad de envío

**Objetivo:** Tener una función reutilizable `sendEmail()` en el servidor.

**Pasos:**

1. Instalar dependencia:
   ```bash
   npm install nodemailer
   npm install -D @types/nodemailer
   ```

2. Crear `server/utils/email.ts` con:
   - Configuración del transporter SMTP
   - Función genérica `sendEmail(to, subject, html)`
   - Manejo de errores (log pero no bloquear la reserva si falla el email)

3. Crear archivo de test manual para verificar que el envío funciona

**Verificación:**
- Crear endpoint temporal `GET /api/test-email` que envíe un email de prueba
- Confirmar que llega al buzón
- Eliminar el endpoint de prueba una vez verificado

---

### FASE 3 — Crear plantillas HTML para los emails

**Objetivo:** Emails con diseño profesional y responsive.

**Pasos:**

1. Crear `server/utils/emailTemplates.ts` con funciones que generen HTML:

   - `bookingConfirmationClient(data)` — Email al cliente cuando reserva
     - Logo/nombre del taller
     - "Tu cita ha sido registrada"
     - Estado: **Pendiente de confirmar**
     - Fecha, hora, servicios solicitados
     - Datos del vehículo
     - Mensaje: "Te contactaremos para confirmar tu cita"
     - Datos de contacto del taller

   - `bookingNotificationTaller(data)` — Email al taller con nueva reserva
     - "Nueva reserva recibida"
     - Datos del cliente (nombre, email, teléfono)
     - Datos del vehículo
     - Servicios solicitados
     - Fecha y hora
     - Notas del cliente
     - Link al dashboard de admin (si es posible)

   - `statusUpdateClient(data)` — Email al cliente cuando cambia el estado
     - "El estado de tu cita ha sido actualizado"
     - Nuevo estado con color/icono
     - Detalles de la cita
     - Mensaje personalizado según estado:
       - CONFIRMED: "Tu cita ha sido confirmada. Te esperamos el [fecha]"
       - IN_PROGRESS: "Tu vehículo está siendo atendido"
       - COMPLETED: "El servicio ha sido completado. Puedes pasar a recoger tu vehículo"
       - CANCELLED: "Tu cita ha sido cancelada. Contacta con nosotros si tienes dudas"

   - `statusUpdateTaller(data)` — Email al taller confirmando el cambio
     - Resumen breve del cambio de estado

2. Usar diseño inline CSS (los clientes de email no soportan CSS externo)
3. Diseño responsive para lectura en móvil
4. Colores coherentes con la marca del taller

**Verificación:** Previsualizar cada plantilla en el navegador antes de integrar.

---

### FASE 4 — Integrar emails en la creación de citas

**Objetivo:** Cuando se crea una reserva → enviar emails al cliente y al taller.

**Pasos:**

1. Modificar `server/api/appointments/index.post.ts`:
   - Después de crear la cita exitosamente en BD
   - Llamar a `sendEmail()` para el cliente (usando `customerEmail`)
   - Llamar a `sendEmail()` para el taller (usando `TALLER_EMAIL`)
   - **IMPORTANTE:** El envío de emails NO debe bloquear la respuesta al cliente
   - Usar `Promise.allSettled()` para enviar ambos en paralelo sin bloquear
   - Si falla el email, loguear el error pero devolver éxito al cliente

2. Los datos necesarios para la plantilla ya están disponibles en el endpoint:
   - `customerName`, `customerEmail`, `customerPhone`
   - `vehicleBrand`, `vehicleModel`, `vehicleYear`, `vehiclePlate`
   - `scheduledDate`, `scheduledTime`
   - Servicios seleccionados
   - `notes`

**Verificación:**
- Crear una reserva como cliente no registrado → verificar emails
- Crear una reserva como cliente registrado → verificar emails
- Simular fallo de email (credenciales incorrectas) → la reserva debe crearse igual

---

### FASE 5 — Integrar emails en el cambio de estado

**Objetivo:** Cuando el admin cambia el estado de una cita → enviar emails.

**Pasos:**

1. Modificar `server/api/admin/appointments/[id].patch.ts`:
   - Después de actualizar el estado en BD
   - Obtener los datos completos de la cita (include services, user)
   - Determinar el `customerEmail`:
     - Si la cita tiene `userId` → usar email del usuario relacionado
     - Si no → usar `customerEmail` del appointment
   - Enviar email al cliente con el nuevo estado
   - Enviar email al taller confirmando el cambio
   - Mismo patrón: no bloquear, loguear errores

**Verificación:**
- Cambiar estado a "Confirmada" → verificar email al cliente y taller
- Cambiar estado a "Completada" → verificar email
- Cambiar estado a "Cancelada" → verificar email
- Verificar que cada estado tiene su mensaje personalizado

---

### FASE 6 — Actualizar UI (mensajes de confirmación)

**Objetivo:** Que los mensajes en la UI reflejen la realidad.

**Pasos:**

1. En `app/pages/reservar/index.vue`:
   - El modal de éxito ya dice "Te hemos enviado un email de confirmación"
   - Ahora será verdad — verificar que el texto es correcto

2. En `app/pages/admin/citas.vue`:
   - Añadir indicación visual de que se enviará email al cambiar estado
   - Opcional: mostrar toast/notificación "Email enviado al cliente"

3. En `server/api/contact.post.ts`:
   - Integrar también el envío de email del formulario de contacto
   - Ya hay un TODO en el código para esto

**Verificación:** Test completo del flujo end-to-end.

---

### FASE 7 — Producción y monitorización

**Objetivo:** Asegurar que funciona en el entorno de producción.

**Pasos:**

1. Configurar variables `SMTP_*` en el hosting de producción
2. Verificar que el servidor de producción puede conectar a `smtp.gmail.com:587`
3. Probar flujo completo en producción
4. Monitorizar logs para detectar fallos de envío
5. Considerar: si el volumen crece, migrar a un servicio transaccional (Resend, SendGrid)

---

## Resumen de archivos a crear/modificar

| Acción | Archivo |
|--------|---------|
| **Crear** | `server/utils/email.ts` — transporter y función sendEmail |
| **Crear** | `server/utils/emailTemplates.ts` — plantillas HTML |
| **Modificar** | `server/api/appointments/index.post.ts` — enviar emails al crear cita |
| **Modificar** | `server/api/admin/appointments/[id].patch.ts` — enviar emails al cambiar estado |
| **Modificar** | `server/api/contact.post.ts` — enviar email del formulario de contacto |
| **Modificar** | `app/pages/reservar/index.vue` — ajustar mensajes de confirmación |
| **Modificar** | `app/pages/admin/citas.vue` — feedback visual de envío de email |
| **Modificar** | `.env` — variables SMTP |
| **Modificar** | `.env.example` — documentar variables necesarias |

---

## Orden de ejecución recomendado

```
FASE 1 → FASE 2 → verificar envío básico
       → FASE 3 → previsualizar plantillas
       → FASE 4 → verificar emails en reservas
       → FASE 5 → verificar emails en cambios de estado
       → FASE 6 → pulir UI
       → FASE 7 → deploy a producción
```

Cada fase debe verificarse completamente antes de pasar a la siguiente.
