// app/utils/businessConstants.ts
// ─── Constantes y tipos compartidos del lado cliente ───
// Nuxt auto-importa todo lo de app/utils/ en componentes, composables y páginas.

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

export const DEFAULT_CONFIG: BusinessConfig = {
  morningOpen:      '08:00',
  morningClose:     '14:00',
  afternoonEnabled: true,
  afternoonOpen:    '15:30',
  afternoonClose:   '19:00',
  slotMinutes:      30,
  firstSlot:        '08:00',
  lastSlot:         '18:30',
  workDays:         [1, 2, 3, 4, 5],
}

export const DIAS_SEMANA = [
  { label: 'Lunes',     value: 1 },
  { label: 'Martes',    value: 2 },
  { label: 'Miércoles', value: 3 },
  { label: 'Jueves',    value: 4 },
  { label: 'Viernes',   value: 5 },
  { label: 'Sábado',    value: 6 },
  { label: 'Domingo',   value: 0 },
] as const
