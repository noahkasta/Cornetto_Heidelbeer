<script setup lang="ts">
import type { Speaker } from '~/types/conference'

const props = defineProps<{ speaker: Speaker }>()
const { getSessionsBySpeaker } = useConferenceData()
const sessionCount = computed(() => getSessionsBySpeaker(props.speaker.id).length)
</script>

<template>
  <BaseCard>
    <h3 class="speaker-card__name">
      <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
    </h3>
    <p class="speaker-card__role">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="speaker-card__count">
      {{ sessionCount }} {{ sessionCount === 1 ? 'Session' : 'Sessions' }}
    </p>
  </BaseCard>
</template>

<style scoped>
.speaker-card__name {
  margin: 0;
  font-size: var(--font-size-400);
}
.speaker-card__name a {
  color: inherit;
}
.speaker-card__role,
.speaker-card__count {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
