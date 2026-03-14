import { describe, it, expect } from 'vitest'
import { generateSlots, toMinutes } from '../../server/utils/businessConfig'
import type { BusinessConfig } from '../../shared/types/business'

// ─── Tests del filtro de horas pasadas (lógica del endpoint /api/appointments/slots) ───
// Aquí testeamos la lógica de filtrado que se aplica en el endpoint,
// replicando el mismo algoritmo para verificar que funciona correctamente.

const defaultConfig: BusinessConfig = {
  morningOpen: '08:00',
  morningClose: '14:00',
  afternoonEnabled: true,
  afternoonOpen: '15:30',
  afternoonClose: '19:00',
  slotMinutes: 30,
  firstSlot: '08:00',
  lastSlot: '18:30',
  workDays: [1, 2, 3, 4, 5],
}

/** Replica la lógica del endpoint para filtrar slots pasados */
function filterPastSlots(allSlots: string[], currentHour: number, currentMinute: number): string[] {
  const currentMinutes = currentHour * 60 + currentMinute
  return allSlots.filter((s) => {
    const parts = s.split(':').map(Number)
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0) > currentMinutes
  })
}

describe('Filtro de slots pasados (lógica del endpoint)', () => {
  const allSlots = generateSlots(defaultConfig)

  it('a las 07:00 todos los slots están disponibles', () => {
    const available = filterPastSlots(allSlots, 7, 0)
    expect(available).toEqual(allSlots)
  })

  it('a las 08:00 el slot de las 08:00 ya NO está disponible', () => {
    const available = filterPastSlots(allSlots, 8, 0)
    expect(available).not.toContain('08:00')
    expect(available[0]).toBe('08:30')
  })

  it('a las 13:59 solo queda el turno de tarde', () => {
    const available = filterPastSlots(allSlots, 13, 59)
    available.forEach((s) => {
      expect(toMinutes(s)).toBeGreaterThan(13 * 60 + 59)
    })
  })

  it('a las 14:30 (en el descanso) solo hay slots de tarde', () => {
    const available = filterPastSlots(allSlots, 14, 30)
    expect(available.length).toBeGreaterThan(0)
    expect(available[0]).toBe('15:30')
  })

  it('a las 18:30 el último slot ya no está disponible', () => {
    const available = filterPastSlots(allSlots, 18, 30)
    expect(available).not.toContain('18:30')
  })

  it('a las 19:00 no hay ningún slot disponible', () => {
    const available = filterPastSlots(allSlots, 19, 0)
    expect(available).toEqual([])
  })

  it('a las 21:00 (taller cerrado) no hay ningún slot', () => {
    const available = filterPastSlots(allSlots, 21, 0)
    expect(available).toEqual([])
  })

  it('a las 23:59 no hay ningún slot', () => {
    const available = filterPastSlots(allSlots, 23, 59)
    expect(available).toEqual([])
  })

  it('a las 10:15 no incluye 10:00 pero sí 10:30', () => {
    const available = filterPastSlots(allSlots, 10, 15)
    expect(available).not.toContain('10:00')
    expect(available).toContain('10:30')
  })

  it('filtra correctamente con slots de 60 minutos', () => {
    const config60 = { ...defaultConfig, slotMinutes: 60 as const }
    const slots60 = generateSlots(config60)
    const available = filterPastSlots(slots60, 10, 0)

    expect(available).not.toContain('08:00')
    expect(available).not.toContain('09:00')
    expect(available).not.toContain('10:00')
    expect(available).toContain('11:00')
  })
})
