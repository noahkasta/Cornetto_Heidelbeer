<script setup lang="ts">
useHead({
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>