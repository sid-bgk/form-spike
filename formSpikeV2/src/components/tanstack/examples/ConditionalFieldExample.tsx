/**
 * Example component demonstrating enhanced conditional field validation
 * This shows how the validation system handles conditional fields properly
 */

import React from 'react'
import { useForm } from '@tanstack/react-form'
import { DynamicField } from '../forms/DynamicField'
import type { FieldConfig } from '../types/form'

const conditionalFieldsConfig: FieldConfig[] = [
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    validation: {
      required: "Age is required",
      min: { value: 1, message: "Age must be at least 1" },
      max: { value: 120, message: "Age must be less than 120" }
    }
  },
  {
    name: "areYouWorking",
    label: "Are you currently working?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    conditions: {
      ">": [{ "var": "age" }, 17]
    },
    validation: {
      required: "Please select your employment status"
    }
  },
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "Enter your company name",
    conditions: {
      "==": [{ "var": "areYouWorking" }, "yes"]
    },
    validation: {
      required: "Company name is required",
      minLength: { value: 2, message: "Company name must be at least 2 characters" }
    }
  },
  {
    name: "jobTitle",
    label: "Job Title",
    type: "text",
    placeholder: "Enter your job title",
    conditions: {
      "==": [{ "var": "areYouWorking" }, "yes"]
    },
    validation: {
      required: "Job title is required",
      minLength: { value: 2, message: "Job title must be at least 2 characters" }
    }
  }
]

export function ConditionalFieldExample() {
  const form = useForm({
    defaultValues: {
      age: '',
      areYouWorking: '',
      companyName: '',
      jobTitle: ''
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value)
      alert('Form submitted! Check console for values.')
    }
  })

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Conditional Field Validation Example</h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {conditionalFieldsConfig.map((field) => (
          <DynamicField key={field.name} field={field} form={form} />
        ))}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!form.state.canSubmit}
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
      </form>

      {/* Debug information */}
      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="space-y-1">
          <div>Form Values: {JSON.stringify(form.state.values, null, 2)}</div>
          <div>Form Errors: {JSON.stringify(form.state.errors, null, 2)}</div>
          <div>Can Submit: {form.state.canSubmit ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded text-sm">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Enter age 16 or less - employment question should be hidden</li>
          <li>Enter age 18 or more - employment question should appear</li>
          <li>Select "No" for employment - company fields should be hidden</li>
          <li>Select "Yes" for employment - company fields should appear and be required</li>
          <li>Try submitting with missing required fields to see validation</li>
          <li>Notice how validation errors are cleared when fields become hidden</li>
        </ol>
      </div>
    </div>
  )
}