import { useStore } from '@tanstack/react-form'
import * as jsonLogic from 'json-logic-js'
import type { FieldConfig } from '../types/form'

export function useFieldVisibility(form: any, field: FieldConfig): boolean {
  // Get current form values
  const formValues = useStore(form.store, (state) => state.values)

  // If no conditions rule, field is always visible
  if (!field.conditions) {
    return true
  }

  // Evaluate JSON Logic rule with current form values
  try {
    const result = jsonLogic.apply(field.conditions, formValues)
    // Ensure we return a boolean value
    return Boolean(result)
  } catch (error) {
    console.error('Error evaluating field visibility condition:', error, {
      fieldName: field.name,
      conditions: field.conditions,
      formValues
    })
    // Default to visible if evaluation fails to prevent fields from being permanently hidden
    return true
  }
}