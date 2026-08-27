let toastInstance = null

const noToastWarning = () =>
  console.warn('Toast instance not set. Please call setToastInstance() with a valid toast instance before using toast functions.')

export function setToastInstance(toast) {
  toastInstance = toast
}

export function successToast(summary = 'Success', message) {
  if (!toastInstance) return noToastWarning()

  toastInstance?.add({
    severity: 'success',
    summary: summary,
    detail: message,
    life: 3000,
  })
}

export function infoToast(summary = 'Info', message) {
  if (!toastInstance) return noToastWarning()

  toastInstance?.add({
    severity: 'info',
    summary: summary,
    detail: message,
    life: 3000,
  })
}

export function errorToast(summary = 'Error', message) {
  if (!toastInstance) return noToastWarning()

  toastInstance?.add({
    severity: 'error',
    summary: summary,
    detail: message,
    life: 3000,
  })
}

export function warningToast(summary = 'Warning', message) {
  if (!toastInstance) return noToastWarning()

  toastInstance?.add({
    severity: 'warn',
    summary: summary,
    detail: message,
    life: 3000,
  })
}

export function alertToast(summary = 'Alert', message) {
  if (!toastInstance) return noToastWarning()

  toastInstance?.add({
    severity: 'contrast',
    summary: summary,
    detail: message,
    life: 3000,
  })
}
