// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { statusColor, statusLabel, statusIcon } from '../../app/utils/statusHelpers'

// ─── statusColor ───

describe('statusColor', () => {
  it('devuelve "warning" para PENDING', () => {
    expect(statusColor('PENDING')).toBe('warning')
  })

  it('devuelve "primary" para CONFIRMED', () => {
    expect(statusColor('CONFIRMED')).toBe('primary')
  })

  it('devuelve "info" para IN_PROGRESS', () => {
    expect(statusColor('IN_PROGRESS')).toBe('info')
  })

  it('devuelve "positive" para COMPLETED', () => {
    expect(statusColor('COMPLETED')).toBe('positive')
  })

  it('devuelve "negative" para CANCELLED', () => {
    expect(statusColor('CANCELLED')).toBe('negative')
  })

  it('devuelve "grey" para estado desconocido', () => {
    expect(statusColor('UNKNOWN')).toBe('grey')
  })

  it('devuelve "grey" para string vacío', () => {
    expect(statusColor('')).toBe('grey')
  })
})

// ─── statusLabel ───

describe('statusLabel', () => {
  const expected: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    IN_PROGRESS: 'En curso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
  }

  Object.entries(expected).forEach(([status, label]) => {
    it(`devuelve "${label}" para ${status}`, () => {
      expect(statusLabel(status)).toBe(label)
    })
  })

  it('devuelve el mismo string si es desconocido', () => {
    expect(statusLabel('OTHER')).toBe('OTHER')
  })
})

// ─── statusIcon ───

describe('statusIcon', () => {
  const expected: Record<string, string> = {
    PENDING: 'schedule',
    CONFIRMED: 'event_available',
    IN_PROGRESS: 'build',
    COMPLETED: 'check_circle',
    CANCELLED: 'cancel',
  }

  Object.entries(expected).forEach(([status, icon]) => {
    it(`devuelve "${icon}" para ${status}`, () => {
      expect(statusIcon(status)).toBe(icon)
    })
  })

  it('devuelve "circle" para estado desconocido', () => {
    expect(statusIcon('UNKNOWN')).toBe('circle')
  })
})
