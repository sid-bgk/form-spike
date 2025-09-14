import type { FieldConfig } from '../types/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldInfo } from './FieldInfo'
import { cn } from '@/lib/utils'

interface DynamicFieldProps {
  field: any
  config: FieldConfig
}

export function DynamicField({ field, config }: DynamicFieldProps) {
  const renderField = () => {
    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            id={field.name}
            name={field.name}
            type={config.type}
            placeholder={config.placeholder}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={config.disabled}
            className={cn(
              field.state.meta.isTouched && !field.state.meta.isValid && 'border-red-500',
              config.className
            )}
          />
        )

      case 'number':
        return (
          <Input
            id={field.name}
            name={field.name}
            type="number"
            placeholder={config.placeholder}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            onBlur={field.handleBlur}
            disabled={config.disabled}
            className={cn(
              field.state.meta.isTouched && !field.state.meta.isValid && 'border-red-500',
              config.className
            )}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            placeholder={config.placeholder}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={config.disabled}
            className={cn(
              field.state.meta.isTouched && !field.state.meta.isValid && 'border-red-500',
              config.className
            )}
          />
        )

      case 'select':
        // Filter out empty value options for Radix Select compatibility
        const validOptions = config.options?.filter(option => option.value !== '') || []
        const PLACEHOLDER_VALUE = '__placeholder__'
        const currentValue = field.state.value || PLACEHOLDER_VALUE

        return (
          <Select
            value={currentValue}
            onValueChange={(value) => field.handleChange(value === PLACEHOLDER_VALUE ? undefined : value)}
            disabled={config.disabled}
          >
            <SelectTrigger
              className={cn(
                field.state.meta.isTouched && !field.state.meta.isValid && 'border-red-500',
                config.className
              )}
            >
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PLACEHOLDER_VALUE}>
                <span className="text-muted-foreground">{config.placeholder || 'Select an option'}</span>
              </SelectItem>
              {validOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={field.state.value || false}
              onCheckedChange={(checked) => field.handleChange(checked)}
              disabled={config.disabled}
              className={config.className}
            />
            <Label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {config.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={String(option.value)}
                  checked={field.state.value === option.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={config.disabled}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="text-red-500 text-sm">
            Unsupported field type: {config.type}
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      {config.type !== 'checkbox' && (
        <Label
          htmlFor={field.name}
          className={cn(
            config.required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {config.label}
        </Label>
      )}

      {renderField()}

      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}

      <FieldInfo field={field} />
    </div>
  )
}