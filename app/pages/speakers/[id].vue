<script setup lang="ts">
import type { Speaker } from '~/types/conference'

// Rendering (ADR Schritt 2, Punkt 1): alle 18 Profile beim Build vorgerendert (SSG).
const route = useRoute()
const { getSpeakerById } = useConferenceData()

const found = getSpeakerById(String(route.params.id))
if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker nicht gefunden', fatal: true })
}
const speaker: Speaker = found

useHead({ title: speaker.name })
</script>

<template>
  <div>
    <NuxtLink to="/speakers" class="back">← Alle Speaker</NuxtLink>
    <SpeakerProfile :speaker="speaker" />
  </div>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: var(--space-4);
}
</style>
