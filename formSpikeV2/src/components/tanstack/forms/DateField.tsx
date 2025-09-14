import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatDateForInput, validateDateRange } from '../utils/dateUtils'

interface DateFieldProps {
  id: string
  value: string | undefined
  onChange: (value: string) => void
  disabled?: boolean
  minDate?: string | Date
  maxDate?: string | Date
  className?: string
  onValidationChange?: (isValid: boolean, error?: string) => void
}

export function DateField({
  id,
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  className,
  onValidationChange
}: DateFieldProps) {
  const [open, setOpen] = useState(false)

  // Convert string value to Date object for calendar
  const selectedDate = value ? new Date(value) : undefined

  // Convert min/max dates to Date objects for calendar constraints
  const minDateObj = minDate ? (minDate instanceof Date ? minDate : new Date(minDate)) : undefined
  const maxDateObj = maxDate ? (maxDate instanceof Date ? maxDate : new Date(maxDate)) : undefined

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD for HTML5 date input compatibility
      const formattedDate = formatDateForInput(date)
      onChange(formattedDate)
      
      // Validate the selected date
      if (onValidationChange) {
        const validation = validateDateRange(formattedDate, minDate, maxDate)
        onValidationChange(validation.isValid, validation.error)
      }
    } else {
      onChange('')
      if (onValidationChange) {
        onValidationChange(true) // Empty value is valid (required validation is handled separately)
      }
    }
    setOpen(false)
  }

  // Handle direct input change (for manual typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    onChange(dateValue)
    
    // Validate the input date
    if (onValidationChange) {
      if (!dateValue) {
        onValidationChange(true) // Empty value is valid (required validation is handled separately)
      } else {
        const validation = validateDateRange(dateValue, minDate, maxDate)
        onValidationChange(validation.isValid, validation.error)
      }
    }
  }

  // Check if a date should be disabled in the calendar
  const isDateDisabled = (date: Date) => {
    if (minDateObj && date < minDateObj) return true
    if (maxDateObj && date > maxDateObj) return true
    return false
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {/* HTML5 date input for direct typing and mobile compatibility */}
      <Input
        id={id}
        type="date"
        value={value || ''}
        onChange={handleInputChange}
        disabled={disabled}
        min={minDate ? formatDateForInput(minDate) : undefined}
        max={maxDate ? formatDateForInput(maxDate) : undefined}
        className="flex-1"
      />

      {/* Calendar picker button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={disabled}
            className={cn(
              'shrink-0',
              !value && 'text-muted-foreground'
            )}
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}