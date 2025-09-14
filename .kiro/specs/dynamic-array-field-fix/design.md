# Design Document

## Overview

The dynamic array field functionality is not working correctly due to several issues in the form initialization, field mapping, and conditional visibility handling. The design addresses these issues by ensuring proper array field initialization, correct type mapping, and proper integration with the conditional visibility system.

## Architecture

The fix involves three main components:

1. **Backend Configuration Processing** - Ensure array field configurations are properly mapped from API response
2. **Array Field Initialization** - Properly initialize array fields with default values based on minItems
3. **Conditional Visibility Integration** - Ensure array fields work correctly with conditions conditions

## Components and Interfaces

### 1. RemoteForm Component Updates

**Current Issue:** Array fields may not be properly initialized with default items when they become visible.

**Solution:** 
- Modify the `defaultValues` generation logic to respect `minItems` for array fields
- Ensure conditional array fields are properly initialized when they become visible

### 2. DynamicField Component Updates

**Current Issue:** Array field visibility changes may not properly initialize the field with default items.

**Solution:**
- Update the `useEffect` that handles visibility changes to properly initialize array fields
- Ensure array fields get at least `minItems` items when they become visible

### 3. ArrayField Component Verification

**Current Status:** The ArrayField component appears to be correctly implemented.

**Verification Needed:**
- Ensure the component properly handles empty arrays
- Verify add/remove functionality works with form state
- Confirm validation works correctly

## Data Models

### Array Field Configuration
```typescript
type ArrayFieldConfig = {
  name: string
  label: string
  type: 'array'
  required?: boolean
  description?: string
  arrayItemFields: ArrayItemFieldConfig[]
  minItems?: number
  maxItems?: number
  addButtonText?: string
  removeButtonText?: string
  conditions?: any // JSON Logic condition
}
```

### Array Item Field Configuration
```typescript
type ArrayItemFieldConfig = {
  name: string
  label: string
  type: Exclude<FieldType, 'array'>
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
}
```

## Error Handling

### Array Field Initialization Errors
- **Issue:** Array fields not initializing with minimum items
- **Solution:** Add proper default value generation that respects minItems
- **Fallback:** Initialize with empty array and let ArrayField component handle adding first item

### Conditional Visibility Errors
- **Issue:** Array fields not properly initializing when becoming visible
- **Solution:** Add specific handling for array fields in visibility change effects
- **Fallback:** Ensure ArrayField component can handle undefined/empty values gracefully

### Validation Errors
- **Issue:** Array validation may not work correctly with conditional fields
- **Solution:** Ensure validation only runs when fields are visible
- **Fallback:** Clear validation errors when fields become hidden

## Testing Strategy

Manual testing will be performed to verify:
1. Array fields initialize correctly with minimum items
2. Add/remove functionality works as expected
3. Conditional visibility properly shows/hides array fields
4. Form submission includes correct array data structure

## Implementation Approach

### Phase 1: Fix Array Field Initialization
1. Update RemoteForm component to properly initialize array fields with minItems
2. Update DynamicField component to handle array field visibility changes
3. Verify ArrayField component handles empty/undefined values correctly

### Phase 2: Enhance Conditional Visibility
1. Ensure array fields properly initialize when becoming visible
2. Ensure array data is cleared when fields become hidden
3. Test conditional visibility with various scenarios

### Phase 3: Validation and Error Handling
1. Verify array field validation works correctly
2. Ensure validation errors are properly displayed
3. Test form submission with array data

### Phase 4: Manual Verification
1. Test the complete flow with the user-registration configuration
2. Verify add/remove functionality works correctly
3. Confirm conditional visibility works as expected
4. Test form submission and data structure