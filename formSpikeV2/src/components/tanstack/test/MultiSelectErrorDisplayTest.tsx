import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicField } from '../forms/DynamicField'
import type { FieldConfig } from '../types/form'

export function MultiSelectErrorDisplayTest() {
  const [testResults, setTestResults] = useState<string[]>([])

  const form = useForm({
    defaultValues: {
      requiredMultiSelect: [],
      minItemsMultiSelect: [],
      maxItemsMultiSelect: [],
      combinedValidationMultiSelect: [],
      // Comparison fields to ensure error display consistency
      requiredText: '',
      requiredEmail: ''
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    }
  })

  const testFields: FieldConfig[] = [
    // Multi-select fields with different validation scenarios
    {
      name: 'requiredMultiSelect',
      label: 'Required Multi-Select',
      type: 'multi',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      validation: {
        required: 'This multi-select field is required'
      },
      description: 'Required field - should show error when empty and touched'
    },
    {
      name: 'minItemsMultiSelect',
      label: 'Min Items Multi-Select',
      type: 'multi',
      options: [
        { value: 'skill1', label: 'JavaScript' },
        { value: 'skill2', label: 'TypeScript' },
        { value: 'skill3', label: 'React' },
        { value: 'skill4', label: 'Node.js' }
      ],
      validation: {
        minItems: { value: 2, message: 'Please select at least 2 skills' }
      },
      description: 'Min 2 items - should show error when less than 2 selected'
    },
    {
      name: 'maxItemsMultiSelect',
      label: 'Max Items Multi-Select',
      type: 'multi',
      options: [
        { value: 'hobby1', label: 'Reading' },
        { value: 'hobby2', label: 'Sports' },
        { value: 'hobby3', label: 'Music' },
        { value: 'hobby4', label: 'Travel' },
        { value: 'hobby5', label: 'Cooking' }
      ],
      validation: {
        maxItems: { value: 3, message: 'Please select no more than 3 hobbies' }
      },
      description: 'Max 3 items - should show error when more than 3 selected'
    },
    {
      name: 'combinedValidationMultiSelect',
      label: 'Combined Validation Multi-Select',
      type: 'multi',
      options: [
        { value: 'source1', label: 'Salary' },
        { value: 'source2', label: 'Business' },
        { value: 'source3', label: 'Investment' },
        { value: 'source4', label: 'Rental' },
        { value: 'source5', label: 'Other' }
      ],
      validation: {
        required: 'Income source is required',
        minItems: { value: 1, message: 'Select at least 1 income source' },
        maxItems: { value: 3, message: 'Select at most 3 income sources' }
      },
      description: 'Required + min 1 + max 3 - should show appropriate error based on state'
    },
    // Comparison fields to ensure error display consistency
    {
      name: 'requiredText',
      label: 'Required Text Field',
      type: 'text',
      validation: {
        required: 'This text field is required'
      },
      description: 'For comparison - text field error display'
    },
    {
      name: 'requiredEmail',
      label: 'Required Email Field',
      type: 'email',
      validation: {
        required: 'Email is required',
        email: 'Please enter a valid email address'
      },
      description: 'For comparison - email field error display'
    }
  ]

  const runErrorDisplayTests = () => {
    const results: string[] = []

    // Test 1: Check if multi-select errors display when field is touched
    const requiredMultiSelectState = form.getFieldInfo('requiredMultiSelect')
    if (requiredMultiSelectState?.meta.isTouched && !requiredMultiSelectState?.meta.isValid) {
      results.push('✓ Required multi-select shows error when touched and empty')
    } else {
      results.push('✗ Required multi-select error display issue')
    }

    // Test 2: Check error message format consistency
    const textFieldState = form.getFieldInfo('requiredText')
    const multiSelectFieldState = form.getFieldInfo('requiredMultiSelect')
    
    if (textFieldState?.meta.errors && multiSelectFieldState?.meta.errors) {
      const textErrorFormat = typeof textFieldState.meta.errors[0]
      const multiSelectErrorFormat = typeof multiSelectFieldState.meta.errors[0]
      
      if (textErrorFormat === multiSelectErrorFormat) {
        results.push('✓ Error message format is consistent between field types')
      } else {
        results.push('✗ Error message format inconsistency detected')
      }
    }

    // Test 3: Check if errors clear when validation passes
    const currentValue = form.getFieldValue('requiredMultiSelect')
    if (Array.isArray(currentValue) && currentValue.length > 0) {
      if (requiredMultiSelectState?.meta.isValid) {
        results.push('✓ Errors clear when multi-select validation passes')
      } else {
        results.push('✗ Errors not clearing when validation passes')
      }
    }

    setTestResults(results)
  }

  const triggerAllFieldValidation = () => {
    // Touch all fields to trigger validation display
    testFields.forEach(field => {
      try {
        form.validateField(field.name, 'change')
      } catch (error) {
        // If validateField doesn't exist, we'll trigger validation by setting values
        const currentValue = form.getFieldValue(field.name)
        form.setFieldValue(field.name, currentValue)
      }
    })
    
    // Run tests after a short delay to ensure state updates
    setTimeout(runErrorDisplayTests, 100)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Select Error Display Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test error display and validation feedback for multi-select fields to ensure consistency with other field types.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {testFields.map((field) => (
              <DynamicField key={field.name} field={field} form={form} />
            ))}

            <div className="flex gap-4 pt-4">
              <Button type="button" onClick={triggerAllFieldValidation}>
                Trigger Validation Test
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset Form
              </Button>
            </div>
          </form>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">Test Results:</h3>
              <ul className="text-sm space-y-1">
                {testResults.map((result, index) => (
                  <li key={index} className={result.startsWith('✓') ? 'text-green-700' : 'text-red-700'}>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Manual Testing Instructions */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">Manual Testing Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-2">
              <li>1. <strong>Required Multi-Select:</strong> Click on the field area, then click elsewhere without selecting anything. Error should appear.</li>
              <li>2. <strong>Min Items:</strong> Select 1 item, error should appear. Select 2+ items, error should disappear.</li>
              <li>3. <strong>Max Items:</strong> Select 4+ items, error should appear. Reduce to 3 or fewer, error should disappear.</li>
              <li>4. <strong>Combined Validation:</strong> Test empty (required error), 1 item (should pass), 4+ items (max error).</li>
              <li>5. <strong>Error Format:</strong> Compare error styling between multi-select and text/email fields - should be identical.</li>
              <li>6. <strong>Error Clearing:</strong> Verify errors disappear immediately when validation passes.</li>
            </ol>
          </div>

          {/* Current Form State for Debugging */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Form State Debug:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-medium mb-1">Values:</h4>
                <pre className="overflow-auto">{JSON.stringify(form.state.values, null, 2)}</pre>
              </div>
              <div>
                <h4 className="font-medium mb-1">Field States:</h4>
                <div className="space-y-2">
                  {testFields.slice(0, 4).map(field => {
                    const fieldInfo = form.getFieldInfo(field.name)
                    return (
                      <div key={field.name} className="text-xs">
                        <strong>{field.name}:</strong>
                        <br />
                        Valid: {fieldInfo?.meta.isValid ? 'Yes' : 'No'}
                        <br />
                        Touched: {fieldInfo?.meta.isTouched ? 'Yes' : 'No'}
                        <br />
                        Errors: {fieldInfo?.meta.errors?.join(', ') || 'None'}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}