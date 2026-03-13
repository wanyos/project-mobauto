// shared/types/business.ts
// ─── Tipos compartidos entre cliente y servidor ───
// Nuxt auto-importa el directorio shared/ en ambos lados.

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
