import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-form'
import * as jsonLogic from 'json-logic-js'
import { Button } from '@/components/ui/button'
import { DynamicField } from './DynamicField'
// Removed createFormSchema import as validation file doesn't exist
import type { FormConfig } from '../types/form'

type DynamicFormProps = {
  config: FormConfig
}

export function DynamicForm({ config }: DynamicFormProps) {
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
          <Button type="submit" disabled={form.state.isSubmitting}>
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
      </form>
    </div>
  )
}