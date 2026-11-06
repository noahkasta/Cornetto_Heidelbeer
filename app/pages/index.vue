<script setup lang="ts">
// Rendering (ADR Schritt 2, Punkt 3): beim Build vorgerendert (SSG),
// gefiltert wird danach im Browser über useSessionFilters().
const { conference } = useConferenceData()
const { filteredSessions, total } = useSessionFilters()

useHead({ title: `Sessions · ${conference.name}` })
</script>

<template>
  <div>
    <h1>Sessions</h1>
    <p class="page-lead">{{ conference.name }} · {{ conference.tagline }}</p>

    <SessionFilterBar />

    <p class="result-count" aria-live="polite">
      {{ filteredSessions.length }} von {{ total }} Sessions
    </p>

    <SessionList :sessions="filteredSessions">
      <template #empty>Keine Session passt zu allen gewählten Filtern.</template>
    </SessionList>
  </div>
</template>

<style scoped>
.page-lead,
.result-count {
  color: var(--color-text-secondary);
}
</style>
