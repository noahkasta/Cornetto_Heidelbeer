<template>
  <header class="app-header">
    <span class="app-header__name">Cornetto Heidelbeere</span>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-4) var(--space-5);
  font-family: var(--text-heading-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-300);
}
.app-header__name::after {
  content: "";
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: var(--space-2);
  border-radius: var(--radius-pill);
  background: var(--color-accent);
}
</style>