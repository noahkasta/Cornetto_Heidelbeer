import type { Level } from '~/types/conference'

export interface SessionFilters {
  day: string | null
  trackId: string | null
  level: Level | null
}

const emptyFilters = (): SessionFilters => ({ day: null, trackId: null, level: null })

// Headless-Logik für die Session-Übersicht (ADR 02, Schritt 1).
// Die Filter sind UND-verknüpft: eine Session muss alle gesetzten Filter erfüllen.
// Der Zustand liegt in useState, damit er beim Wechsel zur Detailseite und
// zurück erhalten bleibt.
export function useSessionFilters() {
  const { sessions } = useConferenceData()
  const filters = useState<SessionFilters>('session-filters', emptyFilters)

  const filteredSessions = computed(() => {
    const { day, trackId, level } = filters.value
    return sessions.filter(session =>
      (day === null || session.day === day)
      && (trackId === null || session.trackId === trackId)
      && (level === null || session.level === level),
    )
  })

  const hasActiveFilters = computed(() =>
    Object.values(filters.value).some(value => value !== null),
  )

  function setFilter<K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) {
    filters.value = { ...filters.value, [key]: value }
  }

  function resetFilters() {
    filters.value = emptyFilters()
  }

  return {
    filters: readonly(filters),
    filteredSessions,
    hasActiveFilters,
    total: sessions.length,
    setFilter,
    resetFilters,
  }
}
