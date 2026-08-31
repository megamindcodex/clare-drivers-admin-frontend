<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import ToggleSwitch from 'primevue/toggleswitch'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const route = useRoute()
const { selectedDriver } = storeToRefs(useDriverStore())
const { getDriverFullDataRequest, toggleIsVerifiedRequest } = useDriverStore()
const { handleError } = useErrorHandler()

// v-model on the ToggleSwitch below is bound to this computed, not to `selectedDriver.isVerified`
// directly. The getter just displays the driver's current isVerified value. The setter only runs
// when the switch itself writes a new value (i.e. the user clicked it) — it ignores the value Vue
// passes in and calls toggleIsVerified() instead, which hits the API and lets the store's own
// response update `selectedDriver.isVerified`. Because programmatic updates to it (e.g. from the
// initial fetch) only affect the getter's output, not the setter, there's no risk of that feeding
// back into another API call — no watcher or "ignore this change" flag needed.
const isVerifiedModel = computed({
  get: () => selectedDriver.value?.isVerified,
  set: () => toggleIsVerified(),
})

const isVerifiedToggling = ref(false)
const statusSeverity = (status) => (status === 'active' ? 'success' : 'danger')

const approvalSeverity = (isApproved) => {
  if (isApproved === 'Approved') return 'success'
  if (isApproved === 'Pending') return 'warn'
  if (isApproved === 'Rejected') return 'danger'
  return 'secondary'
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—')

async function getDriverFullData() {
  try {
    await getDriverFullDataRequest(route.params.driverId)
  } catch (error) {
    handleError(error)
  }
}

async function toggleIsVerified() {
  try {
    isVerifiedToggling.value = true
    await toggleIsVerifiedRequest(route.params.driverId)
  } catch (error) {
    handleError(error)
  } finally {
    isVerifiedToggling.value = false
  }
}

onMounted(getDriverFullData)
</script>

<template>
  <div class="p-4 flex flex-col gap-4" v-if="selectedDriver">
    <div class="flex flex-wrap items-center gap-4">
      <Avatar :image="selectedDriver.profilePicUrl" shape="circle" size="xlarge" />

      <div class="flex flex-col gap-1">
        <span class="text-xl font-bold"
          >{{ selectedDriver.firstName }} {{ selectedDriver.lastName }}</span
        >
        <div class="flex flex-wrap items-center gap-2">
          <Tag :value="selectedDriver.status" :severity="statusSeverity(selectedDriver.status)" />
          <Tag
            :value="selectedDriver.isApproved"
            :severity="approvalSeverity(selectedDriver.isApproved)"
          />
          <Tag
            :value="selectedDriver.isVerified ? 'Verified' : 'Not verified'"
            :severity="selectedDriver.isVerified ? 'info' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Card>
      <template #title>Actions</template>
      <template #content>
        <div class="flex items-center justify-between">
          <span class="font-semibold">{{
            selectedDriver.isVerified ? 'Unverify Driver' : 'Verify Driver'
          }}</span>
          <ToggleSwitch v-model="isVerifiedModel" />
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Contact</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Email</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.email }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Phone Number</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.phoneNumber
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Country</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.country }}</span>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Vehicle</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Vehicle Type</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.vehicleType
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Category</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.category }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Brand</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.brand }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Model</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.model }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Model Year</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.modelYear
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Color</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.vehicleColor
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Plate Number</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.plateNumber
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Registration Date</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              formatDate(selectedDriver.registrationDate)
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Rate</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.rate }}</span>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Identification</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Driving License</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.drivingLicense
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">NIN</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              selectedDriver.ninIdentification
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Rating</span>
            <span class="truncate text-[0.85rem] font-semibold">{{ selectedDriver.rating }}</span>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Record</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Created</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              formatDate(selectedDriver.createdAt)
            }}</span>
          </div>
          <div class="min-w-0 flex flex-col">
            <span class="text-[0.8rem] text-slate-600 font-bold">Last Updated</span>
            <span class="truncate text-[0.85rem] font-semibold">{{
              formatDate(selectedDriver.updatedAt)
            }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
