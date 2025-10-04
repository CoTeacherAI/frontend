import { z } from 'zod'

export const emailSchema = z.string().email('Please enter a valid email address')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['student', 'professor'], {
    message: "Please select a role"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'professor' && !data.department) {
    return false
  }
  return true
}, {
  message: "Department is required for professors",
  path: ["department"]
}).refine((data) => {
  if (data.role === 'student' && (!data.major || !data.graduationYear)) {
    return false
  }
  return true
}, {
  message: "Major and graduation year are required for students",
  path: ["major"]
})

export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
