<script setup>
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card v-for="n in 3" :key="n">
        <template #content>
          <div class="flex items-center gap-4">
            <Skeleton shape="circle" size="3rem" />
            <div class="flex flex-col gap-2">
              <Skeleton width="4rem" height="1.5rem" />
              <Skeleton width="6rem" height="0.8rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card v-for="n in 4" :key="n">
        <template #title><Skeleton width="8rem" height="1.2rem" /></template>
        <template #content>
          <div class="flex flex-col gap-3">
            <div v-for="row in 3" :key="row" class="flex items-center justify-between">
              <Skeleton width="5rem" height="1.5rem" />
              <Skeleton width="2rem" height="1rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title><Skeleton width="10rem" height="1.2rem" /></template>
      <template #content><Skeleton width="100%" height="2rem" /></template>
    </Card>
  </div>
</template>
