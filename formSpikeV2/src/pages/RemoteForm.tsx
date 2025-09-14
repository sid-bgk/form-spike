import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { DynamicForm } from '@/components/tanstack/forms'
import { StepForm } from '@/components/tanstack/forms/StepForm'
import type { FieldConfig, FieldType, FormConfig, ArrayItemFieldConfig, StepFormConfig, ValidationRule } from '@/components/tanstack/types/form'

type ApiArrayItemField = {
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: any
}

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
  // Array-specific properties
  arrayItemFields?: ApiArrayItemField[]
  minItems?: number
  maxItems?: number
  addButtonText?: string
  removeButtonText?: string
  conditions?: any
}

type ApiResponse = {
  version: number
  form: {
    title?: string
    description?: string
    fields?: ApiField[]
    // Step-based shape support
    steps?: Array<{ id: string; label: string; fields: ApiField[] }>
    submitButtonText?: string
    resetButtonText?: string
  }
  validationPatterns?: Record<string, any>
  customValidationRules?: Record<string, { message: string }>
}

const mapToFieldType = (t: string): FieldType => {
  const allowed: FieldType[] = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio', 'array']
  return (allowed.find((v) => v === t) ?? 'text') as FieldType
}

// Helpers for step-based normalization (mirrors UserRegistrationSteps)
const DEFAULT_PATTERNS: Record<string, string> = {
  PHONE_VALIDATION_REGEX: '^(\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
  SSN_VALIDATION_REGEX: '^\\d{9}$',
  ZIP_VALIDATION_REGEX: '^\\d{5}$',
}
const buildPatternMap = (api?: Record<string, any>): Record<string, string> => {
  const out: Record<string, string> = { ...DEFAULT_PATTERNS }
  if (!api) return out
  for (const [k, v] of Object.entries(api)) {
    if (typeof v === 'string') out[k] = v
    else if (v && typeof (v as any).source === 'string') out[k] = (v as any).source
  }
  return out
}
const CUSTOM_RULE_FACTORIES: Record<string, (message: string) => ValidationRule> = {
  notEqualToPhone: (message: string) => ({
    custom: { validate: (value: any, f?: any) => (!value || !f?.phone) ? true : value !== f.phone, message },
  }),
  notEqualToEmail: (message: string) => ({
    custom: { validate: (value: any, f?: any) => (!value || !f?.email) ? true : value !== f.email, message },
  }),
  notEqualToSSN: (message: string) => ({
    custom: { validate: (value: any, f?: any) => (!value || !f?.ssn) ? true : value !== f.ssn, message },
  }),
}
const normalizeValidation = (raw: any, patterns: Record<string, string>): ValidationRule | undefined => {
  if (!raw || typeof raw !== 'object') return undefined
  const v: ValidationRule = {}
  if (raw.required !== undefined) v.required = typeof raw.required === 'string' ? raw.required : Boolean(raw.required)
  if (raw.email) v.email = typeof raw.email === 'string' ? raw.email : true
  if (raw.minLength !== undefined) v.minLength = typeof raw.minLength === 'object' ? raw.minLength : Number(raw.minLength)
  if (raw.maxLength !== undefined) v.maxLength = typeof raw.maxLength === 'object' ? raw.maxLength : Number(raw.maxLength)
  if (raw.min !== undefined) v.min = typeof raw.min === 'object' ? raw.min : Number(raw.min)
  if (raw.max !== undefined) v.max = typeof raw.max === 'object' ? raw.max : Number(raw.max)
  if (raw.matches && typeof raw.matches === 'object') {
    const msg = raw.matches.message || 'Invalid format'
    const pat = raw.matches.pattern
    if (typeof pat === 'string' && patterns[pat]) v.pattern = { value: patterns[pat], message: msg }
    else if (typeof pat === 'string') v.pattern = { value: pat, message: msg }
    else if (pat && typeof pat.source === 'string') v.pattern = { value: pat.source, message: msg }
    else v.pattern = { value: patterns.PHONE_VALIDATION_REGEX, message: msg }
  }
  if (raw.phoneUS) {
    const msg = typeof raw.phoneUS === 'string' ? raw.phoneUS : 'Please enter a valid US phone number'
    v.pattern = { value: patterns.PHONE_VALIDATION_REGEX, message: msg }
  }
  for (const key of Object.keys(CUSTOM_RULE_FACTORIES)) {
    if (raw[key]) {
      const msg = typeof raw[key] === 'string' ? raw[key] : (raw[key].message || 'Invalid value')
      const rule = CUSTOM_RULE_FACTORIES[key](msg)
      if (!v.custom) v.custom = rule.custom
    }
  }
  if (raw.minItems && typeof raw.minItems === 'object') v.minItems = raw.minItems
  if (raw.maxItems && typeof raw.maxItems === 'object') v.maxItems = raw.maxItems
  return Object.keys(v).length ? v : undefined
}

