import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FieldConfig } from '../types/form'

type DynamicFieldProps = {
  field: FieldConfig
  form: any
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  const { name, label, type, placeholder, description, disabled, options, required } = field

  return (
    <form.Field name={name}>
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

          {fieldApi.state.meta.errors && (
            <p className="text-sm text-red-600">{fieldApi.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>
  )
}