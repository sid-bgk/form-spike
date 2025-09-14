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
    return jsonLogic.apply(field.conditions, formValues)
  } catch (error) {
    console.error('Error evaluating conditions condition:', error, field.conditions)
    return true // Default to visible if evaluation fails
  }
}