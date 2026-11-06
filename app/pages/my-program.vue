<script setup lang="ts">
// Rendering (ADR Schritt 2, Punkt 4): nur im Browser (routeRules ssr: false),
// weil der Inhalt ausschließlich aus localStorage kommt.
useHead({ title: 'Mein Programm' })
</script>

<template>
  <div>
    <h1>Mein Programm</h1>
    <p class="page-lead">Deine gemerkten Sessions. Sie bleiben in diesem Browser gespeichert.</p>
    <ProgramTimeline />
  </div>
</template>

<style scoped>
.page-lead {
  color: var(--color-text-secondary);
}
</style>
