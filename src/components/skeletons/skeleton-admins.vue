<script setup>
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="n in 6"
      :key="n"
      class="flex flex-wrap items-center justify-between gap-4 rounded-md border border-surface-200 p-4"
    >
      <div class="flex flex-col gap-2">
        <Skeleton width="8rem" height="1rem" />
        <Skeleton width="10rem" height="0.8rem" />
      </div>
      <div class="flex items-center gap-2">
        <Skeleton width="4rem" height="1.5rem" />
        <Skeleton width="4rem" height="1.5rem" />
      </div>
      <div class="flex items-center gap-2">
        <Skeleton width="5rem" height="2rem" />
        <Skeleton width="5rem" height="2rem" />
      </div>
    </div>
  </div>
</template>
