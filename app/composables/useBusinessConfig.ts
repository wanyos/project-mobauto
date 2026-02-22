// composables/useBusinessConfig.ts
// Configuración global del taller — compartida entre la página admin y el selector de fechas.
// Usa useState de Nuxt para cache global entre componentes (más ligero que Pinia).

import type { BusinessConfig } from '~/utils/businessConstants'
import { DEFAULT_CONFIG } from '~/utils/businessConstants'

export function useBusinessConfig() {
  const config = useState<BusinessConfig>('business-config', () => ({ ...DEFAULT_CONFIG }))
  const cargando = useState<boolean>('business-config-loading', () => false)

  // Carga la config desde la API pública y la guarda en el estado global.
  async function cargarConfig(): Promise<void> {
    if (cargando.value) return
    cargando.value = true
    try {
      const res = await $fetch<{ success: boolean; data: BusinessConfig }>('/api/config')
      if (res.success) {
        Object.assign(config.value, res.data)
      }
    } catch {
      // Si falla, se usan los defaults — la app sigue funcionando
    } finally {
      cargando.value = false
    }
  }

  function esDiaLaboral(dayOfWeek: number): boolean {
    return config.value.workDays.includes(dayOfWeek)
  }

  return { config, cargando, cargarConfig, esDiaLaboral }
}
