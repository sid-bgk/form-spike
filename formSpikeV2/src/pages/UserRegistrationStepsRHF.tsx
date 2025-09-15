import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Check } from 'lucide-react'
import jsonLogic from 'json-logic-js'

// Types for the config structure
type FieldOption = {
  value: string | number
  label: string
}

type FieldConfig = {
  name: string
  type: string
  label: string
  validation?: any
  options?: FieldOption[]
  conditions?: any
  placeholder?: string
  defaultValue?: any
  otherProps?: any
}

type StepConfig = {
  id: string
  label: string
  fields: FieldConfig[]
  conditions?: any
}

type FormConfig = {
  title?: string
  description?: string
  steps: StepConfig[]
  submitButtonText?: string
  resetButtonText?: string
}

type ApiResponse = {
  version: number
  form: FormConfig
  validationPatterns?: Record<string, any>
}

// Helper function to evaluate conditions using json-logic
const evaluateCondition = (condition: any, formData: any): boolean => {
  if (!condition) return true
  try {
    return jsonLogic.apply(condition, formData)
  } catch (error) {
    console.warn('Error evaluating condition:', error)
    return true
  }
}

// Step Indicator Component (matching TanStack styling)
const StepIndicator = ({
  steps,
  currentStep,
  completedSteps
}: {
  steps: StepConfig[]
  currentStep: number
  completedSteps: Set<number>
}) => {
  return (
    <div className="relative">
      {/* Progress Line Background */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

      {/* Steps */}
      <div className="relative space-y-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentStep
          const isActive = isCompleted || isCurrent

          return (
            <div key={step.id} className="flex items-center space-x-4">
              {/* Step Circle */}
              <div className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                ${isCompleted
                  ? 'bg-green-500 text-white shadow-lg'
                  : isCurrent
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className={`
                  text-sm font-medium transition-colors duration-200
                  ${isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                  }
                `}>
                  {step.label}
                </div>

                {/* Step Description/Status */}
                <div className="text-xs text-gray-400 mt-1">
                  {isCompleted
                    ? 'Completed'
                    : isCurrent
                    ? 'In Progress'
                    : 'Pending'
                  }
                </div>
              </div>

              {/* Progress Line Segment */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute left-4 w-0.5 h-8 transition-colors duration-200
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `}
                style={{
                  top: `${(index + 1) * 2}rem`,
                  marginTop: '1rem'
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Field component that renders different input types
const FormField = ({ field, control, errors, formData }: {
  field: FieldConfig
  control: any
  errors: any
  formData: any
}) => {
  // Check if field should be shown based on conditions
  if (field.conditions && !evaluateCondition(field.conditions, formData)) {
    return null
  }

  const error = errors[field.name]

  // Map TanStack field types to HTML input types
  const getInputType = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'password':
        return fieldType
      case 'date':
        return 'date'
      default:
        return 'text'
    }
  }

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                id={field.name}
                type={getInputType(field.type)}
                placeholder={field.placeholder}
                {...field.otherProps}
              />
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )

    case 'date':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                id={field.name}
                type="date"
                {...field.otherProps}
              />
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )

    case 'select':
    case 'dropdown': // TanStack uses 'dropdown' instead of 'select'
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <Select onValueChange={fieldProps.onChange} value={fieldProps.value}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )

    case 'multi': // TanStack multi-select (for now, treat as single select)
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <Select onValueChange={fieldProps.onChange} value={fieldProps.value}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )

    case 'hidden':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.validation}
          defaultValue={field.defaultValue || ''}
          render={({ field: fieldProps }) => (
            <input
              {...fieldProps}
              type="hidden"
              id={field.name}
            />
          )}
        />
      )

    case 'radio':
      return (
        <div className="space-y-3">
          <Label>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <RadioGroup
                onValueChange={fieldProps.onChange}
                value={fieldProps.value}
                className="flex flex-col space-y-2"
              >
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`${field.name}-${option.value}`} />
                    <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )

    case 'label':
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{field.label}</h3>
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue || ''}
            render={({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                id={field.name}
                placeholder={field.placeholder}
              />
            )}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
      )
  }
}

export function UserRegistrationStepsRHF() {
  const [config, setConfig] = useState<FormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {}
  })

  // Watch all form values to handle conditional fields
  const formData = useWatch({ control })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:3001/api/config/react-hook-form/user-registration-steps')
        const apiResponse = response.data

        if (!apiResponse || !apiResponse.form || !apiResponse.form.steps) {
          throw new Error('Invalid API response structure: missing steps')
        }

        console.log('API Response:', apiResponse)
        setConfig(apiResponse.form)
      } catch (err) {
        console.error('Error fetching form config:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const onSubmit = async (data: any) => {
    console.log('Form submitted with values:', data)
    alert('User registration submitted successfully!')
  }

  // Filter visible steps based on conditions
  const getVisibleSteps = () => {
    if (!config) return []
    return config.steps.filter(step => {
      // Check step-level conditions
      if (step.conditions) {
        // Handle array of conditions (normalize to single condition)
        const normalizedConditions = Array.isArray(step.conditions)
          ? (step.conditions.length === 1 ? step.conditions[0] : { and: step.conditions })
          : step.conditions

        return evaluateCondition(normalizedConditions, formData)
      }
      return true
    })
  }

  const visibleSteps = getVisibleSteps()

  // Ensure current step is within visible steps bounds and handle step visibility changes
  const adjustedCurrentStep = useMemo(() => {
    if (visibleSteps.length === 0) return 0

    // If current step is beyond visible steps, go to last visible step
    if (currentStep >= visibleSteps.length) {
      return visibleSteps.length - 1
    }

    return currentStep
  }, [currentStep, visibleSteps.length])

  // Auto-navigate when current step becomes invisible
  useEffect(() => {
    if (visibleSteps.length > 0 && adjustedCurrentStep !== currentStep) {
      setCurrentStep(adjustedCurrentStep)
    }
  }, [adjustedCurrentStep, currentStep, visibleSteps.length])

  const currentStepConfig = visibleSteps[adjustedCurrentStep]
  const isFirstStep = adjustedCurrentStep === 0
  const isLastStep = adjustedCurrentStep === visibleSteps.length - 1

  // Get visible fields for current step
  const visibleFieldsForCurrentStep = currentStepConfig
    ? currentStepConfig.fields.filter(field =>
        !field.conditions || evaluateCondition(field.conditions, formData)
      )
    : []

  const handleNextStep = async () => {
    if (!currentStepConfig) return

    const currentStepFields = visibleFieldsForCurrentStep
      .map(field => field.name)
      .filter(name => name) // Remove empty names (like label fields)

    const isStepValid = await trigger(currentStepFields)

    if (isStepValid && currentStep < visibleSteps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(adjustedCurrentStep))
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    reset()
    setCurrentStep(0)
    setCompletedSteps(new Set())
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Form</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!config || !currentStepConfig) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-600">No form configuration available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-8 max-w-6xl mx-auto p-6">
      {/* Left Side - Step Indicator */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6">
          <StepIndicator
            steps={visibleSteps}
            currentStep={adjustedCurrentStep}
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
          {visibleSteps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No steps are currently available based on your selections.</p>
            </div>
          ) : currentStepConfig ? (
            <>
              {/* Current Step Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentStepConfig.label}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  Step {adjustedCurrentStep + 1} of {visibleSteps.length}
                </div>
              </div>

              {/* Current Step Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {currentStepConfig.fields.map((field) => (
                    <FormField
                      key={field.name}
                      field={field}
                      control={control}
                      errors={errors}
                      formData={formData}
                    />
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : (config.submitButtonText || 'Submit')}
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
                      onClick={handleReset}
                    >
                      {config.resetButtonText || 'Reset'}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading step...</p>
            </div>
          )}
        </div>

        {/* Debug information */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="space-y-1">
            <div>Total Steps: {config.steps.length}</div>
            <div>Visible Steps: {visibleSteps.length} ({visibleSteps.map(s => s.label).join(', ')})</div>
            <div>Current Step: {adjustedCurrentStep} ({currentStepConfig?.label || 'None'})</div>
            <div>Completed Steps: {Array.from(completedSteps).join(', ')}</div>
            <div>Visible Fields: {visibleFieldsForCurrentStep.length}</div>
            <div>Form Values: {JSON.stringify(getValues(), null, 2)}</div>
            <div>Form Errors: {JSON.stringify(errors, null, 2)}</div>
            <div>Is Submitting: {isSubmitting ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}