import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikProps } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check } from 'lucide-react';
import { format, subDays, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import jsonLogic from 'json-logic-js';
import axios from 'axios';
import { z } from 'zod';

// API Response Types (matching TanStack version)
type ApiField = {
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: any
  conditions?: any
  grid?: any
  formType?: string
  inputProps?: any
  orientation?: string
  otherProps?: any
  defaultValue?: any
  computeValue?: any
  text?: string
}

type ApiStepConfig = {
  id: string
  label: string
  fields: ApiField[]
  conditions?: any // JSON Logic rule for conditional step visibility
}

type ApiStepResponse = {
  version: number
  form: {
    title?: string
    description?: string
    steps: ApiStepConfig[]
    submitButtonText?: string
    resetButtonText?: string
  }
  validationPatterns?: Record<string, any>
  customValidationRules?: Record<string, { message: string }>
}

// Form configuration interfaces for Formik
interface FormFieldConfig {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  required?: boolean;
  conditions?: any;
  otherProps?: any;
  defaultValue?: any;
  text?: string;
}

interface FormStepConfig {
  id: string;
  label: string;
  fields: FormFieldConfig[];
  conditions?: any;
}

interface FormikStepFormConfig {
  title: string;
  description: string;
  steps: FormStepConfig[];
  validationSchema: z.ZodSchema<any>;
  initialValues: Record<string, any>;
  submitButtonText?: string;
  resetButtonText?: string;
  onSubmit: (values: any) => Promise<void>;
}

interface FormStepperProps {
  config: FormikStepFormConfig;
}

// Step Indicator Component (exactly matching TanStack version)
interface StepIndicatorProps {
  steps: FormStepConfig[];
  currentStep: number;
  completedSteps: Set<number>;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="relative">
      {/* Progress Line Background */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

      {/* Steps */}
      <div className="relative space-y-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;

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
          );
        })}
      </div>
    </div>
  );
};

