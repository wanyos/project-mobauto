// ─── "Base de datos" temporal de citas y disponibilidad ───

export interface DbAppointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  services: string[]; // slugs de servicios
  scheduledDate: string; // "2026-03-15"
  scheduledTime: string; // "10:00"
  duration: number; // minutos
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
  createdAt: Date;
}

const appointments: DbAppointment[] = [];

// Horario real de Mobauto (mañana y tarde con descanso)
const BUSINESS_HOURS = {
  morningOpen: 8, // 8:00
  morningClose: 14, // 14:00
  afternoonOpen: 15, // 15:30 → redondeamos a 15:30
  afternoonClose: 19, // 19:00
  slotMinutes: 30,
  workDays: [1, 2, 3, 4, 5], // Lunes a Viernes (0=Domingo)
};

// ─── Obtener slots disponibles para una fecha ───
export function getAvailableSlots(date: string): string[] {
  const dayOfWeek = new Date(date).getDay();

  // ¿Es día laboral?
  if (!BUSINESS_HOURS.workDays.includes(dayOfWeek)) {
    return []; // Fin de semana → no hay slots
  }

  // Generar slots: turno de mañana (8:00-14:00) + turno de tarde (15:30-19:00)
  const allSlots: string[] = [];

  // Mañana
  for (
    let hour = BUSINESS_HOURS.morningOpen;
    hour < BUSINESS_HOURS.morningClose;
    hour++
  ) {
    for (let min = 0; min < 60; min += BUSINESS_HOURS.slotMinutes) {
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      allSlots.push(time);
    }
  }
  // Tarde (empieza a las 15:30)
  for (
    let hour = BUSINESS_HOURS.afternoonOpen;
    hour < BUSINESS_HOURS.afternoonClose;
    hour++
  ) {
    const startMin = hour === 15 ? 30 : 0; // 15:30, luego 16:00, 16:30...
    for (let min = startMin; min < 60; min += BUSINESS_HOURS.slotMinutes) {
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      allSlots.push(time);
    }
  }

  // Filtrar los que ya están ocupados
  const bookedTimes = appointments
    .filter((a) => a.scheduledDate === date && a.status !== "CANCELLED")
    .map((a) => a.scheduledTime);

  return allSlots.filter((slot) => !bookedTimes.includes(slot));
}

// ─── Crear cita ───
export function createAppointment(
  data: Omit<DbAppointment, "id" | "status" | "createdAt">,
): DbAppointment {
  const appointment: DbAppointment = {
    ...data,
    id: crypto.randomUUID(),
    status: "PENDING",
    createdAt: new Date(),
  };
  appointments.push(appointment);
  return appointment;
}

// ─── Obtener citas por email ───
export function getAppointmentsByEmail(email: string): DbAppointment[] {
  return appointments
    .filter((a) => a.customerEmail === email)
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime(),
    );
}

// ─── Obtener todas las citas (admin) ───
export function getAllAppointments(): DbAppointment[] {
  return appointments.sort(
    (a, b) =>
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
  );
}

// ─── Actualizar estado de una cita ───
export function updateAppointmentStatus(
  id: string,
  status: DbAppointment["status"],
): DbAppointment | null {
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return null;
  appointment.status = status;
  return appointment;
}
