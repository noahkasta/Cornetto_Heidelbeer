<script setup lang="ts">
import type { Session } from '~/types/conference'

// Rendering (ADR Schritt 2, Punkt 2): ISR-Simulation über routeRules swr: 60.
const route = useRoute()
const id = String(route.params.id)
const { getSessionById, getTrackById, getRoomById, getSpeakersBySession, getDayNumber } = useConferenceData()

const found = getSessionById(id)
if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Session nicht gefunden', fatal: true })
}
const session: Session = found

const track = getTrackById(session.trackId)
const room = getRoomById(session.roomId)
const speakers = getSpeakersBySession(session.id)

// Zeitpunkt, zu dem diese Seite erzeugt wurde. Er kommt über den Payload in
// den Browser. Bleibt er beim Neuladen gleich, kam die Seite aus dem Cache.
const renderedAt = useState(`session-rendered-at-${id}`, () =>
  new Date().toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna' }),
)

useHead({ title: session.title })
</script>

<template>
  <article class="session-detail">
    <NuxtLink to="/" class="session-detail__back">← Alle Sessions</NuxtLink>

    <p class="session-detail__eyebrow">{{ track?.name }}</p>
    <h1>{{ session.title }}</h1>

    <dl class="session-detail__facts">
      <div><dt>Tag</dt><dd>Tag {{ getDayNumber(session.day) }} · {{ formatDay(session.day) }}</dd></div>
      <div><dt>Zeit</dt><dd>{{ formatTimeRange(session) }}</dd></div>
      <div><dt>Raum</dt><dd>{{ room?.name }}</dd></div>
      <div><dt>Track</dt><dd>{{ track?.name }}</dd></div>
      <div><dt>Level</dt><dd>{{ session.level }}</dd></div>
      <div><dt>Format</dt><dd>{{ session.format }}</dd></div>
    </dl>

    <p class="session-detail__abstract">{{ session.abstract }}</p>

    <ProgramToggleButton :session-id="session.id" />

    <h2>{{ speakers.length === 1 ? 'Speaker' : 'Speaker:innen' }}</h2>
    <ul class="session-detail__speakers">
      <li v-for="speaker in speakers" :key="speaker.id">
        <SpeakerCard :speaker="speaker" />
      </li>
    </ul>

    <p class="session-detail__render-note">
      Seite erzeugt um {{ renderedAt }} (ISR-Simulation, höchstens 60 Sekunden alt)
    </p>
  </article>
</template>

<style scoped>
.session-detail__back {
  display: inline-block;
  margin-bottom: var(--space-4);
}
.session-detail__eyebrow,
.session-detail__render-note {
  margin: 0;
  color: var(--color-text-secondary);
}
.session-detail__eyebrow {
  text-transform: uppercase;
  font-size: var(--font-size-100);
  letter-spacing: 0.08em;
}
.session-detail__facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--space-3);
  margin: var(--space-5) 0;
}
.session-detail__facts dt {
  font-size: var(--font-size-100);
  color: var(--color-text-secondary);
}
.session-detail__facts dd {
  margin: 0;
  font-weight: var(--font-weight-bold);
}
.session-detail__abstract {
  max-width: 40rem;
}
.session-detail__speakers {
  list-style: none;
  margin: 0 0 var(--space-6);
  padding: 0;
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
}
.session-detail__render-note {
  font-size: var(--font-size-100);
}
</style>
