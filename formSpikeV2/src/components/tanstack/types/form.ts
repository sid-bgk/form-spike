export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'array'

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

export type ArrayItemFieldConfig = {
  name: string
  label: string
  type: Exclude<FieldType, 'array'> // Array items cannot contain other arrays
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: ValidationRule
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
  showWhen?: any // JSON Logic rule for conditional visibility
  // Array-specific properties
  arrayItemFields?: ArrayItemFieldConfig[]
  minItems?: number
  maxItems?: number
  addButtonText?: string
  removeButtonText?: string
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