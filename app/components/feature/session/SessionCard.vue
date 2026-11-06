<script setup lang="ts">
import type { Session } from '~/types/conference'

const props = defineProps<{ session: Session }>()
const { getTrackById, getRoomById, getSpeakersBySession } = useConferenceData()

const track = computed(() => getTrackById(props.session.trackId))
const room = computed(() => getRoomById(props.session.roomId))
const speakers = computed(() => getSpeakersBySession(props.session.id))
</script>

<template>
  <BaseCard>
    <p class="session-card__meta">
      {{ formatDay(session.day) }} · {{ formatTimeRange(session) }} · {{ room?.name }}
    </p>
    <h3 class="session-card__title">
      <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
    </h3>
    <p class="session-card__speakers">
      <template v-for="(speaker, index) in speakers" :key="speaker.id">
        <span v-if="index > 0">, </span>
        <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
      </template>
    </p>
    <div class="session-card__badges">
      <BaseBadge tone="track">{{ track?.name }}</BaseBadge>
      <BaseBadge tone="level">{{ session.level }}</BaseBadge>
      <BaseBadge>{{ session.format }}</BaseBadge>
    </div>
    <div class="session-card__action">
      <ProgramToggleButton :session-id="session.id" />
    </div>
  </BaseCard>
</template>

<style scoped>
.session-card__meta {
  margin: 0;
  font-size: var(--font-size-200);
  color: var(--color-text-secondary);
}
.session-card__title {
  margin: 0;
  font-size: var(--font-size-400);
}
.session-card__title a {
  color: inherit;
}
.session-card__speakers {
  margin: 0;
}
.session-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.session-card__action {
  margin-top: auto;
}
</style>
