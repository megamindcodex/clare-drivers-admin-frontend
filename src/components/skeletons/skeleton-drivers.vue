<script setup>
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="n in 13" :key="n" class="flex items-center gap-4 border-b border-surface-200 pb-3">
      <!-- <Skeleton shape="circle" size="2.5rem" /> -->
      <Skeleton width="8rem" height="1rem" />
      <Skeleton width="8rem" height="1rem" />
      <Skeleton width="10rem" height="1rem" />
      <Skeleton width="4rem" height="1.5rem" />
      <Skeleton width="6rem" height="1rem" />
    </div>
  </div>
</template>
