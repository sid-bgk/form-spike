import { z } from 'zod'
import type { FieldConfig, FieldType } from '../types/form'

export function createFieldSchema(field: FieldConfig): z.ZodSchema {
  const { type, required, validation } = field
  const isRequired = required || validation?.required

  let schema: z.ZodSchema

  // Base schema by type
  switch (type) {
    case 'text':
    case 'password':
    case 'textarea':
      schema = z.string()
      if (isRequired) {
        schema = schema.min(1, `${field.label} is required`)
      }
      break
    case 'email':
      schema = z.string()
      if (isRequired) {
        schema = schema.min(1, `${field.label} is required`)
      }
      schema = schema.email('Please enter a valid email address')
      break
    case 'number':
      schema = z.string()
      if (isRequired) {
        schema = schema.min(1, `${field.label} is required`)
      }
      schema = schema.refine(val => val === '' || !isNaN(Number(val)), {
        message: `${field.label} must be a valid number`
      })
      break
    case 'checkbox':
      schema = z.boolean()
      if (isRequired) {
        schema = schema.refine(val => val === true, {
          message: `${field.label} is required`
        })
      }
      break
    case 'select':
    case 'radio':
      schema = z.string()
      if (isRequired) {
        schema = schema.min(1, `${field.label} is required`)
      }
      break
    default:
      schema = z.string()
      if (isRequired) {
        schema = schema.min(1, `${field.label} is required`)
      }
  }

  // Apply additional validation rules
  if (validation && type !== 'checkbox') {
    // String-specific validations
    if (type !== 'number') {
      const stringSchema = schema as z.ZodString

      if (validation.minLength) {
        schema = stringSchema.min(validation.minLength, `${field.label} must be at least ${validation.minLength} characters`)
      }

      if (validation.maxLength) {
        schema = stringSchema.max(validation.maxLength, `${field.label} must be no more than ${validation.maxLength} characters`)
      }

      if (validation.pattern) {
        schema = stringSchema.regex(new RegExp(validation.pattern), `${field.label} format is invalid`)
      }
    }

    // Number-specific validations (already converted to string schema above)
    if (type === 'number') {
      if (validation.min !== undefined) {
        schema = schema.refine(val => val === '' || Number(val) >= validation.min!, {
          message: `${field.label} must be at least ${validation.min}`
        })
      }

      if (validation.max !== undefined) {
        schema = schema.refine(val => val === '' || Number(val) <= validation.max!, {
          message: `${field.label} must be no more than ${validation.max}`
        })
      }
    }

    // Custom validation
    if (validation.custom) {
      schema = schema.refine(validation.custom.validate, {
        message: validation.custom.message
      })
    }
  }

  // Make optional if not required
  if (!isRequired) {
    schema = schema.optional().or(z.literal(''))
  }

  return schema
}

export function createFormSchema(fields: FieldConfig[]): z.ZodObject<any> {
  const shape: Record<string, z.ZodSchema> = {}

  fields.forEach(field => {
    shape[field.name] = createFieldSchema(field)
  })

  return z.object(shape)
}