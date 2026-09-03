<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import ToggleSwitch from 'primevue/toggleswitch'
import RadioButton from 'primevue/radiobutton'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import Gallery from 'primevue/gallery'
import GalleryHeader from 'primevue/galleryheader'
import GalleryContent from 'primevue/gallerycontent'
import GalleryItem from 'primevue/galleryitem'
import GalleryPrev from 'primevue/galleryprev'
import GalleryNext from 'primevue/gallerynext'
import GalleryZoomIn from 'primevue/galleryzoomin'
import GalleryZoomOut from 'primevue/galleryzoomout'
import {
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
  IconReload,
} from '@/components/icons'
import SkeletonDriverDetail from '@/components/skeletons/skeleton-driver-detail.vue'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const route = useRoute()
const { selectedDriver } = storeToRefs(useDriverStore())
const { getDriverFullDataRequest, toggleIsVerifiedRequest, updateDriverApprovalRequest } =
  useDriverStore()
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

// Same "getter only reflects state, setter reacts to the click" pattern as isVerifiedModel above.
// Get returns null while isApproved is 'Pending' or 'False', so neither RadioButton is checked;
// it returns 'Approved'/'Rejected' once the driver is in one of those states, checking that one.
const approvalModel = computed({
  get: () => {
    const isApproved = selectedDriver.value?.isApproved
    return isApproved === 'Approved' || isApproved === 'Rejected' ? isApproved : null
  },
  set: (value) => updateApproval(value),
})

const isLoading = ref(false)
const isVerifiedToggling = ref(false)
const statusSeverity = (status) => (status === 'active' ? 'success' : 'secondary')

const approvalSeverity = (isApproved) => {
  if (isApproved === 'Approved') return 'success'
  if (isApproved === 'Pending') return 'warn'
  if (isApproved === 'Rejected') return 'danger'
  return 'secondary'
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—')

// Maps each possible vehicle image field on the driver to a display label for the gallery.
const vehicleImageFields = [
  { key: 'frontViewUrl', label: 'Front View' },
  { key: 'backViewUrl', label: 'Back View' },
  { key: 'sideViewUrl', label: 'Side View' },
  { key: 'insideViewUrl', label: 'Inside View' },
  { key: 'plateNumberUrl', label: 'Plate Number' },
]

// Only the fields the driver actually has a URL for, resolved into gallery-ready items.
const vehicleImages = computed(() =>
  vehicleImageFields
    .filter(({ key }) => selectedDriver.value?.[key])
    .map(({ key, label }) => ({ key, label, url: selectedDriver.value[key] }))
)

async function getDriverFullData() {
  try {
    isLoading.value = true
    await getDriverFullDataRequest(route.params.driverId)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
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

const isApprovalUpdating = ref(false)

async function updateApproval(isApproved) {
  try {
    isApprovalUpdating.value = true
    await updateDriverApprovalRequest(route.params.driverId, { isApproved })
  } catch (error) {
    handleError(error)
  } finally {
    isApprovalUpdating.value = false
  }
}

onMounted(getDriverFullData)
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
        @click="getDriverFullData"
      >
        <template #icon>
          <IconReload :size="16" />
        </template>
      </Button>
    </div>

    <SkeletonDriverDetail v-if="isLoading" />

    <div v-else-if="selectedDriver" class="flex flex-col gap-4">
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

        <div
          class="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-200"
        >
          <span class="font-semibold">Approval</span>
          <ProgressSpinner v-if="isApprovalUpdating" style="width: 20px; height: 20px" />

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="approvalModel"
                inputId="approval-approved"
                name="approval"
                value="Approved"
                :disabled="isApprovalUpdating"
              />
              <label for="approval-approved">Approve</label>
            </div>

            <div class="flex items-center gap-2">
              <RadioButton
                v-model="approvalModel"
                inputId="approval-rejected"
                name="approval"
                value="Rejected"
                :disabled="isApprovalUpdating"
              />
              <label for="approval-rejected">Reject</label>
            </div>
          </div>
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
        <div v-if="vehicleImages.length" class="h-80 mb-4 pb-4 border-b border-slate-200">
          <Gallery class="h-full rounded-md overflow-hidden border border-slate-200">
            <GalleryHeader class="justify-end gap-2">
              <GalleryZoomOut as="button">
                <IconZoomOut style="width: 24px; height: 24px" />
              </GalleryZoomOut>
              <GalleryZoomIn as="button">
                <IconZoomIn style="width: 24px; height: 24px" />
              </GalleryZoomIn>
            </GalleryHeader>
            <GalleryContent>
              <GalleryPrev as="button">
                <IconChevronLeft :size="24" />
              </GalleryPrev>
              <GalleryNext as="button">
                <IconChevronRight :size="24" />
              </GalleryNext>
              <GalleryItem v-for="image in vehicleImages" :key="image.key">
                <img :src="image.url" :alt="image.label" />
              </GalleryItem>
            </GalleryContent>
          </Gallery>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
  </div>
</template>
