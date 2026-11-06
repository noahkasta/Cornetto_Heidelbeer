<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'ghost' }>(), {
  variant: 'primary',
})
</script>

<template>
  <button type="button" class="base-button" :class="`base-button--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  font: inherit;
  font-weight: var(--font-weight-bold);
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  cursor: pointer;
}
.base-button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
.base-button--secondary {
  background: transparent;
  color: var(--color-primary);
}
.base-button--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-link);
  text-decoration: underline;
}
.base-button:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
</style>
