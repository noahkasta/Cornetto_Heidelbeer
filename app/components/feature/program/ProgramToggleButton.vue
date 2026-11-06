<script setup lang="ts">
const props = defineProps<{ sessionId: string }>()
const { has, toggle } = useMyProgram()
const inProgram = computed(() => has(props.sessionId))
</script>

<template>
  <BaseButton :variant="inProgram ? 'secondary' : 'primary'" @click="toggle(sessionId)">
    {{ inProgram ? 'Aus Mein Programm entfernen' : 'Zu Mein Programm hinzufügen' }}
  </BaseButton>
</template>
