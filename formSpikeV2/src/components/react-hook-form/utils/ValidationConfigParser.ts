import { z } from 'zod'
import type { FieldConfig, ValidationRule, FieldType, FormConfig } from '../types/form'

/**
 * Create Zod schema for a single field based on its configuration
 */
export function createFieldSchema(field: FieldConfig): z.ZodTypeAny {
  const rules = field.validation || {}
  let schema: z.ZodTypeAny

  // Base schema based on field type
  switch (field.type) {
    case 'email':
      schema = z.string()
      if (rules.email) {
        const message = typeof rules.email === 'string' ? rules.email : 'Please enter a valid email address'
        schema = (schema as z.ZodString).email(message)
      } else {
        schema = (schema as z.ZodString).email('Please enter a valid email address')
      }
      break

    case 'number':
      schema = z.coerce.number() // coerce to handle string inputs from HTML inputs
      break

    case 'checkbox':
      schema = z.boolean()
      break

    case 'array':
      // Create schema for array items
      if (field.arrayItemFields) {
        const itemSchema = z.object(
          field.arrayItemFields.reduce((acc, itemField) => {
            acc[itemField.name] = createFieldSchema({
              ...itemField,
              validation: itemField.validation,
            })
            return acc
          }, {} as Record<string, z.ZodTypeAny>)
        )
        schema = z.array(itemSchema)
      } else {
        schema = z.array(z.any())
      }
      break

    case 'text':
    case 'password':
    case 'textarea':
    case 'select':
    case 'radio':
    default:
      schema = z.string()
      break
  }

  // Apply validation rules
  if (rules.required) {
    const message = typeof rules.required === 'string' ? rules.required : `${field.label} is required`
    if (field.type === 'checkbox') {
      schema = (schema as z.ZodBoolean).refine((val) => val === true, { message })
    } else if (field.type === 'array') {
      schema = (schema as z.ZodArray<z.ZodTypeAny>).min(1, message)
    } else {
      schema = (schema as z.ZodString).min(1, message)
    }
  } else {
    // Make field optional if not required
    if (field.type === 'array') {
      schema = schema.optional()
    } else if (field.type === 'checkbox') {
      schema = schema.optional()
    } else {
      schema = schema.optional().or(z.literal(''))
    }
  }

  // String-specific validations
  if (field.type !== 'number' && field.type !== 'checkbox' && field.type !== 'array') {
    if (rules.minLength) {
      const minLength = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength
      const message = typeof rules.minLength === 'object' ? rules.minLength.message :
        `${field.label} must be at least ${minLength} characters`
      schema = (schema as z.ZodString).min(minLength, message)
    }

    if (rules.maxLength) {
      const maxLength = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength
      const message = typeof rules.maxLength === 'object' ? rules.maxLength.message :
        `${field.label} must be no more than ${maxLength} characters`
      schema = (schema as z.ZodString).max(maxLength, message)
    }

    if (rules.pattern) {
      const pattern = typeof rules.pattern === 'object' ? rules.pattern.value : rules.pattern
      const message = typeof rules.pattern === 'object' ? rules.pattern.message :
        `${field.label} format is invalid`
      schema = (schema as z.ZodString).regex(new RegExp(pattern), message)
    }
  }

  // Number-specific validations
  if (field.type === 'number') {
    if (rules.min) {
      const min = typeof rules.min === 'object' ? rules.min.value : rules.min
      const message = typeof rules.min === 'object' ? rules.min.message :
        `${field.label} must be at least ${min}`
      schema = (schema as z.ZodNumber).min(min, message)
    }

    if (rules.max) {
      const max = typeof rules.max === 'object' ? rules.max.value : rules.max
      const message = typeof rules.max === 'object' ? rules.max.message :
        `${field.label} must be no more than ${max}`
      schema = (schema as z.ZodNumber).max(max, message)
    }
  }

  // Array-specific validations
  if (field.type === 'array') {
    if (rules.minItems) {
      const minItems = rules.minItems.value
      const message = rules.minItems.message
      schema = (schema as z.ZodArray<z.ZodTypeAny>).min(minItems, message)
    }

    if (rules.maxItems) {
      const maxItems = rules.maxItems.value
      const message = rules.maxItems.message
      schema = (schema as z.ZodArray<z.ZodTypeAny>).max(maxItems, message)
    }
  }

  // Custom validation
  if (rules.custom) {
    schema = schema.refine(
      (value) => rules.custom!.validate(value),
      { message: rules.custom.message }
    )
  }

  return schema
}

/**
 * Create complete Zod schema for the entire form
 */
export function createFormSchema(config: FormConfig): z.ZodObject<any> {
  const schemaFields = config.fields.reduce((acc, field) => {
    acc[field.name] = createFieldSchema(field)
    return acc
  }, {} as Record<string, z.ZodTypeAny>)

  return z.object(schemaFields)
}

/**
 * Parse field configuration to extract validation rules and metadata
 * (Compatibility function for existing code)
 */
export interface ValidationConfig {
  rules: ValidationRule
  isRequired: boolean
  fieldType: FieldType
}

export function parseValidationConfig(field: FieldConfig): ValidationConfig {
  const rules = field.validation || {}
  const isRequired = !!rules.required

  return {
    rules,
    isRequired,
    fieldType: field.type
  }
}

/**
 * Extract validation rules from field configuration
 */
export function extractValidationRules(field: FieldConfig): ValidationRule {
  return field.validation || {}
}