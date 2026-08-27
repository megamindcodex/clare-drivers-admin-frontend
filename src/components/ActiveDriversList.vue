<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ScrollArea from 'primevue/scrollarea'
import ScrollAreaViewport from 'primevue/scrollareaviewport'
import ScrollAreaContent from 'primevue/scrollareacontent'
import ScrollAreaScrollbar from 'primevue/scrollareascrollbar'
import ScrollAreaHandle from 'primevue/scrollareahandle'
import Tag from 'primevue/tag'
import { useDriverStore } from '@/stores/driverStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const { activeDrivers, selectedActiveDriver } = storeToRefs(useDriverStore())
const { getActiveDriversRequest, getActiveDriverDetailsRequest } = useDriverStore()
const { handleError } = useErrorHandler()

async function handleFetchActiveDrivers() {
  try {
    await getActiveDriversRequest()
  } catch (error) {
    handleError(error)
  }
}

onMounted(handleFetchActiveDrivers)

async function selectDriver(item) {
  try {
    await getActiveDriverDetailsRequest(item.driverId)
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
  <div class="p-4">
    <ScrollArea class="" variant="always">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="item in activeDrivers"
              :key="item.driverId"
              class="min-w-0 flex flex-col gap-2 rounded-md border p-4 cursor-pointer"
              :class="
                item.driverId === selectedActiveDriver?.driverId
                  ? 'border-orange-700'
                  : 'border-surface-200'
              "
              @click="selectDriver(item)"
            >
              <div class="flex min-w-0 justify-between">
                <Tag value="LIVE" severity="success" />
                <Tag :value="item.category" severity="secondary" />
              </div>

              <div class="flex min-w-0 justify-between">
                <div class="min-w-0">
                  <small class="block text-[9px] text-surface-500">Name</small>
                  <span class="truncate text-xs sm:text-sm lg:text-base">{{ item.name }}</span>
                </div>
                <div class="min-w-0">
                  <small class="block text-[9px] text-surface-500">Rating</small>
                  <span class="truncate text-xs sm:text-sm lg:text-base">{{ item.ratings }}</span>
                </div>
              </div>

              <div class="flex min-w-0 justify-between">
                <div class="min-w-0">
                  <small class="block text-[9px] text-surface-500">Vehicle Type</small>
                  <span class="truncate text-xs sm:text-sm lg:text-base">{{
                    item.vehicleType
                  }}</span>
                </div>
                <div class="min-w-0">
                  <small class="block text-[9px] text-surface-500">Plate Number</small>
                  <span class="truncate text-xs sm:text-sm lg:text-base">{{
                    item.plateNumber
                  }}</span>
                </div>
              </div>

              <div class="min-w-0">
                <small class="block text-[9px] text-surface-500">Phone</small>
                <span class="truncate text-xs sm:text-sm lg:text-base">{{ item.phone }}</span>
              </div>
            </div>
          </div>
        </ScrollAreaContent>
      </ScrollAreaViewport>

      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaHandle />
      </ScrollAreaScrollbar>
    </ScrollArea>
  </div>
</template>
