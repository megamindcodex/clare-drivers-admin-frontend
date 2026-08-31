<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const router = useRouter()
const { drivers } = storeToRefs(useDriverStore())
const { getAllDriversRequest } = useDriverStore()
const { handleError } = useErrorHandler()

const statusSeverity = (status) => (status === 'active' ? 'success' : 'danger')

async function getAll() {
  try {
    await getAllDriversRequest()
  } catch (error) {
    handleError(error)
  }
}

function goToDriverDetail({ data }) {
  router.push({ name: 'driver-detail', params: { driverId: data.driverId } })
}

const rowClass = () => 'cursor-pointer'

onMounted(getAll)
</script>

<template>
  <div class="p-4">
    <DataTable
      :value="drivers"
      data-key="driverId"
      paginator
      :rows="10"
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
      <Column field="email" header="Email" />
      <!-- <Column field="phoneNumber" header="Phone Number" /> -->
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="statusSeverity(data.status)" />
        </template>
      </Column>
      <Column field="country" header="Country" />
      <!-- <Column field="ninIdentification" header="NIN Number" /> -->
    </DataTable>
  </div>
</template>
