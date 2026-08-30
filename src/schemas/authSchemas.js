import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .pipe(z.email('Enter a valid email address'))

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters')

// login only requires a non-empty password — the backend accepts any existing
// password here regardless of the current minimum-length policy
export const loginPasswordSchema = z.string().min(1, 'Password is required')

// used for both registration and reset-password's newPassword — both enforce
// the same minimum-length policy
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

export const resetCodeSchema = z.string().length(6, 'Reset code must be exactly 6 characters')
