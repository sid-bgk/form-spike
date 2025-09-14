# Enhanced Conditional Field Validation

This document describes the enhanced conditional field validation system implemented in the DynamicField component.

## Overview

The enhanced validation system ensures that conditional fields (fields with `conditions` property) are properly handled in terms of:

1. **Validation Skipping**: Hidden fields are not validated
2. **Error Clearing**: Validation errors are cleared when fields become hidden
3. **Re-validation**: Fields are re-validated when they become visible
4. **State Management**: Proper validation state is maintained for conditional fields

## Implementation Details

### 1. Validation Logic Enhancement

The `getFieldValidators` function now includes conditional logic for both `onChange` and `onBlur` events:

```typescript
const getFieldValidators = useMemo(() => {
  // ... validation config setup ...
  
  return {
    onChange: ({ value }: any) => {
      // Check if field should be validated based on visibility
      if (field.conditions) {
        const currentFormValues = form.state.values
        const isCurrentlyVisible = jsonLogic.apply(field.conditions, currentFormValues)
        
        // Skip validation for hidden fields
        if (!isCurrentlyVisible) {
          return undefined
        }
      }
      
      // Apply validation for visible fields
      return fieldValidator.validate(value, form.state.values)
    },
    onBlur: ({ value }: any) => {
      // Same logic for onBlur validation
      // ...
    }
  }
}, [field, form])
```

### 2. Field Visibility Change Handling

Enhanced `useEffect` that handles field visibility changes:

```typescript
useEffect(() => {
  if (field.conditions) {
    if (!isVisible) {
      // Clear field value with appropriate default
      const defaultValue = getDefaultValueForFieldType(field.type)
      form.setFieldValue(name, defaultValue)

      // Clear validation state completely
      const fieldInstance = form.getFieldInfo(name)
      if (fieldInstance && fieldInstance.instance) {
        fieldInstance.instance.setState((prev: any) => ({
          ...prev,
          meta: {
            ...prev.meta,
            errors: [],
            errorMap: {},
            isValid: true,
            isTouched: false,
            isDirty: false
          }
        }))
      }
    } else {
      // Re-validate when field becomes visible
      setTimeout(() => {
        const currentValue = form.getFieldValue(name)
        if (currentValue !== undefined && currentValue !== '' && currentValue !== null) {
          form.validateField(name, 'change')
        }
      }, 0)
    }
  }
}, [isVisible, form, name, field.conditions, field.type])
```

### 3. Form Value Change Monitoring

Additional `useEffect` to handle form value changes that might affect conditional field validation:

```typescript
useEffect(() => {
  if (field.conditions && isVisible) {
    const currentValue = form.getFieldValue(name)
    const fieldInstance = form.getFieldInfo(name)
    
    // Re-validate touched fields with values when form state changes
    if (fieldInstance?.instance?.state?.meta?.isTouched && 
        (currentValue !== undefined && currentValue !== '' && currentValue !== null)) {
      setTimeout(() => {
        form.validateField(name, 'change')
      }, 0)
    }
  }
}, [form.state.values, field.conditions, isVisible, form, name])
```

### 4. Default Value Helper

Helper function to provide appropriate default values when clearing fields:

```typescript
const getDefaultValueForFieldType = (fieldType: FieldType) => {
  switch (fieldType) {
    case 'checkbox':
      return false
    case 'array':
      return []
    case 'number':
      return ''
    default:
      return ''
  }
}
```

## Requirements Compliance

### Requirement 5.1: Skip validation for hidden conditional fields
✅ **Implemented**: The validation functions check field visibility before applying validation rules.

### Requirement 5.2: Clear validation errors when fields become hidden
✅ **Implemented**: Field meta state is reset when fields become hidden, clearing all errors and validation state.

### Requirement 5.3: Re-validate fields when they become visible
✅ **Implemented**: Fields are re-validated when they become visible, but only if they have values.

### Requirement 5.4: Maintain proper validation state for conditional fields
✅ **Implemented**: Validation state is properly managed through visibility changes and form value updates.

### Requirement 4.4: Clear validation errors for conditional fields
✅ **Implemented**: Validation errors are cleared when conditional fields become hidden.

## Testing Scenarios

### Scenario 1: Age-based Employment Question
- **Field**: `areYouWorking` (visible when age > 17)
- **Test**: Change age from 25 to 16
- **Expected**: Field becomes hidden, value cleared, validation errors cleared

### Scenario 2: Employment-based Companies Field
- **Field**: `companies` (visible when areYouWorking = "yes")
- **Test**: Change areYouWorking from "yes" to "no"
- **Expected**: Field becomes hidden, array value cleared, validation errors cleared

### Scenario 3: Re-validation on Visibility
- **Field**: Any conditional field with validation rules
- **Test**: Make field visible after being hidden
- **Expected**: Field is re-validated if it has a value

## Error Handling

The enhanced system includes robust error handling:

1. **JSON Logic Evaluation**: Errors in condition evaluation default to visible state
2. **Field Instance Access**: Safe access to field instances with null checks
3. **State Updates**: Defensive programming for state updates

## Performance Considerations

1. **Memoization**: Validators are memoized to prevent unnecessary re-creation
2. **Delayed Validation**: `setTimeout` is used to ensure form state consistency
3. **Conditional Execution**: Validation logic only runs when necessary

## Migration Notes

This enhancement is backward compatible with existing forms:
- Fields without `conditions` property work as before
- Existing validation rules continue to work
- No breaking changes to the API