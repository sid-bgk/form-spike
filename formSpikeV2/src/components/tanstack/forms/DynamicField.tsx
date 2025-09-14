import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFieldSchema } from '@/lib/validation'
import type { FieldConfig } from '../types/form'

type DynamicFieldProps = {
  field: FieldConfig
  form: any
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  const { name, label, type, placeholder, description, disabled, options, required } = field

  // Create field-specific validators
  const getFieldValidators = () => {
    const fieldSchema = createFieldSchema(field)

    return {
      onChange: ({ value }: any) => {
        try {
          fieldSchema.parse(value)
          return undefined
        } catch (error: any) {
          if (error.issues && error.issues.length > 0) {
            return error.issues[0].message
          }
          return error.message || `${field.label} is invalid`
        }
      }
    }
  }

  return (
    <form.Field name={name} validators={getFieldValidators()}>
      {(fieldApi: any) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {type === 'text' || type === 'email' || type === 'password' || type === 'number' ? (
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