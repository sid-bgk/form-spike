import { useStore } from '@tanstack/react-form'
import * as jsonLogic from 'json-logic-js'
import type { FieldConfig } from '../types/form'

export function useFieldVisibility(form: any, field: FieldConfig): boolean {
  // Get current form values
  const formValues = useStore(form.store, (state) => state.values)

  // If no showWhen rule, field is always visible
  if (!field.showWhen) {
    return true
  }

  // Evaluate JSON Logic rule with current form values
  try {
    return jsonLogic.apply(field.showWhen, formValues)
  } catch (error) {
    console.error('Error evaluating showWhen condition:', error, field.showWhen)
    return true // Default to visible if evaluation fails
  }
}