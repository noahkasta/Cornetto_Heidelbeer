<script setup lang="ts">
const { days, tracks, levels, getDayNumber } = useConferenceData()
const { filters, setFilter, resetFilters, hasActiveFilters } = useSessionFilters()
</script>

<template>
  <section class="filter-bar" aria-label="Sessions filtern">
    <fieldset class="filter-bar__group">
      <legend>Tag</legend>
      <BaseChip :selected="filters.day === null" @click="setFilter('day', null)">Alle</BaseChip>
      <BaseChip
        v-for="day in days"
        :key="day"
        :selected="filters.day === day"
        @click="setFilter('day', day)"
      >
        Tag {{ getDayNumber(day) }} · {{ formatDay(day) }}
      </BaseChip>
    </fieldset>

    <fieldset class="filter-bar__group">
      <legend>Track</legend>
      <BaseChip :selected="filters.trackId === null" @click="setFilter('trackId', null)">Alle</BaseChip>
      <BaseChip
        v-for="track in tracks"
        :key="track.id"
        :selected="filters.trackId === track.id"
        @click="setFilter('trackId', track.id)"
      >
        {{ track.name }}
      </BaseChip>
    </fieldset>

    <fieldset class="filter-bar__group">
      <legend>Level</legend>
      <BaseChip :selected="filters.level === null" @click="setFilter('level', null)">Alle</BaseChip>
      <BaseChip
        v-for="level in levels"
        :key="level"
        :selected="filters.level === level"
        @click="setFilter('level', level)"
      >
        {{ level }}
      </BaseChip>
    </fieldset>

    <BaseButton v-if="hasActiveFilters" variant="ghost" @click="resetFilters">
      Filter zurücksetzen
    </BaseButton>
  </section>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.filter-bar__group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  border: 0;
}
.filter-bar__group legend {
  width: 100%;
  margin-bottom: var(--space-1);
  font-weight: var(--font-weight-bold);
}
</style>
