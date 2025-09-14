import type { FieldConfig, ValidationRule, FieldType } from '../types/form'

export interface ValidationConfig {
    rules: ValidationRule
    isRequired: boolean
    fieldType: FieldType
    otherProps?: {
        minDate?: string | Date
        maxDate?: string | Date
    }
}

/**
 * Parse field configuration to extract validation rules and metadata
 */
export function parseValidationConfig(field: FieldConfig): ValidationConfig {
    const rules = field.validation || {}
    const isRequired = !!rules.required

    return {
        rules,
        isRequired,
        fieldType: field.type,
        otherProps: field.otherProps
    }
}

/**
 * Extract validation rules from field configuration
 */
export function extractValidationRules(field: FieldConfig): ValidationRule {
    return field.validation || {}
}

/**
 * Extract custom error messages from validation rules
 */
export function extractErrorMessages(rules: ValidationRule): Record<string, string> {
    const messages: Record<string, string> = {}

    if (rules.required && typeof rules.required === 'string') {
        messages.required = rules.required
    }

    if (rules.email && typeof rules.email === 'string') {
        messages.email = rules.email
    }

    if (rules.minLength && typeof rules.minLength === 'object') {
        messages.minLength = rules.minLength.message
    }

    if (rules.maxLength && typeof rules.maxLength === 'object') {
        messages.maxLength = rules.maxLength.message
    }

    if (rules.min && typeof rules.min === 'object') {
        messages.min = rules.min.message
    }

    if (rules.max && typeof rules.max === 'object') {
        messages.max = rules.max.message
    }

    if (rules.pattern && typeof rules.pattern === 'object') {
        messages.pattern = rules.pattern.message
    }

    if (rules.minItems) {
        messages.minItems = rules.minItems.message
    }

    if (rules.maxItems) {
        messages.maxItems = rules.maxItems.message
    }

    if (rules.custom) {
        messages.custom = rules.custom.message
    }

    return messages
}

/**
 * Get validation rule values (without messages)
 */
export function extractValidationValues(rules: ValidationRule): Record<string, any> {
    const values: Record<string, any> = {}

    if (rules.required) {
        values.required = true
    }

    if (rules.email) {
        values.email = true
    }

    if (rules.minLength) {
        values.minLength = typeof rules.minLength === 'object'
            ? rules.minLength.value
            : rules.minLength
    }

    if (rules.maxLength) {
        values.maxLength = typeof rules.maxLength === 'object'
            ? rules.maxLength.value
            : rules.maxLength
    }

    if (rules.min) {
        values.min = typeof rules.min === 'object'
            ? rules.min.value
            : rules.min
    }

    if (rules.max) {
        values.max = typeof rules.max === 'object'
            ? rules.max.value
            : rules.max
    }

    if (rules.pattern) {
        values.pattern = typeof rules.pattern === 'object'
            ? rules.pattern.value
            : rules.pattern
    }

    if (rules.minItems) {
        values.minItems = rules.minItems.value
    }

    if (rules.maxItems) {
        values.maxItems = rules.maxItems.value
    }

    if (rules.custom) {
        values.custom = rules.custom.validate
    }

    return values
}

/**
 * Check if field has any validation rules defined
 */
export function hasValidationRules(field: FieldConfig): boolean {
    return field.validation !== undefined && Object.keys(field.validation).length > 0
}

/**
 * Get default error message for a validation rule type
 */
export function getDefaultErrorMessage(ruleType: string, fieldLabel: string, value?: any): string {
    const messages: Record<string, string> = {
        required: `${fieldLabel} is required`,
        email: 'Please enter a valid email address',
        minLength: `${fieldLabel} must be at least ${value} characters`,
        maxLength: `${fieldLabel} must be no more than ${value} characters`,
        min: `${fieldLabel} must be at least ${value}`,
        max: `${fieldLabel} must be no more than ${value}`,
        pattern: `${fieldLabel} format is invalid`,
        minItems: `${fieldLabel} must have at least ${value} items`,
        maxItems: `${fieldLabel} must have no more than ${value} items`,
        custom: `${fieldLabel} is invalid`
    }

    return messages[ruleType] || `${fieldLabel} is invalid`
}