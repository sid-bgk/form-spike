import React, { useState } from 'react'
import { DateField } from '../forms/DateField'
import { validateDateRange, validateAge } from '../utils/dateUtils'
import { createFieldValidator, createDateRangeValidator, createAgeValidator } from '../utils/FieldValidatorFactory'

export function DateValidationTest() {
  const [dateValue, setDateValue] = useState('')
  const [validationResult, setValidationResult] = useState<string>('')

  // Test date constraints (18-150 years old)
  const today = new Date()
  const minDate = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

  // Test validators
  const testValidation = (value: string) => {
    const results: string[] = []

    // Test date range validation
    const dateRangeResult = validateDateRange(value, minDate, maxDate)
    results.push(`Date Range: ${dateRangeResult.isValid ? 'PASS' : 'FAIL - ' + dateRangeResult.error}`)

    // Test age validation
    const ageResult = validateAge(value, 18, 150)
    results.push(`Age Validation: ${ageResult.isValid ? 'PASS' : 'FAIL - ' + ageResult.error}`)

    // Test validator factory
    const dateRangeValidator = createDateRangeValidator(minDate, maxDate)
    const dateRangeFactoryResult = dateRangeValidator(value)
    results.push(`Factory Date Range: ${dateRangeFactoryResult ? 'FAIL - ' + dateRangeFactoryResult : 'PASS'}`)

    const ageValidator = createAgeValidator(18, 150)
    const ageFactoryResult = ageValidator(value)
    results.push(`Factory Age: ${ageFactoryResult ? 'FAIL - ' + ageFactoryResult : 'PASS'}`)

    setValidationResult(results.join('\n'))
  }

  const handleDateChange = (value: string) => {
    setDateValue(value)
    if (value) {
      testValidation(value)
    } else {
      setValidationResult('No date selected')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Date Validation Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date of Birth (18-150 years old)
          </label>
          <DateField
            id="test-date"
            value={dateValue}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Current Value:</label>
          <p className="text-sm bg-gray-100 p-2 rounded">{dateValue || 'None'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Validation Results:</label>
          <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {validationResult || 'Select a date to see validation results'}
          </pre>
        </div>

        <div className="text-xs text-gray-600">
          <p>Min Date: {minDate.toISOString().split('T')[0]}</p>
          <p>Max Date: {maxDate.toISOString().split('T')[0]}</p>
        </div>
      </div>
    </div>
  )
}