export function RemoteForm() {
  const params = useParams<{ formType: string; config: string }>()
  const formType = params.formType || 'tanstack'
  const configName = params.config || 'demo'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `http://localhost:3001/api/config/${encodeURIComponent(formType)}/${encodeURIComponent(configName)}`
        const res = await axios.get<ApiResponse>(url, { signal: controller.signal })
        setApiData(res.data)
      } catch (e) {
        if ((e as any)?.name === 'CanceledError' || (e as any)?.name === 'AbortError') return
        const msg = (axios.isAxiosError(e) && e.response)
          ? `API error: ${e.response.status}`
          : (e instanceof Error ? e.message : 'Failed to load config')
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [formType, configName])

  const formConfig: FormConfig | null = useMemo(() => {
    if (!apiData || !apiData.form || !apiData.form.fields) return null

    const fields: FieldConfig[] = apiData.form.fields.map((f) => ({
      name: f.name,
      label: f.label,
      type: mapToFieldType(f.type),
      required: f.required,
      placeholder: f.placeholder,
      description: f.description,
      disabled: f.disabled,
      options: f.options,
      validation: f.validation,
      conditions: f.conditions,
      // Array-specific properties
      arrayItemFields: f.arrayItemFields?.map((itemField): ArrayItemFieldConfig => ({
        name: itemField.name,
        label: itemField.label,
        type: mapToFieldType(itemField.type) as Exclude<FieldType, 'array'>,
        required: itemField.required,
        placeholder: itemField.placeholder,
        description: itemField.description,
        disabled: itemField.disabled,
        options: itemField.options,
        validation: itemField.validation,
      })),
      minItems: f.minItems,
      maxItems: f.maxItems,
      addButtonText: f.addButtonText,
      removeButtonText: f.removeButtonText,
    }))

    const defaultValues = fields.reduce<Record<string, any>>((acc, field) => {
      switch (field.type) {
        case 'checkbox':
          acc[field.name] = false
          break
        case 'number':
          acc[field.name] = '' // Let number fields be empty string initially
          break
        case 'array':
          // Only initialize array fields that are always visible (no conditions condition)
          if (!field.conditions) {
            // Initialize array fields with minItems number of empty items
            const minItems = field.minItems || 0
            const emptyItems = []
            
            for (let i = 0; i < minItems; i++) {
              // Create default values for each array item based on arrayItemFields
              const emptyItem = field.arrayItemFields?.reduce<Record<string, any>>((itemAcc, itemField) => {
                switch (itemField.type) {
                  case 'checkbox':
                    itemAcc[itemField.name] = false
                    break
                  case 'number':
                    itemAcc[itemField.name] = ''
                    break
                  default:
                    itemAcc[itemField.name] = ''
                }
                return itemAcc
              }, {}) || {}
              
              emptyItems.push(emptyItem)
            }
            
            acc[field.name] = emptyItems
          } else {
            // For conditional array fields, start with empty array
            acc[field.name] = []
          }
          break
        default:
          acc[field.name] = ''
      }
      return acc
    }, {})

    const cfg: FormConfig = {
      title: apiData.form.title ?? 'Remote Form',
      description: apiData.form.description,
      fields,
      defaultValues,
      submitButtonText: apiData.form.submitButtonText ?? 'Submit',
      resetButtonText: apiData.form.resetButtonText ?? 'Reset',
      onSubmit: async ({ value }) => {
        try {
          await axios.post(`http://localhost:3001/api/submit/${encodeURIComponent(formType)}`, value)
          alert('Submitted!')
        } catch (e) {
          const msg = (axios.isAxiosError(e) && e.response)
            ? `Submit failed: ${e.response.status}`
            : (e instanceof Error ? e.message : 'Submit failed')
          alert(msg)
        }
      },
    }
    return cfg
  }, [apiData])

  // Build step-based config if present
  const stepConfig: StepFormConfig | null = useMemo(() => {
    if (!apiData || !apiData.form || !apiData.form.steps) return null
    const patterns = buildPatternMap(apiData.validationPatterns)
    const steps = apiData.form.steps.map((s, si) => ({
      id: s.id,
      label: s.label,
      fields: (s.fields || []).map((f, fi) => ({
        name: f.name,
        label: f.label,
        type: mapToFieldType(f.type),
        required: f.required,
        placeholder: f.placeholder,
        description: f.description,
        disabled: f.disabled,
        options: f.options,
        validation: normalizeValidation((f as any).validation, patterns),
        conditions: Array.isArray((f as any).conditions)
          ? ((f as any).conditions.length === 1 ? (f as any).conditions[0] : { and: (f as any).conditions })
          : (f as any).conditions,
      })),
    }))
    const cfg: StepFormConfig = {
      title: apiData.form.title ?? 'Remote Step Form',
      description: apiData.form.description,
      steps,
      defaultValues: {},
      submitButtonText: apiData.form.submitButtonText ?? 'Submit',
      resetButtonText: apiData.form.resetButtonText ?? 'Reset',
      onSubmit: async ({ value }) => {
        try {
          await axios.post(`http://localhost:3001/api/submit/${encodeURIComponent(formType)}`, value)
          alert('Submitted!')
        } catch (e) {
          const msg = (axios.isAxiosError(e) && e.response)
            ? `Submit failed: ${e.response.status}`
            : (e instanceof Error ? e.message : 'Submit failed')
          alert(msg)
        }
      },
    }
    return cfg
  }, [apiData, formType])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
              Remote Config
            </div>
          </div>

          {loading && (
            <div className="text-gray-500">Loading form configuration…</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
              Failed to load config: {error}
            </div>
          )}

          {!loading && !error && (
            formType.toLowerCase() === 'tanstack' ? (
              formConfig ? (
                <DynamicForm config={formConfig} />
              ) : stepConfig ? (
                <StepForm config={stepConfig} />
              ) : (
                <div className="text-sm text-gray-600">No fields or steps found in config.</div>
              )
            ) : (
              <div className="text-sm text-gray-600">
                Renderer "{formType}" not implemented yet. Try tanstack.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
