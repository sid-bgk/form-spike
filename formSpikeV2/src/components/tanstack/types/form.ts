export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'

export interface SelectOption {
  value: string | number
  label: string
}

export interface FieldConfig<T = any> {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[] // For select and radio fields
  validators?: {
    onChange?: (props: { value: T }) => string | undefined
    onChangeAsync?: (props: { value: T }) => Promise<string | undefined>
    onChangeAsyncDebounceMs?: number
    onBlur?: (props: { value: T }) => string | undefined
    onMount?: (props: { value: T }) => string | undefined
  }
  defaultValue?: T
  disabled?: boolean
  className?: string
  description?: string
}

export interface FormConfig<TFormData = Record<string, any>> {
  fields: FieldConfig[]
  defaultValues: TFormData
  onSubmit: (data: { value: TFormData }) => Promise<void> | void
  title?: string
  description?: string
  submitButtonText?: string
  resetButtonText?: string
  className?: string
}

export interface FieldInfoProps {
  field: any
}

export interface DynamicFormProps<TFormData = Record<string, any>> {
  config: FormConfig<TFormData>
  className?: string
}