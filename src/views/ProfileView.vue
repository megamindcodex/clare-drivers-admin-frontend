<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/authStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const router = useRouter()
const { user } = storeToRefs(useAuthStore())
const { logoutRequest } = useAuthStore()
const { handleError } = useErrorHandler()

// initials avatar: first two characters of the username, no profile picture for admin accounts
const initials = computed(() => user.value?.username?.slice(0, 2).toUpperCase() ?? '')

const isLoggingOut = ref(false)

async function handleLogout() {
  try {
    isLoggingOut.value = true
    await logoutRequest()
    router.push({ name: 'login' })
  } catch (error) {
    handleError(error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <Card class="max-w-md mx-auto">
      <template #content>
        <div class="flex flex-col items-center gap-2 pb-4">
          <Avatar :label="initials" shape="circle" size="xlarge" class="text-xl" />
          <span class="text-lg font-bold">{{ user?.username }}</span>
        </div>

        <div class="flex flex-col gap-3">
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Email</span>
            <span class="text-[0.85rem] font-semibold">{{ user?.email }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Role</span>
            <span class="text-[0.85rem] font-semibold">{{ user?.role }}</span>
          </div>
        </div>

        <Button
          label="Log out"
          severity="danger"
          outlined
          class="w-full mt-6"
          :loading="isLoggingOut"
          @click="handleLogout"
        />
      </template>
    </Card>
  </div>
</template>
