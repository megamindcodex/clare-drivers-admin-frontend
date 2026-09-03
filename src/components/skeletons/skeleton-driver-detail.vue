<script setup>
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <Skeleton shape="circle" size="4rem" />
      <div class="flex flex-col gap-2">
        <Skeleton width="10rem" height="1.2rem" />
        <div class="flex gap-2">
          <Skeleton width="4rem" height="1.5rem" />
          <Skeleton width="4rem" height="1.5rem" />
          <Skeleton width="4rem" height="1.5rem" />
        </div>
      </div>
    </div>

    <Card v-for="n in 4" :key="n">
      <template #title><Skeleton width="6rem" height="1.2rem" /></template>
      <template #content>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="field in 6" :key="field" class="flex flex-col gap-2">
            <Skeleton width="5rem" height="0.7rem" />
            <Skeleton width="7rem" height="0.9rem" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
