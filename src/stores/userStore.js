import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http.js'

// "user/s" here refers to admin/s — this store manages the internal admin accounts
// (via /api/users), not the drivers being administered.
export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const selectedUser = ref(null)

  async function getUsersRequest() {
    const { data } = await http.get('/api/users')
    users.value = data.data.users
    return data.data.users
  }

  async function getUserByIdRequest(userId) {
    const { data } = await http.get(`/api/users/${userId}`)
    selectedUser.value = data.data.user
    return data.data.user
  }

  async function promoteUserRequest(userId) {
    const { data } = await http.patch(`/api/users/${userId}/promote`)
    selectedUser.value = data.data.user
    return data.data.user
  }

  async function suspendUserRequest(userId) {
    const { data } = await http.patch(`/api/users/${userId}/suspend`)
    selectedUser.value = data.data.user
    return data.data.user
  }

  async function banUserRequest(userId) {
    const { data } = await http.patch(`/api/users/${userId}/ban`)
    selectedUser.value = data.data.user
    return data.data.user
  }

  return {
    users,
    selectedUser,
    getUsersRequest,
    getUserByIdRequest,
    promoteUserRequest,
    suspendUserRequest,
    banUserRequest,
  }
})
