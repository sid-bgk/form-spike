import { useEffect, useState } from 'react'
import axios from 'axios'
import { StepForm } from '@/components/tanstack/forms/StepForm'
import type { StepFormConfig, FieldConfig, FieldType, ValidationRule } from '@/components/tanstack/types/form'

type ApiField = {
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: any
  conditions?: any
  grid?: any
  formType?: string
  inputProps?: any
  orientation?: string
  otherProps?: any
  defaultValue?: any
  computeValue?: any
}

type ApiStepConfig = {
  id: string
  label: string
  fields: ApiField[]
}

type ApiStepResponse = {
  version: number
  form: {
    title?: string
    description?: string
    steps: ApiStepConfig[]
    submitButtonText?: string
    resetButtonText?: string
  }
  validationPatterns?: Record<string, any>
  customValidationRules?: Record<string, { message: string }>
}

const mapToFieldType = (t: string): FieldType => {
  const aliasMap: Record<string, FieldType> = {
    dropdown: 'select',
    radio: 'radio',
    textarea: 'textarea',
  }
  const normalized = (t || '').toLowerCase()
  if (aliasMap[normalized]) return aliasMap[normalized]
  const allowed: FieldType[] = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio', 'array', 'date', 'multi']
  return allowed.includes(normalized as FieldType) ? (normalized as FieldType) : 'text'
}

// Fallback patterns when API sends non-serializable RegExp as {}
const DEFAULT_PATTERNS: Record<string, string> = {
  PHONE_VALIDATION_REGEX: '^(\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
  SSN_VALIDATION_REGEX: '^\\d{9}$',
  ZIP_VALIDATION_REGEX: '^\\d{5}$',
}

// Build a safe pattern map from API or fallbacks
const buildPatternMap = (api?: Record<string, any>): Record<string, string> => {
  const out: Record<string, string> = { ...DEFAULT_PATTERNS }
  if (!api) return out
  for (const [k, v] of Object.entries(api)) {
    // Accept strings, RegExp-like with .source, or fallback to default
    if (typeof v === 'string') out[k] = v
    else if (v && typeof (v as any).source === 'string') out[k] = (v as any).source
    // If v is {} (lost RegExp), keep existing default
  }
  return out
}

// Known custom rule factories (cannot be sent over JSON as functions)
const CUSTOM_RULE_FACTORIES: Record<string, (message: string) => ValidationRule> = {
  notEqualToPhone: (message: string) => ({
    custom: {
      validate: (value: any, formValues?: any) => {
        if (!value || !formValues?.phone) return true
        return value !== formValues.phone
      },
      message,
    },
  }),
  notEqualToEmail: (message: string) => ({
    custom: {
      validate: (value: any, formValues?: any) => {
        if (!value || !formValues?.email) return true
        return value !== formValues.email
      },
      message,
    },
  }),
  notEqualToSSN: (message: string) => ({
    custom: {
      validate: (value: any, formValues?: any) => {
        if (!value || !formValues?.ssn) return true
        return value !== formValues.ssn
      },
      message,
    },
  }),
}

