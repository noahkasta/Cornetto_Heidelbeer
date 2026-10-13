<script setup lang="ts">
const { conference, sessions } = useConferenceData()
</script>

<template>
  <h1>{{ conference.name }}</h1>
  <p>{{ sessions.length }} Sessions geladen</p>
</template>