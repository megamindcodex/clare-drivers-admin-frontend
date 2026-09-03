<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import SkeletonDrivers from '@/components/skeletons/skeleton-drivers.vue'
import { IconReload } from '@/components/icons'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const router = useRouter()
const { drivers } = storeToRefs(useDriverStore())
const { getAllDriversRequest } = useDriverStore()
const { handleError } = useErrorHandler()

const isLoading = ref(false)

const approvalSeverity = (isApproved) => {
  if (isApproved === 'Approved') return 'success'
  if (isApproved === 'Pending') return 'warn'
  if (isApproved === 'Rejected') return 'danger'
  return 'secondary'
}

async function getAll() {
  try {
    isLoading.value = true
    await getAllDriversRequest()
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

function goToDriverDetail({ data }) {
  router.push({ name: 'driver-detail', params: { driverId: data.driverId } })
}

const rowClass = () => 'cursor-pointer'

onMounted(getAll)
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
        @click="getAll"
      >
        <template #icon>
          <IconReload :size="16" />
        </template>
      </Button>
    </div>

    <SkeletonDrivers v-if="isLoading" />

    <DataTable
      v-else
      :value="drivers"
      data-key="driverId"
      paginator
      :rows="13"
      striped-rows
      :row-class="rowClass"
      @row-click="goToDriverDetail"
    >
      <Column header="Profile Pic">
        <template #body="{ data }">
          <Avatar :image="data.profilePicUrl" shape="circle" />
        </template>
      </Column>
      <Column field="firstName" header="First Name" />
      <Column field="lastName" header="Last Name" />
      <Column field="country" header="Country" />
      <Column header="Verified">
        <template #body="{ data }">
          <Tag
            :value="data.isVerified ? 'Verified' : 'unverified'"
            :severity="data.isVerified ? 'info' : 'secondary'"
          />
        </template>
      </Column>
      <Column header="Approval">
        <template #body="{ data }">
          <Tag :value="data.isApproved" :severity="approvalSeverity(data.isApproved)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
