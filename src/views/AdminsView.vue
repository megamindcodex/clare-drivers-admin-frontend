<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import DataView from 'primevue/dataview'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import SkeletonAdmins from '@/components/skeletons/skeleton-admins.vue'
import { IconReload } from '@/components/icons'
import { useUserStore } from '@/stores/userStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'
import { successToast } from '@/utils/toastService.js'

const { users } = storeToRefs(useUserStore())
const { getUsersRequest, promoteUserRequest, suspendUserRequest, banUserRequest } = useUserStore()
const { handleError } = useErrorHandler()

const pendingUserId = ref(null)
const pendingAction = ref(null)
const isLoading = ref(false)

const roleSeverity = (role) => (role === 'Admin' ? 'info' : 'secondary')

const statusSeverity = (status) => {
  if (status === 'Active') return 'success'
  if (status === 'Suspended') return 'warn'
  return 'danger'
}

async function fetchUsers() {
  try {
    isLoading.value = true
    await getUsersRequest()
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

async function promoteUser(user) {
  pendingUserId.value = user.userId
  pendingAction.value = 'promote'
  try {
    await promoteUserRequest(user.userId)
    successToast('Promoted', `${user.username} is now an Admin.`)
  } catch (error) {
    handleError(error)
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}

async function suspendUser(user) {
  pendingUserId.value = user.userId
  pendingAction.value = 'suspend'
  try {
    await suspendUserRequest(user.userId)
    successToast('Suspended', `${user.username} has been suspended.`)
  } catch (error) {
    handleError(error)
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}

async function banUser(user) {
  pendingUserId.value = user.userId
  pendingAction.value = 'ban'
  try {
    await banUserRequest(user.userId)
    successToast('Banned', `${user.username} has been banned.`)
  } catch (error) {
    handleError(error)
  } finally {
    pendingUserId.value = null
    pendingAction.value = null
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex justify-end">
      <Button
        label="Refresh"
        size="small"
        text
        severity="contrast"
        :loading="isLoading"
        @click="fetchUsers"
      >
        <template #icon>
          <IconReload :size="16" />
        </template>
      </Button>
    </div>

    <SkeletonAdmins v-if="isLoading" />

    <DataView v-else :value="users" data-key="userId">
      <template #list="{ items }">
        <div class="flex flex-col gap-3">
          <div
            v-for="user in items"
            :key="user.userId"
            class="flex flex-wrap items-center justify-between gap-4 rounded-md border border-surface-200 p-4"
          >
            <div class="min-w-0 flex flex-col gap-1">
              <span class="font-semibold truncate">{{ user.username }}</span>
              <span class="text-sm text-surface-500 truncate">{{ user.email }}</span>
            </div>

            <div class="flex items-center gap-2">
              <Tag :value="user.role" :severity="roleSeverity(user.role)" />
              <Tag :value="user.status" :severity="statusSeverity(user.status)" />
            </div>

            <div class="flex items-center gap-2">
              <Button
                v-if="user.role === 'User'"
                label="Promote"
                size="small"
                text
                :disabled="pendingUserId === user.userId"
                :loading="pendingUserId === user.userId && pendingAction === 'promote'"
                @click="promoteUser(user)"
              />
              <Button
                v-if="user.status === 'Active'"
                label="Suspend"
                size="small"
                text
                severity="warn"
                :disabled="pendingUserId === user.userId"
                :loading="pendingUserId === user.userId && pendingAction === 'suspend'"
                @click="suspendUser(user)"
              />
              <Button
                v-if="user.status !== 'Banned'"
                label="Ban"
                size="small"
                text
                severity="danger"
                :disabled="pendingUserId === user.userId"
                :loading="pendingUserId === user.userId && pendingAction === 'ban'"
                @click="banUser(user)"
              />
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <p class="text-center text-surface-500 py-8">No admins yet.</p>
      </template>
    </DataView>
  </div>
</template>
