<script setup>
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import SideBar from '@/components/SideBar.vue'
import { setToastInstance } from '@/utils/toastService.js'

const toast = useToast()

onMounted(() => {
  setToastInstance(toast)
})
</script>

<template>
  <Toast />
  <div class="w-full p-8">
    <SideBar />
  </div>
</template>
