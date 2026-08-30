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
    console.log('Active drivers fetched successfully: ', activeDrivers.value)
  } catch (error) {
    handleError(error)
  }
}

onMounted(handleFetchActiveDrivers)

async function selectDriver(item) {
  try {
    console.log('Selecting driver: ', item)
    await getActiveDriverDetailsRequest(item.driverId)
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
  <div class="flex flex-col min-h-0">
    <ScrollArea class="flex-1 min-h-0" variant="always">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="item in activeDrivers"
              :key="item.driverId"
              class="min-w-0 flex flex-col gap-1 border p-2 cursor-pointer"
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

              <div class="min-w-0 flex justify-between">
                <div class="min-w-0 flex flex-col">
                  <span class="text-[0.8rem] text-slate-600 font-bold">Name</span>
                  <span class="truncate text-[0.6rem] text-end font-semibold">{{ item.name }}</span>
                </div>
                <div class="min-w-0 flex flex-col">
                  <span class="text-[0.8rem] text-slate-600 font-bold">Rating</span>
                  <span class="truncate text-[0.6rem] text-end font-semibold">{{
                    item.ratings
                  }}</span>
                </div>
              </div>

              <div class="min-w-0 flex justify-between">
                <div class="min-w-0 flex flex-col">
                  <span class="text-[0.8rem] text-slate-600 font-bold">Vehicle Type</span>
                  <span class="truncate text-[0.6rem] font-semibold">{{ item.vehicleType }}</span>
                </div>
                <div class="min-w-0 flex flex-col">
                  <span class="text-[0.8rem] text-slate-600 font-bold">Plate Number</span>
                  <span class="truncate text-[0.6rem] text-end font-semibold">{{
                    item.plateNumber
                  }}</span>
                </div>
              </div>

              <div class="min-w-0 flex justify-between items-center">
                <span class="text-[0.8rem] text-slate-600 font-bold">Phone</span>
                <span class="truncate text-[0.6rem] text-end font-semibold">{{ item.phone }}</span>
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
