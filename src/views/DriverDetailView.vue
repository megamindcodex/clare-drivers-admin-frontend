<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const route = useRoute()
const { getDriverDetailsRequest } = useDriverStore()
const { handleError } = useErrorHandler()

async function getDriverDetails() {
  try {
    await getDriverDetailsRequest(route.params.driverId)
  } catch (error) {
    handleError(error)
  }
}

onMounted(getDriverDetails)
</script>

<template>
  <div>
    <h1>Driver Detail</h1>
  </div>
</template>
