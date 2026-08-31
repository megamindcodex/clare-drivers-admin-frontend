<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Drawer from 'primevue/drawer'
import SideBar from '@/components/SideBar.vue'
import NavMenu from '@/components/NavMenu.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { setToastInstance } from '@/utils/toastService.js'

const toast = useToast()
const route = useRoute()
const { isBooted } = storeToRefs(useAuthStore())
const { bootAppRequest } = useAuthStore()

const isDrawerVisible = ref(false)

function toggleDrawer() {
  isDrawerVisible.value = !isDrawerVisible.value
}

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
      <SideBar v-if="!route.meta.public" @toggle-drawer="toggleDrawer" />
      <RouterView v-else />
    </template>
  </div>

  <!-- footer to match SideBar's SidebarFooter is coming later -->
  <Drawer v-model:visible="isDrawerVisible">
    <template #header>
      <span class="text-lg font-semibold">Clare Drivers Admin</span>
    </template>

    <NavMenu @item-click="isDrawerVisible = false" />
  </Drawer>
</template>
