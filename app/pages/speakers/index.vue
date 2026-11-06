<script setup lang="ts">
// Rendering (ADR Schritt 2, Punkt 1): beim Build vorgerendert (SSG).
const { speakers } = useConferenceData()

useHead({ title: 'Speaker' })
</script>

<template>
  <div>
    <h1>Speaker</h1>
    <ul class="speaker-list">
      <li v-for="speaker in speakers" :key="speaker.id">
        <SpeakerCard :speaker="speaker" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.speaker-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
}
</style>
