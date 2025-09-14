import { useForm } from '@tanstack/react-form'
import { DynamicField } from '../forms/DynamicField'
import type { FieldConfig } from '../types/form'

export function MultiSelectIntegrationTest() {
  const form = useForm({
    defaultValues: {
      sourceOfIncome: []
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    }
  })

  const multiSelectField: FieldConfig = {
    name: 'sourceOfIncome',
    type: 'multi',
    label: 'Source of Income',
    required: true,
    description: 'Select all sources of income that apply to you',
    options: [
      { value: 'salary_or_wages', label: 'Salary or Wages' },
      { value: 'business_owner_or_self_employed', label: 'Business Owner or Self Employed' },
      { value: 'other_sources', label: 'Other Sources' },
      { value: 'investment_income', label: 'Investment Income' },
      { value: 'rental_income', label: 'Rental Income' }
    ],
    validation: {
      required: 'Please select at least one source of income',
      minItems: { value: 1, message: 'Please select at least one source of income' }
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Multi-Select Field Integration Test</h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="space-y-4">
          <DynamicField field={multiSelectField} form={form} />
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => form.reset()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Form Values:</h3>
        <pre className="text-sm">
          {JSON.stringify(form.state.values, null, 2)}
        </pre>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Form State:</h3>
        <p className="text-sm">
          Valid: {form.state.isValid ? 'Yes' : 'No'}
        </p>
        <p className="text-sm">
          Touched: {form.state.isTouched ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  )
}