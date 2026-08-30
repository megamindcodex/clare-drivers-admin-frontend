<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import SideBar from '@/components/SideBar.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { setToastInstance } from '@/utils/toastService.js'

const toast = useToast()
const route = useRoute()
const { isBooted } = storeToRefs(useAuthStore())
const { bootAppRequest } = useAuthStore()

onMounted(() => {
  setToastInstance(toast)
  bootAppRequest()
})
</script>

<template>
  <Toast />
  <div class="w-full">
    <div v-if="!isBooted" class="flex items-center justify-center h-screen">
      <ProgressSpinner />
    </div>
    <template v-else>
      <SideBar v-if="!route.meta.public" />
      <RouterView v-else />
    </template>
  </div>
</template>
