<script setup lang="ts">
defineProps<{ selected?: boolean }>()
</script>

<template>
  <button
    type="button"
    class="base-chip"
    :class="{ 'base-chip--selected': selected }"
    :aria-pressed="selected ? 'true' : 'false'"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-chip {
  font: inherit;
  font-size: var(--font-size-200);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
  cursor: pointer;
}
.base-chip--selected {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: var(--font-weight-bold);
}
.base-chip:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
</style>
