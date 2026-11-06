import type { Session } from '~/types/conference'

// Versionierter Schlüssel laut State-Konzept (Schritt 1)
const STORAGE_KEY = 'cornetto-my-program-v1'

function overlaps(a: Session, b: Session): boolean {
  return a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime
}

// "Mein Programm": gespeichert werden nur Session-IDs. Die Session-Daten
// kommen immer frisch aus useConferenceData(), es gibt keine Kopien.
export function useMyProgram() {
  const ids = useState<string[]>('my-program-ids', () => [])
  const hydrated = useState<boolean>('my-program-hydrated', () => false)
  const { days, getSessionById, sortSessions, getDayNumber } = useConferenceData()

  const sessions = computed(() =>
    sortSessions(
      ids.value
        .map(id => getSessionById(id))
        .filter((s): s is Session => s !== undefined),
    ),
  )

  const sessionsByDay = computed(() =>
    days
      .map(day => ({
        day,
        dayNumber: getDayNumber(day),
        sessions: sessions.value.filter(s => s.day === day),
      }))
      .filter(group => group.sessions.length > 0),
  )

  // Sessions im Programm, die sich zeitlich mit einer anderen überschneiden
  const conflictIds = computed(() => {
    const result = new Set<string>()
    const list = sessions.value
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (overlaps(list[i]!, list[j]!)) {
          result.add(list[i]!.id)
          result.add(list[j]!.id)
        }
      }
    }
    return result
  })

  const count = computed(() => ids.value.length)

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
    }
    catch {
      // Speicher voll oder gesperrt (z. B. privater Modus): App läuft ohne Persistenz weiter
    }
  }

  // Rehydration: gespeicherte IDs lesen, ungültiges JSON und unbekannte IDs
  // aussortieren, bereinigte Liste zurückschreiben. Läuft nur im Browser und
  // nur einmal (siehe plugins/my-program.client.ts).
  function hydrate() {
    if (!import.meta.client || hydrated.value) return

    let stored: unknown = []
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    }
    catch {
      stored = []
    }

    const valid = Array.isArray(stored)
      ? stored.filter((id): id is string => typeof id === 'string' && getSessionById(id) !== undefined)
      : []

    ids.value = [...new Set(valid)]
    hydrated.value = true
    persist()
  }

  function has(id: string): boolean {
    return ids.value.includes(id)
  }

  function add(id: string) {
    hydrate()
    if (!getSessionById(id) || has(id)) return
    ids.value = [...ids.value, id]
    persist()
  }

  function remove(id: string) {
    hydrate()
    ids.value = ids.value.filter(existing => existing !== id)
    persist()
  }

  function toggle(id: string) {
    if (has(id)) remove(id)
    else add(id)
  }

  return {
    ids: readonly(ids),
    hydrated: readonly(hydrated),
    sessions,
    sessionsByDay,
    conflictIds,
    count,
    has,
    add,
    remove,
    toggle,
    hydrate,
  }
}
