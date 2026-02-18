// ─── Store de Autenticación con Pinia (Composition API) ───
//
// Usa la sintaxis de función (setup store) en vez de opciones.
// Es equivalente a un <script setup> pero para stores:
// - ref()      → reemplaza a state
// - computed() → reemplaza a getters
// - funciones  → reemplaza a actions
//
// IMPORTANTE: Usamos useCookie() en vez de localStorage para el token.
// Las cookies se envían automáticamente al servidor, así SSR y cliente
// ven el mismo estado de autenticación (evita errores de hidratación).

import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // ─── STATE ───
  // useCookie() funciona en SSR y cliente. El token persiste al recargar.
  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 días
  const user = ref<User | null>(null)
  const token = computed({
    get: () => tokenCookie.value ?? null,
    set: (val) => { tokenCookie.value = val },
  })
  const loading = ref(false)

  // ─── GETTERS ───
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const fullName = computed(() => {
    if (!user.value) return ''
    if (user.value.firstName) return `${user.value.firstName} ${user.value.lastName}`
    if (user.value.profile) return `${user.value.profile.firstname} ${user.value.profile.lastname}`
    return user.value.email
  })

  // ─── ACTIONS ───

  async function register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    loading.value = true
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data,
      })

      token.value = response.data.token
      user.value = response.data.user as User

      return response
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      token.value = response.data.token
      user.value = response.data.user as User

      return response
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      user.value = response.data as User
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    navigateTo('/')
  }

  return {
    // State
    user,
    token,
    loading,
    // Getters
    isAuthenticated,
    isAdmin,
    fullName,
    // Actions
    register,
    login,
    fetchUser,
    logout,
  }
})
