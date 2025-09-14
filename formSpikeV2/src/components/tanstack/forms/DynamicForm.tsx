import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-form'
import { jsonLogic } from '../utils/jsonLogicExtensions'
import { Button } from '@/components/ui/button'
import { DynamicField } from './DynamicField'
import { useRef } from 'react'
// Removed createFormSchema import as validation file doesn't exist
import type { FormConfig } from '../types/form'

type DynamicFormProps = {
  config: FormConfig
}

export function DynamicForm({ config }: DynamicFormProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`[performace][tanstack]TanStack Form re-render count: ${renderCount.current}`);

  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      // Filter out hidden fields before validation and submission
      const currentFormValues = form.state.values
      const visibleFieldValues: Record<string, any> = {}

      config.fields.forEach(field => {
        // Check if field is currently visible
        const isVisible = field.conditions
          ? jsonLogic.apply(field.conditions, currentFormValues)
          : true

        if (isVisible && value[field.name] !== undefined) {
          visibleFieldValues[field.name] = value[field.name]
        }
      })

      // Validate all visible fields before submission
      const hasErrors = Object.keys(form.state.fieldMeta).some(fieldName => {
        const fieldMeta = form.state.fieldMeta[fieldName]
        return fieldMeta && !fieldMeta.isValid && fieldMeta.isTouched
      })

      if (hasErrors) {
        console.log('Form has validation errors, preventing submission')
        return
      }

      if (config.onSubmit) {
        await config.onSubmit({ value: visibleFieldValues })
      }
    }
  })

  return (
    <div className="space-y-6">
      {config.title && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          {config.description && (
            <p className="mt-2 text-gray-600">{config.description}</p>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {config.fields.map((field) => (
          <DynamicField key={field.name} field={field} form={form} />
        ))}

        <div className="flex gap-4">
          <Button type="submit" disabled={form.state.isSubmitting || !form.state.canSubmit}>
            {form.state.isSubmitting ? 'Submitting...' : (config.submitButtonText || 'Submit')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            {config.resetButtonText || 'Reset'}
          </Button>
        </div>

        {/* Debug information */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="space-y-1">
            <div>Form Values: {JSON.stringify(form.state.values, null, 2)}</div>
            <div>Form Errors: {JSON.stringify(form.state.errors, null, 2)}</div>
            <div>Can Submit: {form.state.canSubmit ? 'Yes' : 'No'}</div>
            <div>Is Valid: {form.state.isValid ? 'Yes' : 'No'}</div>
            <div>Is Submitting: {form.state.isSubmitting ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </form>
    </div>
  )
}