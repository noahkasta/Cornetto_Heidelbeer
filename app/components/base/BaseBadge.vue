<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'neutral' | 'track' | 'level' }>(), {
  tone: 'neutral',
})
</script>

<template>
  <span class="base-badge" :class="`base-badge--${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-block;
  font-size: var(--font-size-100);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.base-badge--track {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}
.base-badge--level {
  background: var(--color-highlight);
  border-color: var(--color-highlight);
  color: var(--color-on-highlight);
}
</style>
