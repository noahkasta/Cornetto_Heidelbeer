<template>
  <main class="page-container">
    <slot />
  </main>
</template>

<style scoped>
.page-container {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--spacing-section) var(--space-5);
}
</style>