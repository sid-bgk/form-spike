import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as jsonLogic from 'json-logic-js'
import { Button } from '@/components/ui/button'
import { DynamicField } from './DynamicField'
import type { FormConfig } from '../types/form'
import { createFormSchema } from '../utils/ValidationConfigParser'

type DynamicFormProps = {
  config: FormConfig
}

export function DynamicForm({ config }: DynamicFormProps) {
  const form = useForm({
    defaultValues: config.defaultValues,
    mode: 'onChange',
  })

  const { handleSubmit, reset, formState, watch } = form
  const { isSubmitting, errors, isValid } = formState

  // Watch all form values for conditional logic
  const watchedValues = watch()

  // Extract clean form values for display
  const getCleanFormValues = () => {
    const cleanValues: Record<string, any> = {}
    config.fields.forEach(field => {
      const value = watchedValues[field.name]
      if (value !== undefined) {
        cleanValues[field.name] = value
      }
    })
    return cleanValues
  }

  // Extract clean error messages for display
  const getCleanErrors = () => {
    const cleanErrors: Record<string, string> = {}
    Object.entries(errors).forEach(([key, error]) => {
      if (error && typeof error === 'object' && 'message' in error) {
        cleanErrors[key] = error.message as string
      }
    })
    return cleanErrors
  }

  const onSubmit = async (data: Record<string, any>) => {
    console.log('[React Hook Form] onSubmit called with data:', data)

    // Perform manual validation for visible fields only
    const visibleFieldValues: Record<string, any> = {}
    let hasValidationErrors = false

    config.fields.forEach(field => {
      // Check if field is currently visible
      const isVisible = field.conditions
        ? jsonLogic.apply(field.conditions, watchedValues)
        : true

      console.log(`[React Hook Form] Field ${field.name}: visible=${isVisible}, value=`, data[field.name])

      if (isVisible) {
        const fieldValue = data[field.name]
        visibleFieldValues[field.name] = fieldValue

        // Validate visible fields
        if (field.validation) {
          const validation = field.validation

          // Required validation
          if (validation.required) {
            const isEmpty = fieldValue === undefined || fieldValue === '' ||
                           (Array.isArray(fieldValue) && fieldValue.length === 0) ||
                           (field.type === 'checkbox' && fieldValue !== true)

            if (isEmpty) {
              const message = typeof validation.required === 'string'
                ? validation.required
                : `${field.label} is required`
              form.setError(field.name, { type: 'required', message })
              hasValidationErrors = true
            }
          }

          // String length validations
          if (typeof fieldValue === 'string') {
            if (validation.minLength) {
              const minLength = typeof validation.minLength === 'object'
                ? validation.minLength.value
                : validation.minLength
              if (fieldValue.length < minLength) {
                const message = typeof validation.minLength === 'object'
                  ? validation.minLength.message
                  : `${field.label} must be at least ${minLength} characters`
                form.setError(field.name, { type: 'minLength', message })
                hasValidationErrors = true
              }
            }

            if (validation.maxLength) {
              const maxLength = typeof validation.maxLength === 'object'
                ? validation.maxLength.value
                : validation.maxLength
              if (fieldValue.length > maxLength) {
                const message = typeof validation.maxLength === 'object'
                  ? validation.maxLength.message
                  : `${field.label} must be no more than ${maxLength} characters`
                form.setError(field.name, { type: 'maxLength', message })
                hasValidationErrors = true
              }
            }
          }

          // Number validations
          if (field.type === 'number' && fieldValue !== '') {
            const numValue = Number(fieldValue)
            if (validation.min) {
              const min = typeof validation.min === 'object' ? validation.min.value : validation.min
              if (numValue < min) {
                const message = typeof validation.min === 'object'
                  ? validation.min.message
                  : `${field.label} must be at least ${min}`
                form.setError(field.name, { type: 'min', message })
                hasValidationErrors = true
              }
            }

            if (validation.max) {
              const max = typeof validation.max === 'object' ? validation.max.value : validation.max
              if (numValue > max) {
                const message = typeof validation.max === 'object'
                  ? validation.max.message
                  : `${field.label} must be no more than ${max}`
                form.setError(field.name, { type: 'max', message })
                hasValidationErrors = true
              }
            }
          }

          // Array validations
          if (field.type === 'array' && Array.isArray(fieldValue)) {
            if (validation.minItems && fieldValue.length < validation.minItems.value) {
              form.setError(field.name, {
                type: 'minItems',
                message: validation.minItems.message
              })
              hasValidationErrors = true
            }

            if (validation.maxItems && fieldValue.length > validation.maxItems.value) {
              form.setError(field.name, {
                type: 'maxItems',
                message: validation.maxItems.message
              })
              hasValidationErrors = true
            }

            // Validate individual array item fields
            if (field.arrayItemFields && fieldValue.length > 0) {
              fieldValue.forEach((item: any, index: number) => {
                field.arrayItemFields?.forEach(itemField => {
                  const itemFieldPath = `${field.name}.${index}.${itemField.name}`
                  const itemValue = item?.[itemField.name]

                  if (itemField.validation) {
                    const itemValidation = itemField.validation

                    // Required validation for array item fields
                    if (itemValidation.required) {
                      const isEmpty = itemValue === undefined || itemValue === '' ||
                                     (itemField.type === 'checkbox' && itemValue !== true)

                      if (isEmpty) {
                        const message = typeof itemValidation.required === 'string'
                          ? itemValidation.required
                          : `${itemField.label} is required`
                        form.setError(itemFieldPath, { type: 'required', message })
                        hasValidationErrors = true
                      }
                    }

                    // String length validations for array item fields
                    if (typeof itemValue === 'string') {
                      if (itemValidation.minLength) {
                        const minLength = typeof itemValidation.minLength === 'object'
                          ? itemValidation.minLength.value
                          : itemValidation.minLength
                        if (itemValue.length < minLength) {
                          const message = typeof itemValidation.minLength === 'object'
                            ? itemValidation.minLength.message
                            : `${itemField.label} must be at least ${minLength} characters`
                          form.setError(itemFieldPath, { type: 'minLength', message })
                          hasValidationErrors = true
                        }
                      }

                      if (itemValidation.maxLength) {
                        const maxLength = typeof itemValidation.maxLength === 'object'
                          ? itemValidation.maxLength.value
                          : itemValidation.maxLength
                        if (itemValue.length > maxLength) {
                          const message = typeof itemValidation.maxLength === 'object'
                            ? itemValidation.maxLength.message
                            : `${itemField.label} must be no more than ${maxLength} characters`
                          form.setError(itemFieldPath, { type: 'maxLength', message })
                          hasValidationErrors = true
                        }
                      }
                    }

                    // Number validations for array item fields
                    if (itemField.type === 'number' && itemValue !== '') {
                      const numValue = Number(itemValue)
                      if (itemValidation.min) {
                        const min = typeof itemValidation.min === 'object' ? itemValidation.min.value : itemValidation.min
                        if (numValue < min) {
                          const message = typeof itemValidation.min === 'object'
                            ? itemValidation.min.message
                            : `${itemField.label} must be at least ${min}`
                          form.setError(itemFieldPath, { type: 'min', message })
                          hasValidationErrors = true
                        }
                      }

                      if (itemValidation.max) {
                        const max = typeof itemValidation.max === 'object' ? itemValidation.max.value : itemValidation.max
                        if (numValue > max) {
                          const message = typeof itemValidation.max === 'object'
                            ? itemValidation.max.message
                            : `${itemField.label} must be no more than ${max}`
                          form.setError(itemFieldPath, { type: 'max', message })
                          hasValidationErrors = true
                        }
                      }
                    }
                  }
                })
              })
            }
          }
        }
      } else {
        // Clear errors for hidden fields
        form.clearErrors(field.name)
      }
    })

    // If there are validation errors, don't submit
    if (hasValidationErrors) {
      console.log('[React Hook Form] Validation errors found, not submitting')
      return
    }

    console.log('[React Hook Form] Validation passed, submitting visible fields:', visibleFieldValues)

    if (config.onSubmit) {
      console.log('[React Hook Form] Submitting data:', visibleFieldValues)
      await config.onSubmit({ value: visibleFieldValues })
    }
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {config.title && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
            {config.description && (
              <p className="mt-2 text-gray-600">{config.description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {config.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              form={form}
              watchedValues={watchedValues}
            />
          ))}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (config.submitButtonText || 'Submit')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            {config.resetButtonText || 'Reset'}
          </Button>
        </div>

        {/* Debug information */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="space-y-1">
            <div>Form Values: {JSON.stringify(getCleanFormValues(), null, 2)}</div>
            <div>Form Errors: {JSON.stringify(getCleanErrors(), null, 2)}</div>
            <div>Is Valid: {isValid ? 'Yes' : 'No'}</div>
            <div>Is Submitting: {isSubmitting ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </form>
      </div>
    </FormProvider>
  )
}