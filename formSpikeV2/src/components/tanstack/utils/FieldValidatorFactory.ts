import type { ValidationRule, FieldType } from '../types/form'
import type { ValidationConfig } from './ValidationConfigParser'

export interface FieldValidator {
  validate: (value: any, formValues?: any) => string | undefined
  isRequired: boolean
}

/**
 * Create a field validator based on validation configuration
 */
export function createFieldValidator(config: ValidationConfig): FieldValidator {
  const validators: Array<(value: any, formValues?: any) => string | undefined> = []
  
  // Add required validator if needed
  if (config.isRequired && config.rules.required) {
    const message = typeof config.rules.required === 'string' 
      ? config.rules.required 
      : 'This field is required'
    validators.push(createRequiredValidator(message))
  }

  // Add email validator
  if (config.rules.email) {
    const message = typeof config.rules.email === 'string' 
      ? config.rules.email 
      : 'Please enter a valid email address'
    validators.push(createEmailValidator(message))
  }

  // Add length validators
  const minLength = config.rules.minLength
  const maxLength = config.rules.maxLength
  if (minLength || maxLength) {
    const minValue = typeof minLength === 'object' ? minLength.value : minLength
    const maxValue = typeof maxLength === 'object' ? maxLength.value : maxLength
    const minMessage = typeof minLength === 'object' ? minLength.message : undefined
    const maxMessage = typeof maxLength === 'object' ? maxLength.message : undefined
    
    validators.push(createLengthValidator(minValue, maxValue, { min: minMessage, max: maxMessage }))
  }

  // Add number validators
  const min = config.rules.min
  const max = config.rules.max
  if (min || max) {
    const minValue = typeof min === 'object' ? min.value : min
    const maxValue = typeof max === 'object' ? max.value : max
    const minMessage = typeof min === 'object' ? min.message : undefined
    const maxMessage = typeof max === 'object' ? max.message : undefined
    
    validators.push(createNumberValidator(minValue, maxValue, { min: minMessage, max: maxMessage }))
  }

  // Add pattern validator
  if (config.rules.pattern) {
    const pattern = typeof config.rules.pattern === 'object' 
      ? config.rules.pattern.value 
      : config.rules.pattern
    const message = typeof config.rules.pattern === 'object' 
      ? config.rules.pattern.message 
      : 'Invalid format'
    validators.push(createPatternValidator(pattern, message))
  }

  // Add array validators
  if (config.fieldType === 'array' && (config.rules.minItems || config.rules.maxItems)) {
    const minItems = config.rules.minItems?.value
    const maxItems = config.rules.maxItems?.value
    const minMessage = config.rules.minItems?.message
    const maxMessage = config.rules.maxItems?.message
    
    validators.push(createArrayValidator(minItems, maxItems, { min: minMessage, max: maxMessage }))
  }

  // Add custom validator
  if (config.rules.custom) {
    validators.push(createCustomValidator(config.rules.custom.validate, config.rules.custom.message))
  }

  // Combine all validators
  const combinedValidator = (value: any, formValues?: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value, formValues)
      if (error) {
        return error // Return first error found
      }
    }
    return undefined
  }

  return {
    validate: combinedValidator,
    isRequired: config.isRequired
  }
}

/**
 * Create a required field validator with custom message support
 */
export function createRequiredValidator(message: string): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    
    // For arrays, check if empty
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    
    // For objects, check if empty
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      return message
    }
    
    return undefined
  }
}

/**
 * Create an email format validator
 */
export function createEmailValidator(message: string): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (!value) return undefined // Skip validation if empty (handled by required validator)
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(value))) {
      return message
    }
    
    return undefined
  }
}

/**
 * Create a length validator for minLength/maxLength validation
 */
export function createLengthValidator(
  minLength?: number, 
  maxLength?: number, 
  messages?: { min?: string; max?: string }
): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (!value) return undefined // Skip validation if empty
    
    const length = String(value).length
    
    if (minLength !== undefined && length < minLength) {
      return messages?.min || `Must be at least ${minLength} characters`
    }
    
    if (maxLength !== undefined && length > maxLength) {
      return messages?.max || `Must be no more than ${maxLength} characters`
    }
    
    return undefined
  }
}

/**
 * Create a number validator for min/max number validation
 */
export function createNumberValidator(
  min?: number, 
  max?: number, 
  messages?: { min?: string; max?: string }
): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (!value && value !== 0) return undefined // Skip validation if empty
    
    const numValue = Number(value)
    if (isNaN(numValue)) {
      return 'Must be a valid number'
    }
    
    if (min !== undefined && numValue < min) {
      return messages?.min || `Must be at least ${min}`
    }
    
    if (max !== undefined && numValue > max) {
      return messages?.max || `Must be no more than ${max}`
    }
    
    return undefined
  }
}

/**
 * Create a pattern validator for regex pattern validation
 */
export function createPatternValidator(pattern: string, message: string): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (!value) return undefined // Skip validation if empty
    
    const regex = new RegExp(pattern)
    const stringValue = String(value)
    const isValid = regex.test(stringValue)
    
    // Debug logging for SSN validation
    if (pattern.includes('\\d{9}')) {
      console.log('SSN Validation Debug:', {
        pattern,
        value: stringValue,
        length: stringValue.length,
        isValid,
        message: isValid ? 'PASS' : message
      })
    }
    
    if (!isValid) {
      return message
    }
    
    return undefined
  }
}

/**
 * Create an array validator for minItems/maxItems validation
 */
export function createArrayValidator(
  minItems?: number, 
  maxItems?: number, 
  messages?: { min?: string; max?: string }
): (value: any) => string | undefined {
  return (value: any): string | undefined => {
    if (!Array.isArray(value)) {
      if (!value) return undefined // Skip validation if empty
      return 'Must be an array'
    }
    
    const length = value.length
    
    if (minItems !== undefined && length < minItems) {
      return messages?.min || `Must have at least ${minItems} items`
    }
    
    if (maxItems !== undefined && length > maxItems) {
      return messages?.max || `Must have no more than ${maxItems} items`
    }
    
    return undefined
  }
}

/**
 * Create a custom validator
 */
export function createCustomValidator(
  validateFn: (value: any, formValues?: any) => boolean | Promise<boolean>,
  message: string
): (value: any, formValues?: any) => string | undefined {
  return (value: any, formValues?: any): string | undefined => {
    try {
      const result = validateFn(value, formValues)
      // If async validator was provided, skip here (should be wired to onChangeAsync)
      if (result && typeof (result as any).then === 'function') {
        return undefined
      }
      const isValid = Boolean(result)
      return isValid ? undefined : message
    } catch (error) {
      return message
    }
  }
}
