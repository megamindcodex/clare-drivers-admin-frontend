<script setup>
import Card from 'primevue/card'

defineProps({
  message: { type: String, default: 'No data found.' },
})
</script>

<template>
  <Card>
    <template #content>
      <p class="text-center text-surface-500 py-8">{{ message }}</p>
    </template>
  </Card>
</template>
