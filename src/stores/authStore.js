import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/api/http.js'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)
  const isBooted = ref(false)

  // shared across callers (router guard + App.vue) so a cold/hot reload only boots once
  let bootPromise = null

  function setAccessToken(token) {
    accessToken.value = token
  }

  function clearAccessToken() {
    accessToken.value = null
  }

  async function registerRequest({ username, email, password }) {
    const { data } = await http.post(
      '/api/auth/register',
      { username, email, password },
      { _skipAuth: true },
    )
    user.value = data.data.user
    return data.data.user
  }

  async function loginRequest({ email, password }) {
    const { data } = await http.post(
      '/api/auth/login',
      { email, password },
      { _skipAuth: true },
    )
    user.value = data.data.user
    accessToken.value = data.data.accessToken
    return data.data
  }

  async function refreshTokenRequest() {
    const { data } = await http.post('/api/auth/refresh-token', undefined, { _skipAuth: true })
    accessToken.value = data.data.accessToken
    return data.data.accessToken
  }

  async function logoutRequest() {
    await http.post('/api/auth/logout')
    accessToken.value = null
    user.value = null
  }

  async function getMeRequest() {
    const { data } = await http.get('/api/auth/me')
    user.value = data.data.user
    return data.data.user
  }

  async function requestPasswordResetCodeRequest({ email }) {
    const { data } = await http.post('/api/auth/password/reset-code', { email })
    return data.data.message
  }

  async function resetPasswordRequest({ email, resetCode, newPassword }) {
    const { data } = await http.patch('/api/auth/password', { email, resetCode, newPassword })
    return data.data.message
  }

  function bootAppRequest() {
    if (bootPromise) return bootPromise

    bootPromise = (async () => {
      try {
        await refreshTokenRequest()
        await getMeRequest()
      } catch {
        // failed boot just means "not logged in" — not an error condition
        clearAccessToken()
        user.value = null
      } finally {
        isBooted.value = true
      }
    })()

    return bootPromise
  }

  return {
    accessToken,
    user,
    isBooted,
    setAccessToken,
    clearAccessToken,
    registerRequest,
    loginRequest,
    refreshTokenRequest,
    logoutRequest,
    getMeRequest,
    requestPasswordResetCodeRequest,
    resetPasswordRequest,
    bootAppRequest,
  }
})
