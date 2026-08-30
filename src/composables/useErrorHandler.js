import { errorToast, warningToast } from '@/utils/toastService.js'
import { AppError, FieldValidationError, NetworkError, RequestTimeoutError, ApiError } from '../error/errors.js'

export function useErrorHandler() {

  function handleFieldValidationError(error) {
    // highlight error.field on the form and display a message driven by error.rule
  }

  function handleNetworkError(error) {
    errorToast('Unable to reach the server. Please check your internet connection.')
    console.error('[Network Error]:', error)
    return
  }

  function handleRequestTimeoutError(error) {
    errorToast('The request took too long to complete. Please try again.')
    console.warn('[Request Timeout]:', error)
    return
  }

  function handleApiError(error) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        errorToast(error.issues || 'Invalid request. Please check your input.')
        console.warn(`[API Error] ${error.code}:`, error.issues)
        break
      case 'ACCESS_TOKEN_EXPIRED':
      case 'ACCESS_TOKEN_INVALID':
      case 'SESSION_NOT_FOUND':
      case 'UNAUTHORIZED':
        errorToast('Your session has expired. Please log in again.')
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'ACCESS_TOKEN_MISSING':
        errorToast('Authentication error. Please log in again.')
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'FORBIDDEN':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'NOT_FOUND':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'CONFLICT':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'INVALID_CREDENTIALS':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'ACCOUNT_SUSPENDED':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'ACCOUNT_BANNED':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'INVALID_RESET_CODE':
        errorToast(error.message || 'That reset code is invalid or has expired.')
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      case 'INTERNAL_ERROR':
        // TODO: handle
        console.warn(`[API Error] ${error.code}: ${error.message}`)
        break
      default:
        errorToast(error.message || 'An error occurred while processing your API request. Please try again.')
      // console.error(`[API Error]: ${error.code}`, error)
    }
  }

  function handleAppError(error) {
    warningToast(error.message || 'An unexpected error occurred.')
    console.error('[App Error]:', error)
    return
  }

  function handleUnknownError(error) {
    errorToast('Something went wrong. Please try again.')
    console.error('[Unknown Error]:', error)
    return
  }

  function handleError(error) {
    if (error instanceof FieldValidationError) return handleFieldValidationError(error)
    if (error instanceof RequestTimeoutError) return handleRequestTimeoutError(error)
    if (error instanceof NetworkError) return handleNetworkError(error)
    if (error instanceof ApiError) return handleApiError(error)
    if (error instanceof AppError) return handleAppError(error)
    return handleUnknownError(error)
  }

  return { handleError }
}
