// ─── Composable de Autenticación ───
//
// ¿Qué es un composable?
// Es una función que encapsula lógica reactiva reutilizable.
// Nuxt auto-importa todo lo que esté en composables/ con prefijo "use".
//
// Uso en cualquier componente:
//   const { user, isAuthenticated, login, logout } = useAuth()

import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  // Función de login que además redirige según el rol
  async function login(email: string, password: string) {
    await store.login(email, password)
    if (store.isAdmin) {
      await router.push('/admin')
    } else {
      await router.push('/mi-cuenta')
    }
  }

  // Función de registro que además redirige
  async function register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    await store.register(data)
    await router.push('/mi-cuenta')
  }

  // Logout
  function logout() {
    store.logout()
  }

  // Exponer datos y funciones
  // toRefs() convierte las propiedades del store en refs individuales
  // para que mantengan la reactividad al desestructurar
  return {
    user: computed(() => store.user),
    token: computed(() => store.token),
    loading: computed(() => store.loading),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    fullName: computed(() => store.fullName),
    login,
    register,
    logout,
    fetchUser: store.fetchUser,
  }
}