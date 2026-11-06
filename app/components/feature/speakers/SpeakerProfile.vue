<script setup lang="ts">
import type { Speaker } from '~/types/conference'

const props = defineProps<{ speaker: Speaker }>()
const { getSessionsBySpeaker } = useConferenceData()
const sessions = computed(() => getSessionsBySpeaker(props.speaker.id))
</script>

<template>
  <article class="speaker-profile">
    <p class="speaker-profile__eyebrow">Speaker</p>
    <h1>{{ speaker.name }}</h1>
    <p class="speaker-profile__role">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="speaker-profile__bio">{{ speaker.bio }}</p>

    <h2>{{ sessions.length === 1 ? 'Session' : 'Sessions' }}</h2>
    <SessionList :sessions="sessions" />
  </article>
</template>

<style scoped>
.speaker-profile__eyebrow {
  margin: 0;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-size: var(--font-size-100);
  letter-spacing: 0.08em;
}
.speaker-profile__role {
  font-size: var(--font-size-300);
  color: var(--color-text-secondary);
}
.speaker-profile__bio {
  max-width: 40rem;
}
</style>
