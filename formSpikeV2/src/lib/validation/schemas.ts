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
      if (isRequired) {
        schema = z.any().superRefine((val, ctx) => {
          // Check if empty/null/undefined
          if (val === '' || val === undefined || val === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label} is required`
            })
            return
          }

          // Convert to number and check if valid
          const num = Number(val)
          if (isNaN(num)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label} must be a valid number`
            })
            return
          }

          // Value is valid, no issues to add
        }).transform((val) => {
          if (val === '' || val === undefined || val === null) {
            return undefined
          }
          return Number(val)
        })
      } else {
        schema = z.any().superRefine((val, ctx) => {
          // For optional fields, empty is OK
          if (val === '' || val === undefined || val === null) {
            return // No error, this is fine for optional fields
          }

          // But if there's a value, it must be a valid number
          const num = Number(val)
          if (isNaN(num)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label} must be a valid number`
            })
            return
          }
        }).transform((val) => {
          if (val === '' || val === undefined || val === null) {
            return undefined
          }
          return Number(val)
        }).optional()
      }
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
    case 'multi':
      schema = z.array(z.union([z.string(), z.number()]))
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

    // Number-specific validations - add after the base schema is created
    if (type === 'number' && validation) {
      if (validation.min !== undefined) {
        schema = schema.refine((val: any) => {
          // Skip validation if undefined (for optional fields)
          if (val === undefined) return true
          return val >= validation.min!
        }, {
          message: `${field.label} must be at least ${validation.min}`
        })
      }

      if (validation.max !== undefined) {
        schema = schema.refine((val: any) => {
          // Skip validation if undefined (for optional fields)
          if (val === undefined) return true
          return val <= validation.max!
        }, {
          message: `${field.label} must be no more than ${validation.max}`
        })
      }
    }

    // Array-specific validations (for multi-select fields)
    if (type === 'multi' && validation) {
      if (validation.minItems) {
        const minValue = typeof validation.minItems === 'object' ? validation.minItems.value : validation.minItems
        const minMessage = typeof validation.minItems === 'object' ? validation.minItems.message : `${field.label} must have at least ${minValue} selections`
        schema = (schema as z.ZodArray<any>).min(minValue, minMessage)
      }

      if (validation.maxItems) {
        const maxValue = typeof validation.maxItems === 'object' ? validation.maxItems.value : validation.maxItems
        const maxMessage = typeof validation.maxItems === 'object' ? validation.maxItems.message : `${field.label} must have no more than ${maxValue} selections`
        schema = (schema as z.ZodArray<any>).max(maxValue, maxMessage)
      }
    }

    // Custom validation
    if (validation.custom) {
      schema = schema.refine(validation.custom.validate, {
        message: validation.custom.message
      })
    }
  }

  // Make optional if not required (except for number and checkbox which handle this above)
  if (!isRequired && type !== 'number' && type !== 'checkbox') {
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