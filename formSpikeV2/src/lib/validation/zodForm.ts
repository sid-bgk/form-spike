import { z, type ZodTypeAny, type ZodObject } from 'zod'

// Minimal shape for fields to keep this module UI-agnostic
export type FieldTypeLike = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
export type FieldConfigLike = {
  name: string
  label: string
  type: FieldTypeLike
  required?: boolean
}

/**
 * Generic, type-driven Zod validators for TanStack forms.
 * - Maps FieldConfig.type to sensible Zod primitives
 * - Adds common constraints (required, min/max, patterns)
 * - Supports custom formats like US phone via helpers
 * - Adapts Zod schemas to TanStack field validator signatures
 */

export type FieldValidationMessages = {
  required?: string
  invalid?: string
  invalidEmail?: string
  invalidUrl?: string
  minLength?: string
  maxLength?: string
  min?: string
  max?: string
  mustBeTrue?: string
  invalidSelection?: string
  invalidPhoneUS?: string
}

export type StringRules = {
  trim?: boolean
  minLength?: { value: number; message?: string }
  maxLength?: { value: number; message?: string }
  pattern?: { value: RegExp; message?: string }
  email?: boolean
  url?: boolean
}

export type NumberRules = {
  int?: boolean
  min?: { value: number; message?: string }
  max?: { value: number; message?: string }
}

export type CheckboxRules = {
  requireTrue?: { message?: string }
}

export type SelectRules = {
  required?: boolean
}

export type FieldEnhancements = {
  messages?: FieldValidationMessages
  string?: StringRules
  number?: NumberRules
  checkbox?: CheckboxRules
  select?: SelectRules
  /**
   * Optional special format handling. Example: 'phoneUS'
   * Useful when FieldConfig.type is a generic text input but the content is domain-specific.
   */
  format?: 'phoneUS' | 'uuid' | 'url'
  /**
   * Final customizer to adjust the Zod schema built from the type/rules.
   */
  customize?: (schema: ZodTypeAny, field: FieldConfigLike) => ZodTypeAny
}

// Liberal but practical US phone pattern: allows optional country code, spaces, dashes, parentheses.
// Enforces NANP rules for the first digit of area code and central office code (cannot be 0 or 1)
const US_PHONE_REGEX = /^(?:\+?1[\s.-]?)?(?:\(([2-9]\d{2})\)|([2-9]\d{2}))[\s.-]?([2-9]\d{2})[\s.-]?(\d{4})$/

export const zUSPhone = (message = 'Enter a valid US phone number') =>
  z.string().trim().regex(US_PHONE_REGEX, message)

/**
 * Create a base Zod schema based on FieldConfig.type and supplied enhancements
 */
export function buildZodForField(field: FieldConfigLike, enh?: FieldEnhancements): ZodTypeAny {
  const messages: FieldValidationMessages = {
    required: 'This field is required',
    invalid: 'Invalid value',
    invalidEmail: 'Enter a valid email address',
    invalidUrl: 'Enter a valid URL',
    minLength: 'Too short',
    maxLength: 'Too long',
    min: 'Value is too small',
    max: 'Value is too large',
    mustBeTrue: 'This must be checked',
    invalidSelection: 'Please select a value',
    invalidPhoneUS: 'Enter a valid US phone number',
    ...enh?.messages,
  }

  let schema: ZodTypeAny

  switch (field.type) {
    case 'text':
    case 'password':
    case 'textarea':
      schema = z.string()
      if (enh?.string?.trim) schema = schema.trim()
      // Special format overrides for string-like fields
      if (enh?.format === 'phoneUS') {
        schema = zUSPhone(messages.invalidPhoneUS)
      } else if (enh?.string?.email || field.type === 'email') {
        schema = schema.min(1, messages.required).email(messages.invalidEmail)
      } else if (enh?.string?.url) {
        schema = schema.min(1, messages.required).url(messages.invalidUrl)
      }
      if (enh?.string?.minLength)
        schema = schema.min(enh.string.minLength.value, enh.string.minLength.message ?? messages.minLength!)
      if (enh?.string?.maxLength)
        schema = schema.max(enh.string.maxLength.value, enh.string.maxLength.message ?? messages.maxLength!)
      if (enh?.string?.pattern)
        schema = schema.regex(enh.string.pattern.value, enh.string.pattern.message ?? messages.invalid!)
      break

    case 'email':
      schema = z.string().min(1, messages.required).email(messages.invalidEmail)
      break

    case 'number': {
      const base = z.number({ required_error: messages.required })
      const numRules = enh?.number
      schema = numRules?.int ? base.int() : base
      if (numRules?.min) schema = schema.min(numRules.min.value, numRules.min.message ?? messages.min!)
      if (numRules?.max) schema = schema.max(numRules.max.value, numRules.max.message ?? messages.max!)
      break
    }

    case 'checkbox': {
      const base = z.boolean()
      if (enh?.checkbox?.requireTrue || field.required) {
        schema = base.refine((v) => v === true, enh?.checkbox?.requireTrue?.message ?? messages.mustBeTrue)
      } else {
        schema = base
      }
      break
    }

    case 'select':
    case 'radio': {
      const selRequired = enh?.select?.required ?? field.required
      schema = selRequired
        ? z.string().min(1, messages.invalidSelection)
        : z.string().optional().transform((v) => v ?? '')
      break
    }

    default:
      // Fallback to string, so callers aren’t blocked on new UI types
      schema = z.any()
  }

  // Top-level required (for string-like only). For number we already used required_error.
  if (field.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, messages.required)
    }
  }

  if (enh?.customize) {
    schema = enh.customize(schema, field)
  }

  return schema
}

/**
 * Convert a Zod schema to TanStack field validators (onChange + onBlur)
 */
export function zodToTanStackValidators(schema: ZodTypeAny) {
  const firstError = (val: unknown) => {
    const r = schema.safeParse(val)
    if (r.success) return undefined
    return r.error.issues[0]?.message || 'Invalid value'
  }
  return {
    onChange: ({ value }: { value: unknown }) => firstError(value),
    onBlur: ({ value }: { value: unknown }) => firstError(value),
  }
}

/**
 * Build validators for a single field from FieldConfig and optional enhancements.
 * Returns both the Zod schema and the TanStack-compatible validators.
 */
export function buildValidatorsForField(field: FieldConfigLike, enh?: FieldEnhancements) {
  const schema = buildZodForField(field, enh)
  const validators = zodToTanStackValidators(schema)
  return { schema, validators }
}

/**
 * Build a Zod object schema for an entire form from a field list and per-field enhancements map.
 */
export function buildFormSchema(
  fields: FieldConfigLike[],
  byNameEnhancements?: Record<string, FieldEnhancements | undefined>
): ZodObject<any> {
  const shape: Record<string, ZodTypeAny> = {}
  for (const field of fields) {
    const enh = byNameEnhancements?.[field.name]
    shape[field.name] = buildZodForField(field, enh)
  }
  return z.object(shape)
}

/**
 * Validate whole-form values with a Zod object schema and return a flat map of field errors.
 */
export function zodFormValidator<T extends Record<string, any>>(schema: ZodObject<any>) {
  return (values: T): Record<string, string> => {
    const res = schema.safeParse(values)
    if (res.success) return {}
    const errors: Record<string, string> = {}
    for (const issue of res.error.issues) {
      const path = issue.path.join('.')
      if (!errors[path]) errors[path] = issue.message
    }
    return errors
  }
}