// Dynamic Field Component (matching TanStack DynamicField structure)
interface DynamicFieldProps {
  field: FormFieldConfig;
  formikProps: FormikProps<any>;
  isVisible: (conditions: any, values: any) => boolean;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, formikProps, isVisible }) => {
  const { values, setFieldValue, errors, touched } = formikProps;
  const { name, label, type, placeholder, description, disabled, options } = field;

  // Determine if field is required
  const isFieldRequired = useMemo(() => {
    return !!field.required;
  }, [field.required]);

  // Check if field should be visible based on conditions
  if (field.conditions && !isVisible(field.conditions, values)) {
    return null;
  }

  // Get field error
  const error = errors[name] as string;
  const isTouched = touched[name] as boolean;

  const renderFieldContent = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={values[name] || ''}
            onChange={(e) => setFieldValue(name, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={values[name] || ''}
            onChange={(e) => setFieldValue(name, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            disabled={disabled}
            value={values[name] || ''}
            onValueChange={(value) => setFieldValue(name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              disabled={disabled}
              checked={values[name] || false}
              onCheckedChange={(checked) => setFieldValue(name, checked)}
            />
            <Label htmlFor={name} className="text-sm font-normal">
              {placeholder || 'Check this option'}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            disabled={disabled}
            value={values[name] || ''}
            onValueChange={(value) => setFieldValue(name, value)}
          >
            {options?.map((option) => (
              <div key={String(option.value)} className="flex items-center space-x-2">
                <RadioGroupItem value={String(option.value)} id={`${name}-${option.value}`} />
                <Label htmlFor={`${name}-${option.value}`} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi':
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <div key={String(option.value)} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={(values[name] as string[])?.includes(String(option.value)) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = values[name] as string[] || [];
                    const newValues = checked
                      ? [...currentValues, String(option.value)]
                      : currentValues.filter(v => v !== String(option.value));
                    setFieldValue(name, newValues);
                  }}
                />
                <Label htmlFor={`${name}-${option.value}`} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full",
                  !values[name] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values[name] ? format(values[name], "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={values[name]}
                onSelect={(date) => setFieldValue(name, date)}
                disabled={disabled}
                fromDate={field.otherProps?.minDate}
                toDate={field.otherProps?.maxDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'label':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold text-gray-800">{field.text || field.label}</h3>
          </div>
        );

      case 'hidden':
        return <Field type="hidden" name={name} />;

      default:
        return null;
    }
  };

  if (type === 'label') {
    return renderFieldContent();
  }

  if (type === 'hidden') {
    return renderFieldContent();
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {isFieldRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {renderFieldContent()}

      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {isTouched && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Main FormStepper Component (matching TanStack StepForm layout)
const FormStepper: React.FC<FormStepperProps> = ({ config }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Function to check if conditions are met using json-logic
  const isVisible = (conditions: any, values: any): boolean => {
    if (!conditions) return true;
    try {
      return jsonLogic.apply(conditions, values);
    } catch (error) {
      console.warn('Error evaluating condition:', error);
      return true;
    }
  };

  // Custom Zod validation function for Formik
  const validateWithZod = (values: any) => {
    try {
      config.validationSchema.parse(values)
      return {}
    } catch (error) {
      console.log('Main Zod validation error:', error)
      if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const path = err.path[0] as string
            errors[path] = err.message
          }
        })
        return errors
      }
      return {}
    }
  }

  // Step-specific validation - only validate visible fields in current step
  const validateCurrentStep = (values: any, currentStepFields: FormFieldConfig[]): Record<string, string> => {
    const stepErrors: Record<string, string> = {}

    // Safety check
    if (!currentStepFields || !Array.isArray(currentStepFields)) {
      console.log('Invalid currentStepFields:', currentStepFields)
      return stepErrors
    }

    // Get only the fields from current step that are visible
    const visibleFieldNames = currentStepFields
      .filter(field => field && isVisible(field.conditions, values))
      .map(field => field.name)
      .filter(name => name) // Remove any undefined names

    console.log('Validating step with visible fields:', visibleFieldNames)

    // Create a partial schema for just the current step's visible fields
    const stepFieldSchemas: Record<string, z.ZodTypeAny> = {}

    currentStepFields.forEach(field => {
      if (!field || !field.name || !isVisible(field.conditions, values) || field.type === 'hidden' || field.type === 'label') {
        return
      }

      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case 'text':
        case 'password':
          fieldSchema = field.required
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional()

          // Add pattern validation for specific fields
          if (field.name.includes('phone') || field.name.includes('Phone')) {
            fieldSchema = fieldSchema.refine(
              (val) => !val || VALIDATION_PATTERNS.PHONE.test(val),
              { message: 'Please enter a valid US phone number' }
            )
          }
          if (field.name.includes('ssn') || field.name.includes('Ssn')) {
            fieldSchema = fieldSchema.refine(
              (val) => !val || VALIDATION_PATTERNS.SSN.test(val),
              { message: 'Please enter a valid 9-digit SSN' }
            )
          }
          if (field.name.includes('zip') || field.name.includes('Zip')) {
            fieldSchema = fieldSchema.refine(
              (val) => !val || VALIDATION_PATTERNS.ZIP.test(val),
              { message: 'Please enter a valid 5-digit ZIP code' }
            )
          }
          break

        case 'email':
          fieldSchema = field.required
            ? z.string().min(1, `${field.label} is required`).email('Please enter a valid email address')
            : z.string().email('Please enter a valid email address').optional().or(z.literal(''))
          break

        case 'date':
          fieldSchema = field.required
            ? z.date({
                required_error: `${field.label} is required`,
                invalid_type_error: 'Please enter a valid date'
              }).refine(
                (date) => {
                  const age = getAge(date)
                  return age >= 18 && age <= 150
                },
                { message: 'Age must be between 18 and 150 years' }
              )
            : z.date().optional()
          break

        case 'select':
        case 'radio':
          fieldSchema = field.required
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional()
          break

        case 'multi':
          fieldSchema = field.required
            ? z.array(z.string()).min(1, `${field.label} is required`)
            : z.array(z.string()).optional()
          break

        default:
          fieldSchema = field.required
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional()
      }

      stepFieldSchemas[field.name] = fieldSchema
    })

    if (Object.keys(stepFieldSchemas).length === 0) {
      return stepErrors
    }

    try {
      const stepSchema = z.object(stepFieldSchemas)

      // Extract only the values for fields in current step
      const stepValues: Record<string, any> = {}
      visibleFieldNames.forEach(fieldName => {
        stepValues[fieldName] = values[fieldName]
      })

      stepSchema.parse(stepValues)
    } catch (error) {
      console.log('Zod validation error:', error)
      if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const path = err.path[0] as string
            stepErrors[path] = err.message
          }
        })
      }
    }

    // Add cross-field validation for joint borrower fields if they're in current step
    if (values.applicationType === 'JOINT') {
      if (visibleFieldNames.includes('jointPhone') && values.jointPhone && values.phone && values.jointPhone === values.phone) {
        stepErrors.jointPhone = 'Joint borrower phone must be different from applicant phone'
      }
      if (visibleFieldNames.includes('jointEmail') && values.jointEmail && values.email && values.jointEmail === values.email) {
        stepErrors.jointEmail = 'Joint borrower email must be different from applicant email'
      }
      if (visibleFieldNames.includes('jointSsn') && values.jointSsn && values.ssn && values.jointSsn === values.ssn) {
        stepErrors.jointSsn = 'Joint borrower SSN must be different from applicant SSN'
      }
    }

    return stepErrors
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Formik
        initialValues={config.initialValues}
        validate={validateWithZod}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await config.onSubmit(values);
          } catch (error) {
            console.error('Submission error:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {(formikProps) => {
          // Get visible steps based on conditions
          const visibleSteps = useMemo(() => {
            return config.steps.filter(step => isVisible(step.conditions, formikProps.values));
          }, [config.steps, formikProps.values]);

          // Ensure current step is within visible steps bounds
          const adjustedCurrentStep = useMemo(() => {
            if (visibleSteps.length === 0) return 0;
            if (currentStep >= visibleSteps.length) {
              return visibleSteps.length - 1;
            }
            return currentStep;
          }, [currentStep, visibleSteps.length]);

          // Auto-navigate when current step becomes invisible
          useEffect(() => {
            if (visibleSteps.length > 0 && adjustedCurrentStep !== currentStep) {
              setCurrentStep(adjustedCurrentStep);
            }
          }, [adjustedCurrentStep, currentStep, visibleSteps.length]);

          const currentStepConfig = visibleSteps[adjustedCurrentStep];
          const isFirstStep = adjustedCurrentStep === 0;
          const isLastStep = adjustedCurrentStep === visibleSteps.length - 1;

          // Get visible fields for current step
          const visibleFieldsForCurrentStep = useMemo(() => {
            if (!currentStepConfig) return [];
            return currentStepConfig.fields.filter(field =>
              isVisible(field.conditions, formikProps.values)
            );
          }, [currentStepConfig?.fields, formikProps.values]);

          const handleNextStep = async () => {
            if (!currentStepConfig || !currentStepConfig.fields) {
              console.log('Invalid step config:', currentStepConfig)
              return;
            }

            try {
              // Validate current step using Zod
              const stepErrors = validateCurrentStep(formikProps.values, currentStepConfig.fields);

              console.log('Step validation results:', stepErrors)

              // Touch all fields in current step to show validation errors
              const touchedFields: Record<string, boolean> = {};
              visibleFieldsForCurrentStep.forEach(field => {
                if (field && field.name) {
                  touchedFields[field.name] = true;
                }
              });
              formikProps.setTouched({ ...formikProps.touched, ...touchedFields });

              // Set errors for current step
              if (Object.keys(stepErrors).length > 0) {
                formikProps.setErrors({ ...formikProps.errors, ...stepErrors });
                return; // Don't proceed if there are validation errors
              }

              // If validation passes, mark step as completed and move to next step
              setCompletedSteps(prev => new Set(prev).add(adjustedCurrentStep));
              setCurrentStep(prev => Math.min(prev + 1, visibleSteps.length - 1));
            } catch (error) {
              console.error('Error in handleNextStep:', error)
            }
          };

          const handlePreviousStep = () => {
            setCurrentStep(prev => Math.max(prev - 1, 0));
          };

          const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            e.stopPropagation();
            formikProps.handleSubmit();
          };

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
                      <Form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          {currentStepConfig.fields.map((field) => (
                            <DynamicField
                              key={field.name}
                              field={field}
                              formikProps={formikProps}
                              isVisible={isVisible}
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
                                disabled={formikProps.isSubmitting}
                              >
                                {formikProps.isSubmitting ? 'Submitting...' : (config.submitButtonText || 'Submit')}
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
                              onClick={() => formikProps.resetForm()}
                            >
                              {config.resetButtonText || 'Reset'}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading step...</p>
                    </div>
                  )}
                </div>

                {/* Debug information (matching TanStack version) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
                    <h3 className="font-semibold mb-2">Debug Information:</h3>
                    <div className="space-y-1">
                      <div>Total Steps: {config.steps.length}</div>
                      <div>Visible Steps: {visibleSteps.length} ({visibleSteps.map(s => s.label).join(', ')})</div>
                      <div>Current Step: {adjustedCurrentStep} ({currentStepConfig?.label || 'None'})</div>
                      <div>Completed Steps: {Array.from(completedSteps).join(', ')}</div>
                      <div>Visible Fields: {visibleFieldsForCurrentStep.length}</div>
                      <div>Form Values: {JSON.stringify(formikProps.values, null, 2)}</div>
                      <div>Form Errors: {JSON.stringify(formikProps.errors, null, 2)}</div>
                      <div>Can Submit: {formikProps.isValid && !formikProps.isSubmitting ? 'Yes' : 'No'}</div>
                      <div>Is Valid: {formikProps.isValid ? 'Yes' : 'No'}</div>
                      <div>Is Submitting: {formikProps.isSubmitting ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

// Helper functions for mapping API response to Formik config
const mapToFieldType = (t: string): string => {
  const aliasMap: Record<string, string> = {
    dropdown: 'select',
    radio: 'radio',
    textarea: 'textarea',
  }
  const normalized = (t || '').toLowerCase()
  if (aliasMap[normalized]) return aliasMap[normalized]
  const allowed: string[] = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio', 'multi', 'date', 'hidden', 'label']
  return allowed.includes(normalized) ? normalized : 'text'
}

const buildPatternMap = (api?: Record<string, any>): Record<string, string> => {
  const DEFAULT_PATTERNS: Record<string, string> = {
    PHONE_VALIDATION_REGEX: '^(\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
    SSN_VALIDATION_REGEX: '^\\d{9}$',
    ZIP_VALIDATION_REGEX: '^\\d{5}$',
  }

  const out: Record<string, string> = { ...DEFAULT_PATTERNS }
  if (!api) return out
  for (const [k, v] of Object.entries(api)) {
    if (typeof v === 'string') out[k] = v
    else if (v && typeof (v as any).source === 'string') out[k] = (v as any).source
  }
  return out
}

const mapApiFieldToFieldConfig = (apiField: ApiField): FormFieldConfig => {
  const normalizedConditions = Array.isArray(apiField.conditions)
    ? (apiField.conditions.length === 1
        ? apiField.conditions[0]
        : { and: apiField.conditions })
    : apiField.conditions

  // Check if field is required from validation object or direct required property
  const isRequired = apiField.required || (apiField.validation && apiField.validation.required)

  console.log(`Mapping field ${apiField.name}: type=${apiField.type}, required=${isRequired}`, apiField)

  return {
    name: apiField.name,
    label: apiField.label,
    type: mapToFieldType(apiField.type),
    required: isRequired,
    placeholder: apiField.placeholder,
    description: apiField.description,
    disabled: apiField.disabled,
    options: apiField.options,
    conditions: normalizedConditions,
    otherProps: apiField.otherProps,
    defaultValue: apiField.defaultValue,
    text: apiField.text,
  }
}

// Validation patterns
const VALIDATION_PATTERNS = {
  PHONE: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  SSN: /^\d{9}$/,
  ZIP: /^\d{5}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// Helper function to calculate age
const getAge = (birthDate: Date): number => {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1
  }
  return age
}

// Conditional validation helper - only validate if field is visible
const conditionalRequired = (message: string, conditions?: any) => {
  return z.string().superRefine((val, ctx) => {
    // If conditions exist, check visibility - this will be handled at form level
    if (!val || val.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message
      })
    }
  })
}

const createValidationSchema = (steps: FormStepConfig[]): z.ZodSchema<any> => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  console.log('Creating validation schema for steps:', steps)

  steps.forEach(step => {
    console.log(`Processing step: ${step.label}`)
    step.fields.forEach(field => {
      console.log(`Processing field: ${field.name}, type: ${field.type}, required: ${field.required}`)

      if (field.type === 'hidden' || field.type === 'label') {
        schemaFields[field.name] = z.any().optional()
        return
      }

      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case 'text':
        case 'password':
          if (field.required) {
            fieldSchema = z.string({
              required_error: `${field.label} is required`,
              invalid_type_error: `${field.label} must be text`
            }).min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.string().optional().or(z.literal(''))
          }

          // Add pattern validation for specific fields
          if (field.name.includes('phone') || field.name.includes('Phone')) {
            fieldSchema = fieldSchema.refine(
              (val) => {
                if (!val || val === '') return !field.required // Allow empty if not required
                return VALIDATION_PATTERNS.PHONE.test(val)
              },
              { message: 'Please enter a valid US phone number' }
            )
          }
          if (field.name.includes('ssn') || field.name.includes('Ssn')) {
            fieldSchema = fieldSchema.refine(
              (val) => {
                if (!val || val === '') return !field.required
                return VALIDATION_PATTERNS.SSN.test(val)
              },
              { message: 'Please enter a valid 9-digit SSN' }
            )
          }
          if (field.name.includes('zip') || field.name.includes('Zip')) {
            fieldSchema = fieldSchema.refine(
              (val) => {
                if (!val || val === '') return !field.required
                return VALIDATION_PATTERNS.ZIP.test(val)
              },
              { message: 'Please enter a valid 5-digit ZIP code' }
            )
          }
          break

        case 'email':
          if (field.required) {
            fieldSchema = z.string({
              required_error: `${field.label} is required`
            }).min(1, `${field.label} is required`).email('Please enter a valid email address')
          } else {
            fieldSchema = z.union([
              z.string().email('Please enter a valid email address'),
              z.literal('')
            ]).optional()
          }
          break

        case 'number':
          if (field.required) {
            fieldSchema = z.string({
              required_error: `${field.label} is required`
            }).min(1, `${field.label} is required`).refine(
              (val) => !isNaN(Number(val)),
              { message: 'Please enter a valid number' }
            )
          } else {
            fieldSchema = z.string().optional().or(z.literal(''))
          }
          break

        case 'date':
          if (field.required) {
            fieldSchema = z.date({
              required_error: `${field.label} is required`,
              invalid_type_error: 'Please enter a valid date'
            }).refine(
              (date) => {
                const age = getAge(date)
                return age >= 18 && age <= 150
              },
              { message: 'Age must be between 18 and 150 years' }
            )
          } else {
            fieldSchema = z.date().optional()
          }
          break

        case 'select':
        case 'radio':
          if (field.required) {
            fieldSchema = z.string({
              required_error: `${field.label} is required`
            }).min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.string().optional().or(z.literal(''))
          }
          break

        case 'checkbox':
          fieldSchema = z.boolean().optional()
          break

        case 'multi':
          if (field.required) {
            fieldSchema = z.array(z.string(), {
              required_error: `${field.label} is required`
            }).min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.array(z.string()).optional()
          }
          break

        case 'textarea':
          if (field.required) {
            fieldSchema = z.string({
              required_error: `${field.label} is required`
            }).min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.string().optional().or(z.literal(''))
          }
          break

        default:
          fieldSchema = z.string().optional()
      }

      schemaFields[field.name] = fieldSchema
      console.log(`Created schema for ${field.name}:`, fieldSchema._def)
    })
  })

  // Create the base schema
  let schema = z.object(schemaFields)

  // Add cross-field validation for joint borrower fields
  schema = schema.refine(
    (data) => {
      if (data.applicationType === 'JOINT') {
        // Joint borrower phone must be different from applicant phone
        if (data.jointPhone && data.phone && data.jointPhone === data.phone) {
          return false
        }
        // Joint borrower email must be different from applicant email
        if (data.jointEmail && data.email && data.jointEmail === data.email) {
          return false
        }
        // Joint borrower SSN must be different from applicant SSN
        if (data.jointSsn && data.ssn && data.jointSsn === data.ssn) {
          return false
        }
      }
      return true
    },
    {
      message: 'Joint borrower information must be different from applicant information',
      path: ['jointPhone'] // This will be handled in field-specific validation
    }
  )

  // Add field-specific cross-validation
  schema = schema.refine(
    (data) => {
      if (data.applicationType === 'JOINT' && data.jointPhone && data.phone) {
        return data.jointPhone !== data.phone
      }
      return true
    },
    {
      message: 'Joint borrower phone must be different from applicant phone',
      path: ['jointPhone']
    }
  )

  schema = schema.refine(
    (data) => {
      if (data.applicationType === 'JOINT' && data.jointEmail && data.email) {
        return data.jointEmail !== data.email
      }
      return true
    },
    {
      message: 'Joint borrower email must be different from applicant email',
      path: ['jointEmail']
    }
  )

  schema = schema.refine(
    (data) => {
      if (data.applicationType === 'JOINT' && data.jointSsn && data.ssn) {
        return data.jointSsn !== data.ssn
      }
      return true
    },
    {
      message: 'Joint borrower SSN must be different from applicant SSN',
      path: ['jointSsn']
    }
  )

  return schema
}

const createInitialValues = (steps: FormStepConfig[]): Record<string, any> => {
  const values: Record<string, any> = {}
  const defaultDate = subDays(subYears(new Date(), 18), 1)

  steps.forEach(step => {
    step.fields.forEach(field => {
      switch (field.type) {
        case 'checkbox':
          values[field.name] = false
          break
        case 'multi':
          values[field.name] = []
          break
        case 'date':
          values[field.name] = field.defaultValue || defaultDate
          break
        case 'number':
          values[field.name] = ''
          break
        default:
          values[field.name] = field.defaultValue || ''
          break
      }
    })
  })

  return values
}

// Main exported component
export const UserRegistrationStepsFormik: React.FC = () => {
  const [config, setConfig] = useState<FormikStepFormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Use the parametric config endpoint for Formik
        const response = await axios.get<ApiStepResponse>('http://localhost:3001/api/config/formik/user-registration-steps')
        const apiResponse = response.data

        // Validate API response structure
        if (!apiResponse || !apiResponse.form || !apiResponse.form.steps) {
          throw new Error('Invalid API response structure: missing steps')
        }

        // Debug: Log the API response
        console.log('API Response (Formik):', apiResponse)
        console.log('Steps:', apiResponse.form.steps)

        // Build helpers from API
        const patternMap = buildPatternMap(apiResponse.validationPatterns)

        // Map API response to FormikStepFormConfig
        const mappedSteps: FormStepConfig[] = apiResponse.form.steps.map((step, stepIndex) => {
          console.log(`Processing step ${stepIndex}:`, step)

          // Normalize step conditions: backend may send an array of JSONLogic rules
          const normalizedStepConditions = Array.isArray(step.conditions)
            ? (step.conditions.length === 1
                ? step.conditions[0]
                : { and: step.conditions })
            : step.conditions

          return {
            id: step.id,
            label: step.label,
            conditions: normalizedStepConditions,
            fields: step.fields ? step.fields.map((field, fieldIndex) => {
              console.log(`Processing field ${fieldIndex} in step ${stepIndex}:`, field)
              return mapApiFieldToFieldConfig(field)
            }) : []
          }
        })

        const stepFormConfig: FormikStepFormConfig = {
          title: apiResponse.form.title || 'User Registration (Formik)',
          description: apiResponse.form.description || 'Step-based form using Formik + Yup validation',
          steps: mappedSteps,
          validationSchema: createValidationSchema(mappedSteps),
          initialValues: createInitialValues(mappedSteps),
          submitButtonText: apiResponse.form.submitButtonText || 'Submit',
          resetButtonText: apiResponse.form.resetButtonText || 'Reset',
          onSubmit: async (values: any) => {
            console.log('Form submitted with values:', values)
            alert('User registration submitted successfully!')
          }
        }

        console.log('Mapped FormikStepFormConfig:', stepFormConfig)
        setConfig(stepFormConfig)
      } catch (err) {
        console.error('Error fetching form config:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading form configuration</p>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-600">No form configuration available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FormStepper config={config} />
    </div>
  );
};

export default UserRegistrationStepsFormik;