import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword, createToken, verifyToken } from '../../server/utils/auth'

// ─── hashPassword y comparePassword ───

describe('hashPassword / comparePassword', () => {
  it('hashea una contraseña y la verifica correctamente', async () => {
    const password = 'mi-contraseña-segura'
    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(0)

    const match = await comparePassword(password, hash)
    expect(match).toBe(true)
  })

  it('falla al comparar con contraseña incorrecta', async () => {
    const hash = await hashPassword('correcta')
    const match = await comparePassword('incorrecta', hash)
    expect(match).toBe(false)
  })

  it('genera hashes diferentes para la misma contraseña (salt)', async () => {
    const hash1 = await hashPassword('misma')
    const hash2 = await hashPassword('misma')
    expect(hash1).not.toBe(hash2)
  })
})

// ─── createToken y verifyToken ───

describe('createToken / verifyToken', () => {
  it('crea un token válido y lo verifica', () => {
    const payload = { userId: 'user-123', role: 'CUSTOMER' }
    const token = createToken(payload)

    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT tiene 3 partes

    const decoded = verifyToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded!.userId).toBe('user-123')
    expect(decoded!.role).toBe('CUSTOMER')
  })

  it('devuelve null para token inválido', () => {
    expect(verifyToken('token-falso')).toBeNull()
  })

  it('devuelve null para token vacío', () => {
    expect(verifyToken('')).toBeNull()
  })

  it('devuelve null para token manipulado', () => {
    const token = createToken({ userId: 'u1', role: 'ADMIN' })
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(verifyToken(tampered)).toBeNull()
  })

  it('preserva el rol ADMIN en el token', () => {
    const token = createToken({ userId: 'admin-1', role: 'ADMIN' })
    const decoded = verifyToken(token)
    expect(decoded!.role).toBe('ADMIN')
  })
})
