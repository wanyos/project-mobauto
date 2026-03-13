// app/utils/statusHelpers.ts
// ─── Helpers de estado para citas ───
// Nuxt auto-importa desde app/utils/ en componentes y páginas.

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'warning', CONFIRMED: 'primary', IN_PROGRESS: 'info',
    COMPLETED: 'positive', CANCELLED: 'negative',
  }
  return colors[status] || 'grey'
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente', CONFIRMED: 'Confirmada', IN_PROGRESS: 'En curso',
    COMPLETED: 'Completada', CANCELLED: 'Cancelada',
  }
  return labels[status] || status
}

export function statusIcon(status: string): string {
  const icons: Record<string, string> = {
    PENDING: 'schedule', CONFIRMED: 'event_available', IN_PROGRESS: 'build',
    COMPLETED: 'check_circle', CANCELLED: 'cancel',
  }
  return icons[status] || 'circle'
}
