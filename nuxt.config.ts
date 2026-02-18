export default defineNuxtConfig({
  // Fecha de compatibilidad (Nuxt lo usa para features internas)
  compatibilityDate: '2025-07-15',

  // Herramientas de desarrollo (solo en modo dev)
  devtools: { enabled: false },

  // ─── CSS GLOBAL ───
  css: ['~/assets/css/main.css'],

  // ─── MÓDULOS ───
  // Los módulos extienden Nuxt con funcionalidades extra.
  // Cada string aquí carga un paquete que ya instalaste con npm.
  modules: [// Activa Pinia (stores)
  '@pinia/nuxt', // Activa Quasar Framework
  'nuxt-quasar-ui', 
  '@nuxtjs/tailwindcss'
],

  // ─── CONFIGURACIÓN DE QUASAR ───
  quasar: {
    // Plugins de Quasar que queremos usar globalmente
    plugins: ['Notify', 'Dialog', 'Loading'],
    config: {
      brand: {
        // Colores de Mobauto
        // Azul oscuro profesional (confianza, seriedad en automoción)
        // Naranja como acento (energía, acción — ideal para CTAs y destacados)
        primary: '#1B3A5C',    // Azul oscuro — color principal de Mobauto
        secondary: '#2D5F8A',  // Azul medio — variación para hover, fondos
        accent: '#E8712B',     // Naranja — botones de acción, llamadas a la acción
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
  },

  // ─── CONFIGURACIÓN DE LA APP ───
  app: {
    head: {
      // Título por defecto (se puede sobrescribir por página)
      title: 'Mobauto - Taller de Chapa, Pintura y Mecánica en Humanes de Madrid',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Mobauto — Taller de chapa, pintura y reparación de vehículos en Humanes de Madrid. Más de 10 años de experiencia. Presupuesto sin compromiso. Tel: 916 04 12 62',
        },
      ],
      // Fuentes: Roboto (texto general) + Montserrat (títulos, más impacto)
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@600;700;800&display=swap',
        },
      ],
    },
  },

  // ─── TYPESCRIPT ───
  typescript: {
    strict: true, // Modo estricto: te obliga a tipar bien. Molesto al inicio, salvador después.
  },
})