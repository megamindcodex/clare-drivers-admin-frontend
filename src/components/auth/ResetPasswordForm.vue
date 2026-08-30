<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import InputPassword from 'primevue/inputpassword'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import Label from 'primevue/label'
import Message from 'primevue/message'
import { IconEye, IconEyeSlash } from '@/components/icons'
import { useAuthStore } from '@/stores/authStore.js'
import { useFieldValidation } from '@/composables/useFieldValidation.js'
import { emailSchema, resetCodeSchema, passwordSchema } from '@/schemas/authSchemas.js'
import { successToast } from '@/utils/toastService.js'

const router = useRouter()
const route = useRoute()
const { resetPasswordRequest } = useAuthStore()
const { fieldErrors, fieldValidity, validateField, validateForm } = useFieldValidation()

const email = ref(route.query.email ?? '')
const resetCode = ref('')
const newPassword = ref('')
const isPasswordMasked = ref(true)
const isSubmitting = ref(false)
const formError = ref('')

const isFormValid = computed(
  () =>
    fieldValidity.email === true &&
    fieldValidity.resetCode === true &&
    fieldValidity.newPassword === true,
)

async function onSubmit() {
  formError.value = ''
  const isValid = validateForm({
    email: { schema: emailSchema, value: email.value },
    resetCode: { schema: resetCodeSchema, value: resetCode.value },
    newPassword: { schema: passwordSchema, value: newPassword.value },
  })
  if (!isValid) return

  isSubmitting.value = true
  try {
    const message = await resetPasswordRequest({
      email: email.value,
      resetCode: resetCode.value,
      newPassword: newPassword.value,
    })
    successToast('Password reset', message)
    router.push({ name: 'login' })
  } catch (error) {
    formError.value = error.message || 'Unable to reset password. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Message v-if="formError" severity="error">{{ formError }}</Message>

    <div class="flex flex-col gap-1">
      <FloatLabel variant="in">
        <InputText
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          fluid
          required
          :invalid="!!fieldErrors.email"
          @blur="validateField('email', emailSchema, email)"
          @keyup.enter="onSubmit"
        />
        <Label for="email">Email</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.email" severity="error" size="small" variant="simple">
        {{ fieldErrors.email }}
      </Message>
    </div>

    <div class="flex flex-col gap-1">
      <FloatLabel variant="in">
        <InputText
          id="resetCode"
          v-model="resetCode"
          autocomplete="one-time-code"
          maxlength="6"
          fluid
          required
          :invalid="!!fieldErrors.resetCode"
          @blur="validateField('resetCode', resetCodeSchema, resetCode)"
          @keyup.enter="onSubmit"
        />
        <Label for="resetCode">Reset code</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.resetCode" severity="error" size="small" variant="simple">
        {{ fieldErrors.resetCode }}
      </Message>
    </div>

    <div class="flex flex-col gap-1">
      <FloatLabel variant="in">
        <IconField>
          <InputPassword
            id="newPassword"
            v-model="newPassword"
            v-model:mask="isPasswordMasked"
            autocomplete="new-password"
            fluid
            required
            :invalid="!!fieldErrors.newPassword"
            @blur="validateField('newPassword', passwordSchema, newPassword)"
            @keyup.enter="onSubmit"
          />
          <InputIcon class="cursor-pointer" @click="isPasswordMasked = !isPasswordMasked">
            <component :is="isPasswordMasked ? IconEye : IconEyeSlash" :size="18" />
          </InputIcon>
        </IconField>
        <Label for="newPassword">New password</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.newPassword" severity="error" size="small" variant="simple">
        {{ fieldErrors.newPassword }}
      </Message>
    </div>

    <Button
      label="Reset password"
      :loading="isSubmitting"
      :disabled="!isFormValid"
      class="mt-2"
      @click="onSubmit"
    />

    <RouterLink :to="{ name: 'forgot-password' }" class="text-sm text-center">
      Didn't get a code? Request a new one
    </RouterLink>
  </div>
</template>
