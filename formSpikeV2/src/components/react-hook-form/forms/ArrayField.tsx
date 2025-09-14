import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { FieldConfig, ArrayItemFieldConfig } from '../types/form'
import { Trash2 } from 'lucide-react'

type ArrayFieldProps = {
  field: FieldConfig
  value?: any[]
  onChange?: (value: any[]) => void
  error?: any
}

export function ArrayField({ field, error }: ArrayFieldProps) {
  const { name, label, arrayItemFields, minItems = 1, maxItems, addButtonText = 'Add More', removeButtonText = 'Remove' } = field
  const { control, register, formState } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  })

  const addItem = () => {
    if (maxItems && fields.length >= maxItems) return

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

    append(newItem)
  }

  const removeItem = (index: number) => {
    if (fields.length <= minItems) return
    remove(index)
  }

  const renderItemField = (itemField: ArrayItemFieldConfig, itemIndex: number) => {
    const fieldName = `${name}.${itemIndex}.${itemField.name}` as const

    return (
      <div key={`${itemIndex}-${itemField.name}`} className="space-y-2 w-full">
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
            {...register(fieldName)}
            className="w-full"
          />
        ) : itemField.type === 'number' ? (
          <Input
            id={fieldName}
            type="number"
            placeholder={itemField.placeholder}
            disabled={itemField.disabled}
            {...register(fieldName)}
            className="w-full"
          />
        ) : itemField.type === 'textarea' ? (
          <Textarea
            id={fieldName}
            placeholder={itemField.placeholder}
            disabled={itemField.disabled}
            {...register(fieldName)}
            className="w-full"
          />
        ) : itemField.type === 'select' ? (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                disabled={itemField.disabled}
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
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
            )}
          />
        ) : itemField.type === 'checkbox' ? (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={fieldName}
                  disabled={itemField.disabled}
                  checked={controllerField.value || false}
                  onCheckedChange={controllerField.onChange}
                />
                <Label htmlFor={fieldName} className="text-sm font-normal">
                  {itemField.placeholder || 'Check this option'}
                </Label>
              </div>
            )}
          />
        ) : itemField.type === 'radio' ? (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <RadioGroup
                disabled={itemField.disabled}
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
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
            )}
          />
        ) : null}

        {itemField.description && (
          <p className="text-xs text-gray-600">{itemField.description}</p>
        )}

        {/* Show field-specific errors */}
        {formState.errors?.[name] && Array.isArray(formState.errors[name]) &&
         (formState.errors[name] as any[])?.[itemIndex]?.[itemField.name] && (
          <p className="text-xs text-red-600">
            {((formState.errors[name] as any[])[itemIndex][itemField.name] as any)?.message}
          </p>
        )}
      </div>
    )
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

      {fields.length > 0 ? (
        fields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">
                {label} #{index + 1}
              </h4>
              {fields.length > minItems && (
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
        disabled={maxItems ? fields.length >= maxItems : false}
        className="w-full"
      >
        {addButtonText}
      </Button>

      {/* Show array-level validation errors */}
      {error && (
        <p className="text-sm text-red-600">
          {error.message || 'This field has an error'}
        </p>
      )}
    </div>
  )
}