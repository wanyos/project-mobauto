// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG, DIAS_SEMANA } from '../../app/utils/businessConstants'

// ─── DEFAULT_CONFIG ───

describe('DEFAULT_CONFIG', () => {
  it('tiene horario de mañana 08:00 - 14:00', () => {
    expect(DEFAULT_CONFIG.morningOpen).toBe('08:00')
    expect(DEFAULT_CONFIG.morningClose).toBe('14:00')
  })

  it('tiene turno de tarde activado', () => {
    expect(DEFAULT_CONFIG.afternoonEnabled).toBe(true)
  })

  it('tiene horario de tarde 15:30 - 19:00', () => {
    expect(DEFAULT_CONFIG.afternoonOpen).toBe('15:30')
    expect(DEFAULT_CONFIG.afternoonClose).toBe('19:00')
  })

  it('tiene slots de 30 minutos', () => {
    expect(DEFAULT_CONFIG.slotMinutes).toBe(30)
  })

  it('tiene primer slot a las 08:00 y último a las 18:30', () => {
    expect(DEFAULT_CONFIG.firstSlot).toBe('08:00')
    expect(DEFAULT_CONFIG.lastSlot).toBe('18:30')
  })

  it('trabaja de lunes a viernes (1-5)', () => {
    expect(DEFAULT_CONFIG.workDays).toEqual([1, 2, 3, 4, 5])
  })

  it('no incluye sábado (6) ni domingo (0)', () => {
    expect(DEFAULT_CONFIG.workDays).not.toContain(0)
    expect(DEFAULT_CONFIG.workDays).not.toContain(6)
  })
})

// ─── DIAS_SEMANA ───

describe('DIAS_SEMANA', () => {
  it('tiene 7 días', () => {
    expect(DIAS_SEMANA).toHaveLength(7)
  })

  it('empieza por Lunes (value: 1)', () => {
    expect(DIAS_SEMANA[0]!.label).toBe('Lunes')
    expect(DIAS_SEMANA[0]!.value).toBe(1)
  })

  it('termina con Domingo (value: 0)', () => {
    expect(DIAS_SEMANA[6]!.label).toBe('Domingo')
    expect(DIAS_SEMANA[6]!.value).toBe(0)
  })

  it('contiene todos los valores 0-6', () => {
    const values = DIAS_SEMANA.map((d) => d.value).sort()
    expect(values).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('cada día tiene label y value', () => {
    DIAS_SEMANA.forEach((dia) => {
      expect(dia.label).toBeTruthy()
      expect(typeof dia.value).toBe('number')
    })
  })
})
