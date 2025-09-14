import { useEffect, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrayField } from './ArrayField'
import * as jsonLogic from 'json-logic-js'
import type { FieldConfig, FieldType } from '../types/form'
import type { UseFormReturn } from 'react-hook-form'

type DynamicFieldProps = {
  field: FieldConfig
  form: UseFormReturn<any>
  watchedValues: Record<string, any>
}

export function DynamicField({ field, form, watchedValues }: DynamicFieldProps) {
  const { name, label, type, placeholder, description, disabled, options } = field
  const { register, control, setValue, formState } = form
  const { errors } = formState

  // Determine if field is required using new validation system or legacy required property
  const isFieldRequired = useMemo(() => {
    if (field.validation?.required) {
      return true
    }
    return !!field.required
  }, [field.validation, field.required])

  // Check if field should be visible based on conditions
  const isVisible = useMemo(() => {
    if (!field.conditions) return true
    return jsonLogic.apply(field.conditions, watchedValues)
  }, [field.conditions, watchedValues])

  // Helper function to get default value based on field type
  const getDefaultValueForFieldType = (fieldType: FieldType) => {
    switch (fieldType) {
      case 'checkbox':
        return false
      case 'array':
        return []
      case 'number':
        return ''
      default:
        return ''
    }
  }

  // Handle field visibility changes
  useEffect(() => {
    if (field.conditions && !isVisible) {
      // Clear the field value when it becomes hidden
      const defaultValue = getDefaultValueForFieldType(field.type)
      setValue(name, defaultValue)
    }
  }, [isVisible, setValue, name, field.conditions, field.type])

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  // Get field error
  const fieldError = errors[name]

  const renderField = () => {
    switch (type) {
      case 'array':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field: controllerField }) => (
              <ArrayField
                field={field}
                value={controllerField.value || []}
                onChange={controllerField.onChange}
                error={fieldError}
              />
            )}
          />
        )

      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name)}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name)}
          />
        )

      case 'select':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                disabled={disabled}
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
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
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={name}
                  disabled={disabled}
                  checked={controllerField.value || false}
                  onCheckedChange={controllerField.onChange}
                />
                <Label htmlFor={name} className="text-sm font-normal">
                  {placeholder || 'Check this option'}
                </Label>
              </div>
            )}
          />
        )

      case 'radio':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field: controllerField }) => (
              <RadioGroup
                disabled={disabled}
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
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
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {isFieldRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {renderField()}

      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {fieldError && (
        <p className="text-sm text-red-600">
          {(fieldError as any)?.message || 'This field has an error'}
        </p>
      )}
    </div>
  )
}