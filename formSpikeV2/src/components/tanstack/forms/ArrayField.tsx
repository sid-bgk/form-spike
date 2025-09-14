import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { FieldConfig, ArrayItemFieldConfig } from '../types/form'
import { parseValidationConfig } from '../utils/ValidationConfigParser'
import { createFieldValidator } from '../utils/FieldValidatorFactory'
import { Trash2 } from 'lucide-react'

type ArrayFieldProps = {
  field: FieldConfig
  form: any
  fieldApi: any
}

export function ArrayField({ field, form, fieldApi }: ArrayFieldProps) {
  const { name, label, arrayItemFields, minItems = 1, maxItems, addButtonText = 'Add More', removeButtonText = 'Remove' } = field
  const initializedRef = useRef(false)

  const arrayValue = fieldApi.state.value || []

  // Initialize array with minItems if it's empty and field is visible
  useEffect(() => {
    // Only initialize once when the component first mounts
    if (!initializedRef.current) {
      const timer = setTimeout(() => {
        const currentValue = fieldApi.state.value
        
        // Only initialize if the array is empty and we need minimum items
        if ((!currentValue || !Array.isArray(currentValue) || currentValue.length === 0) && minItems > 0) {
          // Create default items based on minItems
          const defaultItems = Array.from({ length: minItems }, () => {
            return arrayItemFields?.reduce<Record<string, any>>((acc, itemField) => {
              switch (itemField.type) {
                case 'checkbox':
                  acc[itemField.name] = false
                  break
                case 'number':
                  acc[itemField.name] = ''
                  break
                default:
                  acc[itemField.name] = ''
              }
              return acc
            }, {}) || {}
          })
          
          fieldApi.handleChange(defaultItems)
          initializedRef.current = true
        } else if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
          // Mark as initialized if array already has items
          initializedRef.current = true
        }
      }, 50) // Reduced timeout for faster initialization
      
      return () => clearTimeout(timer)
    }
  }, [fieldApi, arrayItemFields, minItems])

  // Enhanced validation for array item fields using the validation system
  const getItemFieldValidators = (itemField: ArrayItemFieldConfig) => {
    // Create a temporary field config for validation parsing
    const tempFieldConfig = {
      ...itemField,
      name: itemField.name,
      label: itemField.label,
      type: itemField.type,
      required: itemField.required,
      validation: itemField.validation
    }
    
    // Parse validation configuration
    const validationConfig = parseValidationConfig(tempFieldConfig)
    
    // Handle backward compatibility for required: boolean
    if (itemField.required && !itemField.validation?.required) {
      validationConfig.rules.required = `${itemField.label} is required`
      validationConfig.isRequired = true
    }
    
    // Create field validator using the factory
    const fieldValidator = createFieldValidator(validationConfig)
    
    return {
      onChange: ({ value }: any) => {
        return fieldValidator.validate(value, form.state.values)
      }
    }
  }

  const addItem = () => {
    if (maxItems && arrayValue.length >= maxItems) return

    // Create default values for new item
    const newItem = arrayItemFields?.reduce<Record<string, any>>((acc, itemField) => {
      switch (itemField.type) {
        case 'checkbox':
          acc[itemField.name] = false
          break
        case 'number':
          acc[itemField.name] = ''
          break
        default:
          acc[itemField.name] = ''
      }
      return acc
    }, {}) || {}

    // Use TanStack Form's pushValue method if available, otherwise fallback
    if (fieldApi.pushValue) {
      fieldApi.pushValue(newItem)
    } else {
      // Fallback method
      const currentArray = Array.isArray(arrayValue) ? arrayValue : []
      fieldApi.handleChange([...currentArray, newItem])
    }
  }

  const removeItem = (index: number) => {
    if (arrayValue.length <= minItems) return
    
    // Use TanStack Form's removeValue method if available, otherwise fallback
    if (fieldApi.removeValue) {
      fieldApi.removeValue(index)
    } else {
      // Fallback method
      const currentArray = Array.isArray(arrayValue) ? arrayValue : []
      const newArray = currentArray.filter((_, i) => i !== index)
      fieldApi.handleChange(newArray)
    }
  }

  const renderItemField = (itemField: ArrayItemFieldConfig, itemIndex: number) => {
    const fieldName = `${name}[${itemIndex}].${itemField.name}`

    return (
      <form.Field
        key={`${itemIndex}-${itemField.name}`}
        name={fieldName}
        validators={getItemFieldValidators(itemField)}
      >
        {(subFieldApi: any) => (
          <div className="space-y-2 w-full">
            <Label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
              {itemField.label}
              {itemField.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {itemField.type === 'text' || itemField.type === 'email' || itemField.type === 'password' ? (
              <Input
                id={fieldName}
                type={itemField.type}
                placeholder={itemField.placeholder}
                disabled={itemField.disabled}
                value={subFieldApi.state.value || ''}
                onChange={(e) => subFieldApi.handleChange(e.target.value)}
                className="w-full"
              />
            ) : itemField.type === 'number' ? (
              <Input
                id={fieldName}
                type="number"
                placeholder={itemField.placeholder}
                disabled={itemField.disabled}
                value={subFieldApi.state.value || ''}
                onChange={(e) => subFieldApi.handleChange(e.target.value)}
                className="w-full"
              />
            ) : itemField.type === 'textarea' ? (
              <Textarea
                id={fieldName}
                placeholder={itemField.placeholder}
                disabled={itemField.disabled}
                value={subFieldApi.state.value || ''}
                onChange={(e) => subFieldApi.handleChange(e.target.value)}
                className="w-full"
              />
            ) : itemField.type === 'select' ? (
              <Select
                disabled={itemField.disabled}
                value={subFieldApi.state.value || ''}
                onValueChange={subFieldApi.handleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={itemField.placeholder || `Select ${itemField.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {itemField.options?.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : itemField.type === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={fieldName}
                  disabled={itemField.disabled}
                  checked={subFieldApi.state.value || false}
                  onCheckedChange={subFieldApi.handleChange}
                />
                <Label htmlFor={fieldName} className="text-sm font-normal">
                  {itemField.placeholder || 'Check this option'}
                </Label>
              </div>
            ) : itemField.type === 'radio' ? (
              <RadioGroup
                disabled={itemField.disabled}
                value={subFieldApi.state.value || ''}
                onValueChange={subFieldApi.handleChange}
              >
                {itemField.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(option.value)} id={`${fieldName}-${option.value}`} />
                    <Label htmlFor={`${fieldName}-${option.value}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : null}

            {itemField.description && (
              <p className="text-xs text-gray-600">{itemField.description}</p>
            )}

            {subFieldApi.state.meta.isTouched && !subFieldApi.state.meta.isValid ? (
              <p className="text-xs text-red-600">{subFieldApi.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>
    )
  }

  // Check if we should show array-level validation errors
  const shouldShowArrayError = () => {
    // Show error if field is required and array is empty
    if (field.validation?.required && arrayValue.length === 0) {
      return true
    }
    
    // Show error if array has fewer items than minItems
    if (arrayValue.length < minItems) {
      return true
    }
    
    // Show error if array has more items than maxItems
    if (maxItems && arrayValue.length > maxItems) {
      return true
    }
    
    return false
  }

  const getArrayErrorMessage = () => {
    // Check for required validation first
    if (field.validation?.required && arrayValue.length === 0) {
      return typeof field.validation.required === 'string' 
        ? field.validation.required 
        : `${label} is required`
    }
    
    // Check for minItems validation
    if (field.validation?.minItems && arrayValue.length < field.validation.minItems.value) {
      return field.validation.minItems.message
    }
    
    // Check for maxItems validation
    if (field.validation?.maxItems && arrayValue.length > field.validation.maxItems.value) {
      return field.validation.maxItems.message
    }
    
    // Fallback to generic minItems error
    if (arrayValue.length < minItems) {
      return `Please add at least ${minItems} ${minItems === 1 ? 'item' : 'items'}.`
    }
    
    return null
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        {label}
        {(field.required || field.validation?.required) && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {field.description && (
        <p className="text-sm text-gray-600">{field.description}</p>
      )}

      {arrayValue.length > 0 ? (
        arrayValue.map((item: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">
                {label} #{index + 1}
              </h4>
              {arrayValue.length > minItems && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{removeButtonText}</span>
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {arrayItemFields?.map((itemField) => renderItemField(itemField, index))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 py-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
          No items added yet. Click the button below to add your first item.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        disabled={maxItems ? arrayValue.length >= maxItems : false}
        className="w-full"
      >
        {addButtonText}
      </Button>

      {/* Show array-level validation errors */}
      {shouldShowArrayError() && (
        <p className="text-sm text-red-600">
          {getArrayErrorMessage()}
        </p>
      )}

      {/* Show TanStack form validation errors if any */}
      {fieldApi.state.meta.isTouched && !fieldApi.state.meta.isValid && fieldApi.state.meta.errors.length > 0 && (
        <p className="text-sm text-red-600">{fieldApi.state.meta.errors.join(', ')}</p>
      )}
    </div>
  )
}