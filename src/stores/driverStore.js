import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http.js'

export const useDriverStore = defineStore('driver', () => {
  const drivers = ref([])
  const selectedDriver = ref(null)
  const selectedDriverDocuments = ref(null)
  const activeDrivers = ref([])
  const selectedActiveDriver = ref(null)

  async function getAllDriversRequest(filters = {}) {
    const { data } = await http.get('/api/drivers', { params: filters })
    drivers.value = data.data.drivers
    return data.data.drivers
  }

  async function getActiveDriversRequest(filters = {}) {
    const { data } = await http.get('/api/drivers/active', { params: filters })
    activeDrivers.value = data.data.activeDrivers
    return data.data.activeDrivers
  }

  async function getActiveDriverDetailsRequest(driverId) {
    const { data } = await http.get(`/api/drivers/active/${driverId}`)
    selectedActiveDriver.value = data.data.activeDriver
    return data.data.activeDriver
  }

  async function getDriverDetailsRequest(driverId) {
    const { data } = await http.get(`/api/drivers/${driverId}`)
    selectedDriver.value = data.data.driver
    return data.data.driver
  }

  async function getDriverFullDataRequest(driverId) {
    const { data } = await http.get(`/api/drivers/${driverId}/full-data`)
    selectedDriver.value = data.data.driver
    return data.data.driver
  }

  // pure toggle on the backend — no body, flips isVerified to the opposite of its current value
  async function toggleIsVerifiedRequest(driverId) {
    const { data } = await http.patch(`/api/drivers/${driverId}/isVerified`)
    if (selectedDriver.value) selectedDriver.value.isVerified = data.data.isVerified
    return data.data.isVerified
  }

  async function getDriverDocumentsRequest(driverId) {
    const { data } = await http.get(`/api/drivers/${driverId}/documents`)
    selectedDriverDocuments.value = data.data.document
    return data.data.document
  }

  async function updateDriverApprovalRequest(driverId, { isApproved }) {
    const { data } = await http.patch(`/api/drivers/${driverId}/approve`, { isApproved })
    selectedDriver.value = data.data.driver
    return data.data.driver
  }

  return {
    drivers,
    selectedDriver,
    selectedDriverDocuments,
    activeDrivers,
    selectedActiveDriver,
    getAllDriversRequest,
    getDriverDetailsRequest,
    getDriverFullDataRequest,
    toggleIsVerifiedRequest,
    getDriverDocumentsRequest,
    updateDriverApprovalRequest,
    getActiveDriversRequest,
    getActiveDriverDetailsRequest,
  }
})
