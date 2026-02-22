// server/utils/businessConfig.ts
// ─── Utilidad centralizada de configuración del taller ───
// Nuxt auto-importa todo lo de server/utils/ en los endpoints del servidor.
// → getBusinessConfig() y los helpers están disponibles sin importar nada.

export interface BusinessConfig {
  morningOpen:      string
  morningClose:     string
  afternoonEnabled: boolean
  afternoonOpen:    string
  afternoonClose:   string
  slotMinutes:      30 | 60 | 120
  firstSlot:        string
  lastSlot:         string
  workDays:         number[]
}

// Valores por defecto si la BD no tiene aún configuración guardada.
// En formato clave-valor para que coincida con el modelo BusinessConfig de Prisma.
export const CONFIG_DEFAULTS: Record<string, string> = {
  morning_open:      '08:00',
  morning_close:     '14:00',
  afternoon_enabled: 'true',
  afternoon_open:    '15:30',
  afternoon_close:   '19:00',
  slot_minutes:      '30',
  first_slot:        '08:00',
  last_slot:         '18:30',
  work_days:         '1,2,3,4,5',
}

// Lee la config de la BD y devuelve un objeto BusinessConfig con fallback a defaults.
export async function getBusinessConfig(): Promise<BusinessConfig> {
  const rows = await prisma.businessConfig.findMany()

  const map: Record<string, string> = { ...CONFIG_DEFAULTS }
  for (const row of rows) map[row.key] = row.value

  const get = (key: string): string => map[key] ?? CONFIG_DEFAULTS[key] ?? ''

  return {
    morningOpen:      get('morning_open'),
    morningClose:     get('morning_close'),
    afternoonEnabled: get('afternoon_enabled') === 'true',
    afternoonOpen:    get('afternoon_open'),
    afternoonClose:   get('afternoon_close'),
    slotMinutes:      parseInt(get('slot_minutes')) as 30 | 60 | 120,
    firstSlot:        get('first_slot'),
    lastSlot:         get('last_slot'),
    workDays:         get('work_days').split(',').map(Number),
  }
}

// ─── Helpers de tiempo ───
// Usados por generateSlots() y disponibles para cualquier endpoint que los necesite.

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function fromMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Genera todos los slots horarios disponibles según la configuración dada.
export function generateSlots(config: BusinessConfig): string[] {
  const slots: string[] = []
  const { slotMinutes, firstSlot, lastSlot } = config

  const firstMin          = toMinutes(firstSlot)
  const lastMin           = toMinutes(lastSlot)
  const morningCloseMin   = toMinutes(config.morningClose)
  const afternoonOpenMin  = toMinutes(config.afternoonOpen)
  const afternoonCloseMin = toMinutes(config.afternoonClose)

  // Turno de mañana: desde firstSlot hasta el menor de morningClose o lastSlot
  for (let min = firstMin; min < morningCloseMin && min <= lastMin; min += slotMinutes) {
    slots.push(fromMinutes(min))
  }

  // Turno de tarde (si está activo): desde afternoonOpen hasta el menor de afternoonClose o lastSlot
  if (config.afternoonEnabled) {
    const tardeStart = Math.max(afternoonOpenMin, firstMin)
    for (let min = tardeStart; min < afternoonCloseMin && min <= lastMin; min += slotMinutes) {
      slots.push(fromMinutes(min))
    }
  }

  return slots
}
