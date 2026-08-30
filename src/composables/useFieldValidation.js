import { reactive } from 'vue'

export function useFieldValidation() {
  const fieldErrors = reactive({})
  const fieldValidity = reactive({})

  function validateField(name, schema, data) {
    const result = schema.safeParse(data)

    if (result.success) {
      fieldValidity[name] = true
      delete fieldErrors[name]
      return { success: true }
    }

    const errors = result.error.issues.map((issue) => issue.message)
    fieldValidity[name] = false
    fieldErrors[name] = errors[0]
    return { success: false, errors }
  }

  function validateForm(fields) {
    // fields = { name: { schema, value } }
    let isValid = true
    for (const [name, { schema, value }] of Object.entries(fields)) {
      const { success } = validateField(name, schema, value)
      if (!success) isValid = false
    }
    return isValid
  }

  return { fieldErrors, fieldValidity, validateField, validateForm }
}
