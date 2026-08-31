<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/authStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const router = useRouter()
const { user } = storeToRefs(useAuthStore())
const { logoutRequest } = useAuthStore()
const { handleError } = useErrorHandler()

async function handleLogout() {
  try {
    await logoutRequest()
    router.push({ name: 'login' })
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
  <div class="p-4 flex flex-col gap-1">
    <h1 class="text-xl font-bold">Profile</h1>

    <div class="min-w-0 flex flex-col mt-2">
      <span class="text-[0.8rem] text-slate-600 font-bold">Username</span>
      <span class="text-[0.85rem] font-semibold">{{ user?.username }}</span>
    </div>
    <div class="min-w-0 flex flex-col mt-2">
      <span class="text-[0.8rem] text-slate-600 font-bold">Email</span>
      <span class="text-[0.85rem] font-semibold">{{ user?.email }}</span>
    </div>
    <div class="min-w-0 flex flex-col mt-2">
      <span class="text-[0.8rem] text-slate-600 font-bold">Role</span>
      <span class="text-[0.85rem] font-semibold">{{ user?.role }}</span>
    </div>

    <Button label="Log out" severity="danger" class="mt-4 self-start" @click="handleLogout" />
  </div>
</template>
