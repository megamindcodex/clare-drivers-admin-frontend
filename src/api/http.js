import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { NetworkError, RequestTimeoutError, ApiError } from '@/error/errors.js'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  // attach the access token unless the caller opts out via _skipAuth (e.g. login/register/refresh)
  if (!config._skipAuth) {
    const { accessToken } = storeToRefs(useAuthStore())
    if (accessToken.value) config.headers.Authorization = `Bearer ${accessToken.value}`
  }
  return config
})

// defined once, outside — not recreated on every error
http.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      console.log('Network error (no response received):', {
        url: (error.config?.baseURL ?? '') + (error.config?.url ?? ''),
        method: error.config?.method,
        code: error.code,
        message: error.message,
      })

      if (error.code === 'ECONNABORTED') {
        throw new RequestTimeoutError(error.message)
      }

      throw new NetworkError(error.message)
    }

    const authStore = useAuthStore()
    const { accessToken } = storeToRefs(authStore)
    const { refreshTokenRequest, clearAccessToken } = authStore

    const { status, data } = error.response
    // error body is { error: { code, message, details? } } — nested under "error"
    const code = data?.error?.code
    const message = data?.error?.message
    const details = data?.error?.details

    const shouldRefresh =
      code === 'ACCESS_TOKEN_EXPIRED' ||
      code === 'ACCESS_TOKEN_INVALID' ||
      code === 'ACCESS_TOKEN_MISSING'

    // the refresh-token route's own session is bad — refreshing again can't help
    if (code === 'SESSION_NOT_FOUND') {
      clearAccessToken()
      throw new ApiError(message ?? error.message, status, code)
    }

    if (shouldRefresh) {
      if (error.config._retry) {
        clearAccessToken()
        throw new ApiError(message ?? error.message, status, code)
      }

      error.config._retry = true // prevents an infinite retry loop if the refreshed token still fails

      try {
        await refreshTokenRequest()

        error.config.headers = error.config.headers || {}
        error.config.headers.Authorization = `Bearer ${accessToken.value}`

        return http.request(error.config)
      } catch {
        clearAccessToken()
        throw new ApiError(message ?? error.message, status, code)
      }
    }

    if (code === 'VALIDATION_ERROR') {
      throw new ApiError(message ?? error.message, status, code, details)
    }

    console.log('API error:', { status, code, message, details })
    throw new ApiError(message ?? error.message, status, code)
  },
)

export default http
