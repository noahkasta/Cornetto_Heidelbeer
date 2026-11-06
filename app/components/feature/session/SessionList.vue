<script setup lang="ts">
import type { Session } from '~/types/conference'

defineProps<{ sessions: readonly Session[] }>()
</script>

<template>
  <ul v-if="sessions.length" class="session-list">
    <li v-for="session in sessions" :key="session.id">
      <SessionCard :session="session" />
    </li>
  </ul>
  <p v-else class="session-list__empty">
    <slot name="empty">Keine Sessions gefunden.</slot>
  </p>
</template>

<style scoped>
.session-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}
.session-list__empty {
  color: var(--color-text-secondary);
}
</style>
