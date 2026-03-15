// server/utils/rateLimit.ts
// ─── Rate limiter en memoria para proteger endpoints de auth ───

import { type H3Event, getHeader, createError } from 'h3'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Limpia entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Aplica rate limiting por IP.
 * @param event - evento H3
 * @param maxRequests - máximo de peticiones permitidas en la ventana
 * @param windowMs - ventana de tiempo en milisegundos (default: 15 min)
 */
export function rateLimit(event: H3Event, maxRequests = 10, windowMs = 15 * 60 * 1000) {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getHeader(event, 'x-real-ip')
    || 'unknown'

  const key = `${ip}:${event.path}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  entry.count++

  if (entry.count > maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos. Inténtalo de nuevo más tarde.',
    })
  }
}
