// ─── Plugin de Autenticación ───
//
// Se ejecuta UNA VEZ al arrancar la app (en servidor Y cliente).
// Si hay un token en la cookie, llama a /api/auth/me para
// restaurar los datos del usuario.

import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia as any)

  // Si hay token en la cookie, restaurar la sesión
  await authStore.fetchUser()
})
