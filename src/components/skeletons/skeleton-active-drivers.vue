<script setup>
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div
      v-for="n in 6"
      :key="n"
      class="min-w-0 flex flex-col gap-2 border p-2 border-surface-200"
    >
      <div class="flex justify-between">
        <Skeleton width="3rem" height="1.2rem" />
        <Skeleton width="4rem" height="1.2rem" />
      </div>
      <Skeleton width="100%" height="0.8rem" />
      <Skeleton width="100%" height="0.8rem" />
      <Skeleton width="100%" height="0.8rem" />
    </div>
  </div>
</template>
