import conferenceData from '~~/data/conference_data.json'
import type { ConferenceData, Level, Room, Session, Speaker, Track } from '~/types/conference'

// Zentrale Datenschicht (State-Konzept Schritt 1). Die JSON-Datei wird beim
// Build eingebunden. Die Daten sind schreibgeschützt und für alle Besucher
// gleich, deshalb dürfen Sortierung und Nachschlage-Tabellen einmal auf
// Modulebene entstehen. Seiten und Komponenten greifen nur über dieses
// Composable auf die Daten zu. Ein späterer Wechsel auf fetch betrifft nur
// diese Datei.
const data = conferenceData as ConferenceData

const LEVEL_ORDER: Level[] = ['Einsteiger', 'Fortgeschritten', 'Experte']

function compareSessions(a: Session, b: Session): number {
  return (
    a.day.localeCompare(b.day)
    || a.startTime.localeCompare(b.startTime)
    || a.roomId.localeCompare(b.roomId)
  )
}

const sessions: Session[] = [...data.sessions].sort(compareSessions)
const speakers: Speaker[] = [...data.speakers].sort((a, b) => a.name.localeCompare(b.name, 'de'))

const sessionsById = new Map(sessions.map(s => [s.id, s]))
const speakersById = new Map(speakers.map(s => [s.id, s]))
const tracksById = new Map(data.tracks.map(t => [t.id, t]))
const roomsById = new Map(data.rooms.map(r => [r.id, r]))

const levels: Level[] = LEVEL_ORDER.filter(level => sessions.some(s => s.level === level))

export function useConferenceData() {
  return {
    conference: data.conference,
    days: data.conference.dates,
    tracks: data.tracks,
    rooms: data.rooms,
    levels,
    sessions,
    speakers,

    getSessionById: (id: string): Session | undefined => sessionsById.get(id),
    getSpeakerById: (id: string): Speaker | undefined => speakersById.get(id),
    getTrackById: (id: string): Track | undefined => tracksById.get(id),
    getRoomById: (id: string): Room | undefined => roomsById.get(id),

    // Quelle der Wahrheit für die Zuordnung sind die speakerIds der Sessions.
    getSessionsBySpeaker: (speakerId: string): Session[] =>
      sessions.filter(s => s.speakerIds.includes(speakerId)),

    getSpeakersBySession: (sessionId: string): Speaker[] =>
      (sessionsById.get(sessionId)?.speakerIds ?? [])
        .map(id => speakersById.get(id))
        .filter((s): s is Speaker => s !== undefined),

    getDayNumber: (day: string): number => data.conference.dates.indexOf(day) + 1,

    sortSessions: (list: Session[]): Session[] => [...list].sort(compareSessions),
  }
}
