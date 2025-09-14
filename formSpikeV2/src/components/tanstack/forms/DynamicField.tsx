import { useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFieldVisibility } from '../hooks/useFieldVisibility'
import { ArrayField } from './ArrayField'
import { DateField } from './DateField'
import { parseValidationConfig } from '../utils/ValidationConfigParser'
import { createFieldValidator } from '../utils/FieldValidatorFactory'
import { formatDateForInput } from '../utils/dateUtils'
import { jsonLogic } from '../utils/jsonLogicExtensions'
import type { FieldConfig, FieldType } from '../types/form'

type DynamicFieldProps = {
  field: FieldConfig
  form: any
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  const { name, label, type, placeholder, description, disabled, options } = field

  // Determine if field is required using new validation system or legacy required property
  const isFieldRequired = useMemo(() => {
    if (field.validation?.required) {
      return true
    }
    return !!field.required
  }, [field.validation, field.required])

  // Check if field should be visible based on dependencies
  const isVisible = useFieldVisibility(form, field)

  // Create field-specific validators using the new validation system
  const getFieldValidators = useMemo(() => {
    // Parse validation configuration from field
    const validationConfig = parseValidationConfig(field)

    // Handle backward compatibility for required: boolean
    if (field.required && !field.validation?.required) {
      validationConfig.rules.required = `${field.label} is required`
      validationConfig.isRequired = true
    }



    // Create field validator using the factory
    const fieldValidator = createFieldValidator(validationConfig)

    return {
      onChange: ({ value }: any) => {
        // For conditional fields, check if they should be validated
        if (field.conditions) {
          // Get current form values to check visibility
          const currentFormValues = form.state.values
          const isCurrentlyVisible = jsonLogic.apply(field.conditions, currentFormValues)

          // If field is not currently visible, don't validate and return no error
          if (!isCurrentlyVisible) {
            return undefined
          }
        }

        // Use the new validation system for visible fields
        return fieldValidator.validate(value, form.state.values)
      }
    }
  }, [field, form])

  // Handle field visibility changes and validation state
  useEffect(() => {
    if (field.conditions) {
      if (!isVisible) {
        // Clear the field value when it becomes hidden
        const defaultValue = getDefaultValueForFieldType(field.type)
        form.setFieldValue(name, defaultValue)

        // Clear validation errors by resetting the field
        // This is a simpler approach that works with TanStack Form
        try {
          form.resetFieldMeta(name)
        } catch (error) {
          // If resetFieldMeta doesn't exist, we'll just clear the value
          // The validation will be handled by the conditional logic in validators
          console.log('Field meta reset not available, relying on conditional validation')
        }
      } else {
        // When field becomes visible, re-validate after a short delay to ensure form state is updated
        setTimeout(() => {
          const currentValue = form.getFieldValue(name)
          // Only validate if the field has a value or is required
          if (currentValue !== undefined && currentValue !== '' && currentValue !== null) {
            try {
              form.validateField(name, 'change')
            } catch (error) {
              // If validateField doesn't exist, validation will happen through normal onChange
              console.log('Manual field validation not available, relying on onChange validation')
            }
          }
        }, 0)
      }
    }
  }, [isVisible, form, name, field.conditions, field.type])

  // Helper function to get default value based on field type
  const getDefaultValueForFieldType = (fieldType: FieldType) => {
    switch (fieldType) {
      case 'checkbox':
        return false
      case 'array':
        return []
      case 'number':
        return ''
      case 'date':
        return ''
      default:
        return ''
    }
  }

  // Additional effect to handle form value changes that might affect conditional field validation
  useEffect(() => {
    if (field.conditions && isVisible) {
      // When form values change and this field is visible, re-validate if needed
      const currentValue = form.getFieldValue(name)

      // Only re-validate if field has a value
      if (currentValue !== undefined && currentValue !== '' && currentValue !== null) {
        // Small delay to ensure form state is consistent
        setTimeout(() => {
          try {
            form.validateField(name, 'change')
          } catch (error) {
            // If validateField doesn't exist, validation will happen through normal onChange
            console.log('Manual field validation not available, relying on onChange validation')
          }
        }, 0)
      }
    }
  }, [form.state.values, field.conditions, isVisible, form, name])

  // Handle default value initialization for date fields
  useEffect(() => {
    if (field.type === 'date' && field.defaultValue && isVisible) {
      const currentValue = form.getFieldValue(name)
      
      // Only set default value if field is empty
      if (!currentValue) {
        const formattedDefaultValue = formatDateForInput(field.defaultValue)
        if (formattedDefaultValue) {
          form.setFieldValue(name, formattedDefaultValue)
        }
      }
    }
  }, [field.type, field.defaultValue, isVisible, form, name])

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  return (
    <form.Field name={name} validators={getFieldValidators}>
      {(fieldApi: any) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {isFieldRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {type === 'array' ? (
            <ArrayField field={field} form={form} fieldApi={fieldApi} />
          ) : type === 'date' ? (
            <DateField
              id={name}
              value={fieldApi.state.value || ''}
              onChange={fieldApi.handleChange}
              disabled={disabled}
              minDate={field.otherProps?.minDate}
              maxDate={field.otherProps?.maxDate}
            />
          ) : type === 'text' || type === 'email' || type === 'password' || type === 'number' ? (
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              value={fieldApi.state.value || ''}
              onChange={(e) => fieldApi.handleChange(e.target.value)}
            />
          ) : type === 'textarea' ? (
            <Textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              value={fieldApi.state.value || ''}
              onChange={(e) => fieldApi.handleChange(e.target.value)}
            />
          ) : type === 'select' ? (
            <Select
              disabled={disabled}
              value={fieldApi.state.value || ''}
              onValueChange={fieldApi.handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                disabled={disabled}
                checked={fieldApi.state.value || false}
                onCheckedChange={fieldApi.handleChange}
              />
              <Label htmlFor={name} className="text-sm font-normal">
                {placeholder || 'Check this option'}
              </Label>
            </div>
          ) : type === 'radio' ? (
            <RadioGroup
              disabled={disabled}
              value={fieldApi.state.value || ''}
              onValueChange={fieldApi.handleChange}
            >
              {options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(option.value)} id={`${name}-${option.value}`} />
                  <Label htmlFor={`${name}-${option.value}`} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : null}

          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}

          {fieldApi.state.meta.isTouched && !fieldApi.state.meta.isValid ? (
            <p className="text-sm text-red-600">{fieldApi.state.meta.errors.join(', ')}</p>
          ) : null}
        </div>
      )}
    </form.Field>
  )
}