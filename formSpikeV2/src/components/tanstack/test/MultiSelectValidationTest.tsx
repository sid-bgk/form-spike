import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicField } from '../forms/DynamicField'
import type { FieldConfig } from '../types/form'

export function MultiSelectValidationTest() {
  const [submittedData, setSubmittedData] = useState<any>(null)

  // Test field configurations for multi-select validation
  const testFields: FieldConfig[] = [
    {
      name: 'sourceOfIncome',
      label: 'Source of Income',
      type: 'multi',
      options: [
        { value: 'salary_or_wages', label: 'Salary or Wages' },
        { value: 'business_owner_or_self_employed', label: 'Business Owner or Self Employed' },
        { value: 'other_sources', label: 'Other Sources' },
        { value: 'investment_income', label: 'Investment Income' },
        { value: 'retirement_benefits', label: 'Retirement Benefits' }
      ],
      validation: {
        required: 'Please select at least one source of income',
        minItems: { value: 1, message: 'You must select at least 1 income source' },
        maxItems: { value: 3, message: 'You can select at most 3 income sources' }
      },
      description: 'Select 1-3 sources of income (required field with min/max validation)'
    },
    {
      name: 'hobbies',
      label: 'Hobbies',
      type: 'multi',
      options: [
        { value: 'reading', label: 'Reading' },
        { value: 'sports', label: 'Sports' },
        { value: 'music', label: 'Music' },
        { value: 'travel', label: 'Travel' },
        { value: 'cooking', label: 'Cooking' },
        { value: 'gaming', label: 'Gaming' }
      ],
      validation: {
        maxItems: { value: 4, message: 'Please select no more than 4 hobbies' }
      },
      description: 'Optional field with max 4 selections'
    },
    {
      name: 'skills',
      label: 'Professional Skills',
      type: 'multi',
      options: [
        { value: 'programming', label: 'Programming' },
        { value: 'design', label: 'Design' },
        { value: 'management', label: 'Management' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' }
      ],
      validation: {
        required: 'Please select your professional skills',
        minItems: { value: 2, message: 'Please select at least 2 skills' }
      },
      description: 'Required field with minimum 2 selections'
    }
  ]

  const form = useForm({
    defaultValues: {
      sourceOfIncome: [],
      hobbies: [],
      skills: []
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      setSubmittedData(value)
    }
  })

  const handleReset = () => {
    form.reset()
    setSubmittedData(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Select Field Validation Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test various validation scenarios for multi-select fields including required, minItems, and maxItems validation.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {testFields.map((field) => (
              <DynamicField key={field.name} field={field} form={form} />
            ))}

            <div className="flex gap-4 pt-4">
              <Button type="submit">Submit Form</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
            </div>
          </form>

          {/* Display current form state for debugging */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Form State:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(form.state.values, null, 2)}
            </pre>
          </div>

          {/* Display form errors */}
          {form.state.errors && form.state.errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-red-800">Form Errors:</h3>
              <pre className="text-xs text-red-700 overflow-auto">
                {JSON.stringify(form.state.errors, null, 2)}
              </pre>
            </div>
          )}

          {/* Display submitted data */}
          {submittedData && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-green-800">Submitted Data:</h3>
              <pre className="text-xs text-green-700 overflow-auto">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}

          {/* Validation Test Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Test Scenarios:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Source of Income:</strong> Try submitting without selecting any (required error), select 1 item (should pass), select 4+ items (max error)</li>
              <li>• <strong>Hobbies:</strong> Optional field, try selecting 5+ items (max error)</li>
              <li>• <strong>Professional Skills:</strong> Try submitting with 0 or 1 selection (min error), select 2+ (should pass)</li>
              <li>• <strong>Form Submission:</strong> All validation must pass before form submits successfully</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}