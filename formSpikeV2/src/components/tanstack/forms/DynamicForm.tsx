import { useForm } from '@tanstack/react-form'
import type { DynamicFormProps } from '../types/form'
import { DynamicField } from './DynamicField'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function DynamicForm<TFormData = Record<string, any>>({ config, className }: DynamicFormProps<TFormData>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        await config.onSubmit({ value })

        setSubmitSuccess(true)
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleReset = () => {
    form.reset()
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {config.title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
          {config.description && (
            <p className="text-muted-foreground mt-2">{config.description}</p>
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
        {config.fields.map((fieldConfig) => (
          <form.Field
            key={fieldConfig.name}
            name={fieldConfig.name as any}
            validators={fieldConfig.validators}
          >
            {(field) => (
              <DynamicField field={field} config={fieldConfig} />
            )}
          </form.Field>
        ))}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {submitError}
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-sm text-green-700">
              <strong>Success:</strong> Form submitted successfully!
            </div>
          </div>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, formIsSubmitting]) => (
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || formIsSubmitting}
                className="flex-1"
              >
                {isSubmitting || formIsSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  config.submitButtonText || 'Submit'
                )}
              </Button>

              {config.resetButtonText && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting || formIsSubmitting}
                >
                  {config.resetButtonText}
                </Button>
              )}
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}