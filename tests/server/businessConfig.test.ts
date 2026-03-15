import { describe, it, expect, vi } from 'vitest'

// Mock de prisma para evitar que requiera DATABASE_URL
vi.mock('../../server/utils/prisma', () => ({
  prisma: {},
}))

import { toMinutes, fromMinutes, generateSlots } from '../../server/utils/businessConfig'
import type { BusinessConfig } from '../../shared/types/business'

// ─── toMinutes ───

describe('toMinutes', () => {
  it('convierte "08:00" a 480 minutos', () => {
    expect(toMinutes('08:00')).toBe(480)
  })

  it('convierte "00:00" a 0', () => {
    expect(toMinutes('00:00')).toBe(0)
  })

  it('convierte "14:30" a 870', () => {
    expect(toMinutes('14:30')).toBe(870)
  })

  it('convierte "23:59" a 1439', () => {
    expect(toMinutes('23:59')).toBe(1439)
  })

  it('convierte "15:30" a 930', () => {
    expect(toMinutes('15:30')).toBe(930)
  })
})

// ─── fromMinutes ───

describe('fromMinutes', () => {
  it('convierte 480 a "08:00"', () => {
    expect(fromMinutes(480)).toBe('08:00')
  })

  it('convierte 0 a "00:00"', () => {
    expect(fromMinutes(0)).toBe('00:00')
  })

  it('convierte 870 a "14:30"', () => {
    expect(fromMinutes(870)).toBe('14:30')
  })

  it('convierte 1439 a "23:59"', () => {
    expect(fromMinutes(1439)).toBe('23:59')
  })

  it('siempre devuelve formato HH:MM con ceros', () => {
    expect(fromMinutes(65)).toBe('01:05')
  })
})

// ─── toMinutes ↔ fromMinutes son inversos ───

describe('toMinutes y fromMinutes son inversos', () => {
  const times = ['00:00', '08:00', '12:30', '15:45', '23:59']

  it.each(times)('fromMinutes(toMinutes("%s")) === "%s"', (time) => {
    expect(fromMinutes(toMinutes(time))).toBe(time)
  })
})

// ─── generateSlots ───

describe('generateSlots', () => {
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

  it('genera slots con config por defecto', () => {
    const slots = generateSlots(defaultConfig)
    expect(slots.length).toBeGreaterThan(0)
  })

  it('el primer slot es 08:00', () => {
    const slots = generateSlots(defaultConfig)
    expect(slots[0]).toBe('08:00')
  })

  it('el último slot es 18:30', () => {
    const slots = generateSlots(defaultConfig)
    expect(slots[slots.length - 1]).toBe('18:30')
  })

  it('no genera slots entre 14:00 y 15:30 (descanso)', () => {
    const slots = generateSlots(defaultConfig)
    const breakSlots = slots.filter((s) => {
      const min = toMinutes(s)
      return min >= toMinutes('14:00') && min < toMinutes('15:30')
    })
    expect(breakSlots).toEqual([])
  })

  it('genera 12 slots de mañana (08:00 a 13:30 cada 30 min)', () => {
    const slots = generateSlots(defaultConfig)
    const morningSlots = slots.filter((s) => toMinutes(s) < toMinutes('14:00'))
    expect(morningSlots).toHaveLength(12)
  })

  it('genera 7 slots de tarde (15:30 a 18:30 cada 30 min)', () => {
    const slots = generateSlots(defaultConfig)
    const afternoonSlots = slots.filter((s) => toMinutes(s) >= toMinutes('15:30'))
    expect(afternoonSlots).toHaveLength(7)
  })

  it('no genera slots de tarde si afternoonEnabled es false', () => {
    const config = { ...defaultConfig, afternoonEnabled: false }
    const slots = generateSlots(config)
    const afternoonSlots = slots.filter((s) => toMinutes(s) >= toMinutes('14:00'))
    expect(afternoonSlots).toEqual([])
  })

  it('respeta slotMinutes de 60 minutos', () => {
    const config = { ...defaultConfig, slotMinutes: 60 as const }
    const slots = generateSlots(config)
    // Mañana: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00 = 6 slots
    const morningSlots = slots.filter((s) => toMinutes(s) < toMinutes('14:00'))
    expect(morningSlots).toHaveLength(6)
  })

  it('respeta slotMinutes de 120 minutos', () => {
    const config = { ...defaultConfig, slotMinutes: 120 as const }
    const slots = generateSlots(config)
    // Mañana: 08:00, 10:00, 12:00 = 3 slots
    const morningSlots = slots.filter((s) => toMinutes(s) < toMinutes('14:00'))
    expect(morningSlots).toHaveLength(3)
  })

  it('devuelve array vacío si firstSlot > lastSlot', () => {
    const config = { ...defaultConfig, firstSlot: '20:00', lastSlot: '08:00' }
    const slots = generateSlots(config)
    expect(slots).toEqual([])
  })

  it('todos los slots tienen formato HH:MM', () => {
    const slots = generateSlots(defaultConfig)
    slots.forEach((slot) => {
      expect(slot).toMatch(/^\d{2}:\d{2}$/)
    })
  })

  it('los slots están en orden cronológico', () => {
    const slots = generateSlots(defaultConfig)
    for (let i = 1; i < slots.length; i++) {
      expect(toMinutes(slots[i]!)).toBeGreaterThan(toMinutes(slots[i - 1]!))
    }
  })
})
