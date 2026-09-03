import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http.js'

export const useOverviewStore = defineStore('overview', () => {
  const overview = ref(null)

  async function getOverviewRequest() {
    const { data } = await http.get('/api/overview')
    overview.value = data.data.overview
    return data.data.overview
  }

  return {
    overview,
    getOverviewRequest,
  }
})
