export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'

export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  email?: boolean
  custom?: {
    validate: (value: any) => boolean | Promise<boolean>
    message: string
  }
}

export type FieldConfig = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: ValidationRule
}

export type FormConfig = {
  title?: string
  description?: string
  fields: FieldConfig[]
  defaultValues: Record<string, any>
  submitButtonText?: string
  resetButtonText?: string
  onSubmit?: (data: { value: Record<string, any> }) => Promise<void> | void
}