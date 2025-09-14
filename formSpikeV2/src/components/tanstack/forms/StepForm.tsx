import { useState, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { jsonLogic } from '../utils/jsonLogicExtensions'
import { Button } from '@/components/ui/button'
import { DynamicField } from './DynamicField'
import { StepIndicator } from './StepIndicator'
import type { StepFormConfig } from '../types/form'

type StepFormProps = {
  config: StepFormConfig
}

export function StepForm({ config }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      // Filter out hidden fields before validation and submission
      const currentFormValues = form.state.values
      const visibleFieldValues: Record<string, any> = {}

      // Get all fields from all steps
      const allFields = config.steps.flatMap(step => step.fields)

      allFields.forEach(field => {
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

  const currentStepConfig = config.steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === config.steps.length - 1

  // Get visible fields for current step
  const visibleFieldsForCurrentStep = useMemo(() => {
    const currentFormValues = form.state.values
    return currentStepConfig.fields.filter(field => {
      return field.conditions
        ? jsonLogic.apply(field.conditions, currentFormValues)
        : true
    })
  }, [currentStepConfig.fields, form.state.values])

  // Validate current step fields
  const validateCurrentStep = async () => {
    const currentFormValues = form.state.values
    let hasErrors = false

    for (const field of visibleFieldsForCurrentStep) {
      // Check if field has errors
      const fieldMeta = form.state.fieldMeta[field.name]
      if (fieldMeta) {
        // Trigger validation for the field if it hasn't been touched
        if (!fieldMeta.isTouched && currentFormValues[field.name] !== undefined) {
          try {
            await form.validateField(field.name, 'change')
          } catch (error) {
            // If validateField doesn't exist, rely on manual validation
            console.log('Manual field validation not available')
          }
        }

        // Check for validation errors after validation
        const updatedFieldMeta = form.state.fieldMeta[field.name]
        if (updatedFieldMeta && !updatedFieldMeta.isValid) {
          hasErrors = true
        }
      }

      // Check if required field is empty
      const isRequired = field.validation?.required || field.required
      const fieldValue = currentFormValues[field.name]

      if (isRequired && (fieldValue === undefined || fieldValue === '' || fieldValue === null)) {
        hasErrors = true
      }
    }

    return !hasErrors
  }

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      setCompletedSteps(prev => new Set(prev).add(currentStep))
      setCurrentStep(prev => Math.min(prev + 1, config.steps.length - 1))
    } else {
      // Mark fields as touched to show validation errors
      visibleFieldsForCurrentStep.forEach(field => {
        try {
          form.setFieldMeta(field.name, prev => ({ ...prev, isTouched: true }))
        } catch (error) {
          console.log('setFieldMeta not available')
        }
        // Force a validation pass so error messages appear immediately
        try {
          if (typeof (form as any).validateField === 'function') {
            ;(form as any).validateField(field.name, 'change')
          } else {
            const current = (form as any).getFieldValue?.(field.name)
            ;(form as any).setFieldValue?.(field.name, current)
          }
        } catch (e) {
          // No-op
        }
      })
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <div className="flex gap-8 max-w-6xl mx-auto p-6">
      {/* Left Side - Step Indicator */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6">
          <StepIndicator
            steps={config.steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="flex-1 space-y-6">
        {config.title && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
            {config.description && (
              <p className="mt-2 text-gray-600">{config.description}</p>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          {/* Current Step Header */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentStepConfig.label}
            </h3>
            <div className="text-sm text-gray-500 mt-1">
              Step {currentStep + 1} of {config.steps.length}
            </div>
          </div>

          {/* Current Step Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {currentStepConfig.fields.map((field) => (
                <DynamicField key={field.name} field={field} form={form} />
              ))}
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={form.state.isSubmitting || !form.state.canSubmit}
                  >
                    {form.state.isSubmitting ? 'Submitting...' : (config.submitButtonText || 'Submit')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                  >
                    Continue
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  {config.resetButtonText || 'Reset'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Debug information */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="space-y-1">
            <div>Current Step: {currentStep} ({currentStepConfig.label})</div>
            <div>Completed Steps: {Array.from(completedSteps).join(', ')}</div>
            <div>Visible Fields: {visibleFieldsForCurrentStep.length}</div>
            <div>Form Values: {JSON.stringify(form.state.values, null, 2)}</div>
            <div>Form Errors: {JSON.stringify(form.state.errors, null, 2)}</div>
            <div>Can Submit: {form.state.canSubmit ? 'Yes' : 'No'}</div>
            <div>Is Valid: {form.state.isValid ? 'Yes' : 'No'}</div>
            <div>Is Submitting: {form.state.isSubmitting ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
