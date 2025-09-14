import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export function CalendarTest() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Calendar Component Test</h2>
      
      {/* Basic Calendar */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Calendar</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-sm text-gray-600">
          Selected date: {date ? format(date, 'PPP') : 'None'}
        </p>
      </div>

      {/* Calendar with Popover */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Calendar with Popover</h3>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                setOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar with Date Constraints */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Calendar with Date Constraints</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => 
            date > new Date() || date < new Date('1900-01-01')
          }
          className="rounded-md border"
        />
        <p className="text-sm text-gray-600">
          Disabled: Future dates and dates before 1900
        </p>
      </div>
    </div>
  )
}