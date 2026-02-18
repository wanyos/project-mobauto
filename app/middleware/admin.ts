// ─── Middleware de Admin ───
// Protege rutas que solo pueden ver administradores.

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    // Si está logueado pero NO es admin, lo mandamos al inicio
    return navigateTo('/')
  }
})