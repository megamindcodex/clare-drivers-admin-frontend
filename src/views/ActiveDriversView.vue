<script setup>
import ActiveDriversMap from '@/components/ActiveDriversMap.vue'
import ActiveDriversList from '@/components/ActiveDriversList.vue'
</script>

<template>
  <div class="p-4 h-full flex flex-col gap-2 min-h-0">
    <ActiveDriversMap />
    <ActiveDriversList class="flex-1 min-h-0" />
  </div>
</template>

