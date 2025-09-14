import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { DynamicField } from './DynamicField'
import type { FormConfig } from '../types/form'

type DynamicFormProps = {
  config: FormConfig
}

export function DynamicForm({ config }: DynamicFormProps) {
  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      if (config.onSubmit) {
        await config.onSubmit({ value })
      }
    },
    validators: config.fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = {
          onChange: ({ value }: any) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              return `${field.label} is required`
            }
            return undefined
          }
        }
      }
      return acc
    }, {} as any)
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