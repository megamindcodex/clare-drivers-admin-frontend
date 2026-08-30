<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { useDriverStore } from '@/stores/driverStore.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const { selectedActiveDriver } = storeToRefs(useDriverStore())

const DEFAULT_CENTER = [6.5244, 3.3792] // Lagos, Nigeria — fallback when no driver is selected

const mapCenter = computed(() =>
  selectedActiveDriver.value
    ? [selectedActiveDriver.value.latitude, selectedActiveDriver.value.longitude]
    : DEFAULT_CENTER
)
const mapZoom = computed(() => (selectedActiveDriver.value ? 14 : 6))
</script>

<template>
  <div class="h-1/3 rounded-md overflow-hidden border border-surface-200">
    <LMap :key="selectedActiveDriver?.driverId" :zoom="mapZoom" :center="mapCenter">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LMarker v-if="selectedActiveDriver" :lat-lng="mapCenter">
        <LPopup>
          <strong>{{ selectedActiveDriver.name }}</strong>
          <br />
          {{ selectedActiveDriver.plateNumber }}
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>
