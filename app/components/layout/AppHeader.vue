<script setup lang="ts">
const { count, hydrated } = useMyProgram()
</script>

<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__name">Cornetto Heidelbeere</NuxtLink>
    <nav class="app-header__nav" aria-label="Hauptnavigation">
      <NuxtLink to="/">Sessions</NuxtLink>
      <NuxtLink to="/speakers">Speaker</NuxtLink>
      <NuxtLink to="/my-program">
        Mein Programm
        <span v-if="hydrated && count > 0" class="app-header__count">{{ count }}</span>
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-4) var(--space-5);
}
.app-header a {
  color: var(--color-on-primary);
  text-decoration: none;
}
.app-header__name {
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
.app-header__nav {
  display: flex;
  gap: var(--space-4);
}
.app-header__nav a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 0.3em;
}
.app-header__count {
  display: inline-block;
  min-width: 1.5em;
  margin-left: var(--space-1);
  padding: 0 var(--space-1);
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  text-align: center;
  font-weight: var(--font-weight-bold);
}
</style>
