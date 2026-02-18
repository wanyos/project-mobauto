// ─── Middleware de Autenticación ───
//
// ¿Cómo se usa? En la página que quieras proteger:
//
//   <script setup>
//   definePageMeta({ middleware: 'auth' })
//   </script>
//
// Nuxt ejecutará este middleware ANTES de renderizar la página.
// Si el usuario no está logueado, lo redirige a /login.

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    // Guardar la URL a la que quería ir, para redirigirlo después del login
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})