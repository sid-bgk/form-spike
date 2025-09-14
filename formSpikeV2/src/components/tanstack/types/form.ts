export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'array' | 'date' | 'multi'

export type ValidationRule = {
  required?: string | boolean  // Custom message or boolean for backward compatibility
  email?: string | boolean     // Custom email validation message or boolean
  minLength?: { value: number; message: string } | number  // Custom message object or number for backward compatibility
  maxLength?: { value: number; message: string } | number  // Custom message object or number for backward compatibility
  min?: { value: number; message: string } | number        // Custom message object or number for backward compatibility
  max?: { value: number; message: string } | number        // Custom message object or number for backward compatibility
  pattern?: { value: string; message: string } | string    // Custom message object or string for backward compatibility
  minItems?: { value: number; message: string }            // For arrays - minimum items validation
  maxItems?: { value: number; message: string }            // For arrays - maximum items validation
  minAge?: number              // Minimum age validation for date fields
  maxAge?: number              // Maximum age validation for date fields
  custom?: {
    validate: (value: any, formValues?: any) => boolean | Promise<boolean>
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
  conditions?: any // JSON Logic rule for conditional visibility
  // Array-specific properties
  arrayItemFields?: ArrayItemFieldConfig[]
  minItems?: number
  maxItems?: number
  addButtonText?: string
  removeButtonText?: string
  // Date-specific properties
  otherProps?: {
    minDate?: string | Date
    maxDate?: string | Date
  }
  defaultValue?: any
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

export type StepConfig = {
  id: string
  label: string
  fields: FieldConfig[]
}

export type StepFormConfig = {
  title?: string
  description?: string
  steps: StepConfig[]
  defaultValues: Record<string, any>
  submitButtonText?: string
  resetButtonText?: string
  onSubmit?: (data: { value: Record<string, any> }) => Promise<void> | void
}