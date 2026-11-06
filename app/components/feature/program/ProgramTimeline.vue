<script setup lang="ts">
const { hydrated, sessionsByDay, conflictIds, remove } = useMyProgram()
const { getRoomById } = useConferenceData()
</script>

<template>
  <p v-if="!hydrated" class="program-timeline__status">Programm wird geladen …</p>

  <div v-else-if="sessionsByDay.length === 0" class="program-timeline__empty">
    <p>Du hast noch keine Sessions gemerkt.</p>
    <NuxtLink to="/">Zur Session-Übersicht</NuxtLink>
  </div>

  <div v-else class="program-timeline">
    <section v-for="group in sessionsByDay" :key="group.day">
      <h2>Tag {{ group.dayNumber }} · {{ formatDay(group.day) }}</h2>
      <ol class="program-timeline__list">
        <li v-for="session in group.sessions" :key="session.id" class="program-timeline__item">
          <time class="program-timeline__time">{{ formatTimeRange(session) }}</time>
          <div class="program-timeline__body">
            <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
            <span class="program-timeline__room">{{ getRoomById(session.roomId)?.name }}</span>
            <p v-if="conflictIds.has(session.id)" class="program-timeline__conflict">
              Zeitkonflikt mit einer anderen Session in deinem Programm
            </p>
          </div>
          <BaseButton variant="ghost" @click="remove(session.id)">Entfernen</BaseButton>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.program-timeline__status,
.program-timeline__room {
  color: var(--color-text-secondary);
}
.program-timeline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.program-timeline__item {
  display: grid;
  grid-template-columns: 7rem 1fr auto;
  align-items: start;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.program-timeline__time {
  font-weight: var(--font-weight-bold);
}
.program-timeline__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.program-timeline__conflict {
  margin: 0;
  color: var(--color-danger);
  font-size: var(--font-size-200);
}
@media (max-width: 40rem) {
  .program-timeline__item {
    grid-template-columns: 1fr;
  }
}
</style>
