import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface MultiSelectFieldProps {
  id: string
  options: Array<{ value: string | number; label: string }>
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  disabled?: boolean
  className?: string
}

export function MultiSelectField({
  id,
  options,
  value = [],
  onChange,
  disabled = false,
  className
}: MultiSelectFieldProps) {
  // Handle individual checkbox toggle
  const handleOptionToggle = (optionValue: string | number) => {
    if (disabled) return

    const currentValue = Array.isArray(value) ? value : []
    const isSelected = currentValue.includes(optionValue)

    if (isSelected) {
      // Remove from selection
      const newValue = currentValue.filter(v => v !== optionValue)
      onChange(newValue)
    } else {
      // Add to selection
      const newValue = [...currentValue, optionValue]
      onChange(newValue)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, optionValue: string | number) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleOptionToggle(optionValue)
    }
  }

  return (
    <div 
      className={cn('space-y-1', className)}
      role="listbox"
      aria-multiselectable="true"
      aria-label="Multi-select options"
    >
      {options.length === 0 ? (
        <p className="text-sm text-gray-500">No options available</p>
      ) : (
        options.map((option) => {
          const isSelected = Array.isArray(value) && value.includes(option.value)
          const optionId = `${id}-${option.value}`

          return (
            <div 
              key={option.value} 
              className={cn(
                'flex items-center space-x-2 p-2 rounded-md transition-all duration-200',
                'hover:bg-gray-50 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20',
                disabled && 'hover:bg-transparent focus-within:bg-transparent focus-within:ring-0',
                isSelected && 'bg-blue-50 hover:bg-blue-100',
                isSelected && disabled && 'bg-gray-100'
              )}
              role="option"
              aria-selected={isSelected}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
            >
              <Checkbox
                id={optionId}
                checked={isSelected}
                onCheckedChange={() => handleOptionToggle(option.value)}
                disabled={disabled}
                aria-describedby={`${optionId}-label`}
              />
              <Label
                id={`${optionId}-label`}
                htmlFor={optionId}
                className={cn(
                  'text-sm font-normal cursor-pointer flex-1 select-none',
                  disabled && 'cursor-not-allowed opacity-50',
                  'transition-colors duration-200'
                )}
              >
                {option.label}
              </Label>
            </div>
          )
        })
      )}
    </div>
  )
}