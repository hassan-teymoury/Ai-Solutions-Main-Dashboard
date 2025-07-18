// Form related types

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProfileFormData {
  name: string
  email: string
}

export interface PasswordChangeFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// Form validation error types
export interface FormError {
  message: string
  type: string
}

export interface FormErrors {
  [key: string]: FormError
}

// Form state types
export interface FormState<T> {
  data: T
  errors: FormErrors
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// Form field types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: string | number | RegExp
  message: string
} 