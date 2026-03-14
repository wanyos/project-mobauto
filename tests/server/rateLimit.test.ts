import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de createError (auto-importado por Nuxt en server/utils)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

// Mock de getHeader
vi.stubGlobal('getHeader', (event: any, name: string) => {
  return event.headers?.[name] ?? null
})

// Importar después de los mocks globales
const { rateLimit } = await import('../../server/utils/rateLimit')

function createMockEvent(ip: string, path: string) {
  return {
    path,
    headers: { 'x-forwarded-for': ip },
  } as any
}

describe('rateLimit', () => {
  // Cada test usa un IP/path diferente para evitar colisiones con el store global

  it('permite la primera petición', () => {
    const event = createMockEvent('1.1.1.1', '/test-1')
    expect(() => rateLimit(event, 5, 60000)).not.toThrow()
  })

  it('permite peticiones dentro del límite', () => {
    const event = createMockEvent('2.2.2.2', '/test-2')
    for (let i = 0; i < 5; i++) {
      expect(() => rateLimit(event, 5, 60000)).not.toThrow()
    }
  })

  it('lanza error 429 al exceder el límite', () => {
    const event = createMockEvent('3.3.3.3', '/test-3')

    // Hacer 5 peticiones (el límite)
    for (let i = 0; i < 5; i++) {
      rateLimit(event, 5, 60000)
    }

    // La 6ª debe lanzar error
    expect(() => rateLimit(event, 5, 60000)).toThrow()

    try {
      rateLimit(event, 5, 60000)
    } catch (err: any) {
      expect(err.statusCode).toBe(429)
    }
  })

  it('IPs diferentes tienen contadores separados', () => {
    const event1 = createMockEvent('4.4.4.4', '/test-4')
    const event2 = createMockEvent('5.5.5.5', '/test-4')

    // Agotar el límite para IP 4.4.4.4
    for (let i = 0; i < 3; i++) {
      rateLimit(event1, 3, 60000)
    }

    // IP 5.5.5.5 sigue pudiendo hacer peticiones
    expect(() => rateLimit(event2, 3, 60000)).not.toThrow()
  })

  it('rutas diferentes tienen contadores separados', () => {
    const event1 = createMockEvent('6.6.6.6', '/ruta-a')
    const event2 = createMockEvent('6.6.6.6', '/ruta-b')

    for (let i = 0; i < 2; i++) {
      rateLimit(event1, 2, 60000)
    }

    // Misma IP pero ruta distinta → no debe lanzar
    expect(() => rateLimit(event2, 2, 60000)).not.toThrow()
  })
})
