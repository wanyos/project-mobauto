// ─── Funciones de ayuda para autenticación ───

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

// Secret para firmar los JWT. En producción DEBE estar en variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'mobauto-dev-secret-cambiar-en-produccion'
const JWT_EXPIRES_IN = '7d' // El token expira en 7 días

// ─── Hashear contraseña ───
// bcrypt añade "sal" (datos aleatorios) y hashea la contraseña.
// Así, incluso si dos usuarios tienen la misma contraseña, los hashes son diferentes.
// El número 12 es el "cost factor": más alto = más seguro pero más lento.
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// ─── Comparar contraseña con hash ───
// Verifica si la contraseña ingresada coincide con el hash guardado.
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── Crear JWT ───
// Recibe un payload (datos del usuario) y devuelve un token firmado.
export function createToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// ─── Verificar JWT ───
// Recibe un token y devuelve los datos si es válido, o null si expiró/es inválido.
export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

// ─── Obtener usuario de la petición ───
// Lee el header "Authorization: Bearer <token>" y extrae los datos del usuario.
export function getUserFromEvent(event: H3Event): { userId: string; role: string } | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7) // Quita "Bearer " del inicio
  return verifyToken(token)
}