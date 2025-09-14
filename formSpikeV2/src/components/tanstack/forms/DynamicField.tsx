import { useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// Removed createFieldSchema import as validation file doesn't exist
import { useFieldVisibility } from '../hooks/useFieldVisibility'
import { ArrayField } from './ArrayField'
import * as jsonLogic from 'json-logic-js'
import type { FieldConfig } from '../types/form'

type DynamicFieldProps = {
  field: FieldConfig
  form: any
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  const { name, label, type, placeholder, description, disabled, options, required } = field

  // Check if field should be visible based on dependencies
  const isVisible = useFieldVisibility(form, field)

  // Create field-specific validators that dynamically enable/disable based on visibility
  const getFieldValidators = useMemo(() => {
    return {
      onChange: ({ value }: any) => {
        // For conditional fields, check if they should be validated
        if (field.showWhen) {
          // Get current form values to check visibility
          const currentFormValues = form.state.values
          const isCurrentlyVisible = jsonLogic.apply(field.showWhen, currentFormValues)

          // If field is not currently visible, don't validate
          if (!isCurrentlyVisible) {
            return undefined
          }
        }

        // Basic validation for visible fields
        if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          return `${field.label} is required`
        }
        
        if (field.type === 'email' && value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address'
          }
        }
        
        if (field.type === 'number' && value !== undefined && value !== '') {
          const num = Number(value)
          if (isNaN(num)) {
            return 'Please enter a valid number'
          }
        }
        
        if (field.type === 'array' && field.required) {
          if (!Array.isArray(value) || value.length === 0) {
            return `${field.label} must have at least one item`
          }
          if (field.minItems && value.length < field.minItems) {
            return `${field.label} must have at least ${field.minItems} items`
          }
        }
        
        return undefined
      }
    }
  }, [field, form])

  // Handle field visibility changes
  useEffect(() => {
    if (field.showWhen) {
      if (!isVisible) {
        // Clear the field value when it becomes hidden
        form.setFieldValue(name, field.type === 'checkbox' ? false : field.type === 'number' ? '' : field.type === 'array' ? [] : '')

        // Clear validation errors for hidden fields
        form.validateField(name, 'change')
      } else {
        // Field just became visible - let ArrayField handle its own initialization
        
        // Trigger validation to show required errors if empty
        setTimeout(() => {
          form.validateField(name, 'change')
        }, 0)
      }
    }
  }, [isVisible, form, name, field.showWhen, field.type, field.minItems, field.arrayItemFields])

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
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {type === 'array' ? (
            <ArrayField field={field} form={form} fieldApi={fieldApi} />
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