// Normalize backend validation object into our ValidationRule
const normalizeValidation = (
  raw: any,
  patterns: Record<string, string>
): ValidationRule | undefined => {
  if (!raw || typeof raw !== 'object') return undefined
  const v: ValidationRule = {}

  // Required can be boolean or string (message)
  if (raw.required !== undefined) v.required = typeof raw.required === 'string' ? raw.required : Boolean(raw.required)

  // Email shortcut
  if (raw.email) v.email = typeof raw.email === 'string' ? raw.email : true

  // Length and number rules (common names)
  if (raw.minLength !== undefined) v.minLength = typeof raw.minLength === 'object' ? raw.minLength : Number(raw.minLength)
  if (raw.maxLength !== undefined) v.maxLength = typeof raw.maxLength === 'object' ? raw.maxLength : Number(raw.maxLength)
  if (raw.min !== undefined) v.min = typeof raw.min === 'object' ? raw.min : Number(raw.min)
  if (raw.max !== undefined) v.max = typeof raw.max === 'object' ? raw.max : Number(raw.max)

  // Pattern normalization: support backend "matches: { pattern, message }" and common aliases like phoneUS
  if (raw.matches && typeof raw.matches === 'object') {
    const msg = raw.matches.message || 'Invalid format'
    const pat = raw.matches.pattern
    if (typeof pat === 'string' && patterns[pat]) {
      v.pattern = { value: patterns[pat], message: msg }
    } else if (typeof pat === 'string') {
      v.pattern = { value: pat, message: msg }
    } else if (pat && typeof pat.source === 'string') {
      v.pattern = { value: pat.source, message: msg }
    } else {
      // If server lost the RegExp during JSON stringify, try to infer from known keys
      v.pattern = { value: patterns.PHONE_VALIDATION_REGEX, message: msg }
    }
  }

  if (raw.phoneUS) {
    const msg = typeof raw.phoneUS === 'string' ? raw.phoneUS : 'Please enter a valid US phone number'
    v.pattern = { value: patterns.PHONE_VALIDATION_REGEX, message: msg }
  }

  // Custom rule names (e.g., notEqualToPhone: 'message') → map to custom validator
  for (const key of Object.keys(CUSTOM_RULE_FACTORIES)) {
    if (raw[key]) {
      const msg = typeof raw[key] === 'string' ? raw[key] : (raw[key].message || 'Invalid value')
      const rule = CUSTOM_RULE_FACTORIES[key](msg)
      // If another validator already set custom, prefer the explicit one; otherwise apply
      if (!v.custom) v.custom = rule.custom
    }
  }

  // Array validations (if present)
  if (raw.minItems && typeof raw.minItems === 'object') {
    v.minItems = raw.minItems
  }
  if (raw.maxItems && typeof raw.maxItems === 'object') {
    v.maxItems = raw.maxItems
  }

  // Date/age validations (if present)
  if (raw.minAge !== undefined) {
    v.minAge = Number(raw.minAge)
  }
  if (raw.maxAge !== undefined) {
    v.maxAge = Number(raw.maxAge)
  }

  return Object.keys(v).length ? v : undefined
}

const mapApiFieldToFieldConfig = (
  apiField: ApiField,
  patterns: Record<string, string>
): FieldConfig => {
  // Normalize conditions: backend may send an array of JSONLogic rules
  const normalizedConditions = Array.isArray(apiField.conditions)
    ? (apiField.conditions.length === 1
        ? apiField.conditions[0]
        : { and: apiField.conditions })
    : apiField.conditions

  return {
    name: apiField.name,
    label: apiField.label,
    type: mapToFieldType(apiField.type),
    required: apiField.required,
    placeholder: apiField.placeholder,
    description: apiField.description,
    disabled: apiField.disabled,
    options: apiField.options,
    validation: normalizeValidation(apiField.validation, patterns),
    conditions: normalizedConditions,
    // Include date-specific properties
    otherProps: apiField.otherProps,
    defaultValue: apiField.defaultValue,
  }
}

export function UserRegistrationSteps() {
  const [config, setConfig] = useState<StepFormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Use the parametric config endpoint used elsewhere in this project
        const response = await axios.get<ApiStepResponse>('http://localhost:3001/api/config/tanstack/user-registration-steps')
        const apiResponse = response.data

        // Validate API response structure
        if (!apiResponse || !apiResponse.form || !apiResponse.form.steps) {
          throw new Error('Invalid API response structure: missing steps')
        }

        // Debug: Log the API response
        console.log('API Response:', apiResponse)
        console.log('Steps:', apiResponse.form.steps)

        // Build helpers from API
        const patternMap = buildPatternMap(apiResponse.validationPatterns)

        // Map API response to StepFormConfig
        const stepFormConfig: StepFormConfig = {
          title: apiResponse.form.title,
          description: apiResponse.form.description,
          steps: apiResponse.form.steps.map((step, stepIndex) => {
            console.log(`Processing step ${stepIndex}:`, step)
            return {
              id: step.id,
              label: step.label,
              fields: step.fields ? step.fields.map((field, fieldIndex) => {
                console.log(`Processing field ${fieldIndex} in step ${stepIndex}:`, field)
                return mapApiFieldToFieldConfig(field, patternMap)
              }) : []
            }
          }),
          defaultValues: {},
          submitButtonText: apiResponse.form.submitButtonText,
          resetButtonText: apiResponse.form.resetButtonText,
          onSubmit: async ({ value }) => {
            console.log('Form submitted with values:', value)
            // Here you would typically send the data to your backend
            alert('User registration submitted successfully!')
          }
        }

        console.log('Mapped StepFormConfig:', stepFormConfig)
        setConfig(stepFormConfig)
      } catch (err) {
        console.error('Error fetching form config:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Form</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-600">No form configuration available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <StepForm config={config} />
    </div>
  )
}
