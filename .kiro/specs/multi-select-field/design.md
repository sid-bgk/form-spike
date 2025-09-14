# Design Document

## Overview

The multi-select field feature will extend the existing dynamic form system to support fields where users can select multiple options from a predefined list. This will be implemented as a new field type "multi" that renders a list of checkboxes, each representing a selectable option.

## Architecture

### Component Structure
```
MultiSelectField (new component)
├── Label (existing shadcn component)
├── Multiple Checkbox items (existing shadcn component)
├── Description (existing pattern)
└── Error display (existing pattern)
```

### Integration Points
- **DynamicField.tsx**: Add new case for "multi" field type
- **form.ts**: Extend FieldType union to include "multi"
- **ValidationConfigParser**: Support array-based validation for multi-select
- **FieldValidatorFactory**: Handle validation of array values

## Components and Interfaces

### MultiSelectField Component

**Props Interface:**
```typescript
interface MultiSelectFieldProps {
  id: string
  options: Array<{ value: string | number; label: string }>
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  disabled?: boolean
  className?: string
}
```

**Key Features:**
- Renders a list of checkbox options
- Manages array of selected values
- Handles individual checkbox state changes
- Supports disabled state
- Provides clear visual feedback for selected/unselected states

### Type System Updates

**FieldType Extension:**
```typescript
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'array' | 'date' | 'multi'
```

**Validation Rules Enhancement:**
The existing `minItems` and `maxItems` validation rules will be utilized for multi-select validation.

## Data Models

### Field Configuration
```typescript
// Multi-select field configuration example
{
  name: "additionalInfoSourceOfIncome",
  type: "multi",
  label: "Source of Income",
  grid: { xs: 12 },
  options: [
    { value: "salary_or_wages", label: "Salary or Wages" },
    { value: "business_owner_or_self_employed", label: "Business Owner or Self Employed" },
    { value: "other_sources", label: "Other Sources" }
  ],
  validation: {
    required: "Source of income is required",
    minItems: { value: 1, message: "Please select at least one source of income" }
  }
}
```

### Data Storage
- **Field Value**: Array of selected option values `(string | number)[]`
- **Empty State**: Empty array `[]`
- **Single Selection**: Array with one element `["salary_or_wages"]`
- **Multiple Selections**: Array with multiple elements `["salary_or_wages", "other_sources"]`

## Error Handling

### Validation Integration
- **Required Validation**: Check if array is empty when field is required
- **MinItems Validation**: Ensure minimum number of selections
- **MaxItems Validation**: Ensure maximum number of selections is not exceeded
- **Custom Validation**: Support custom validation functions that receive the selected array

### Error Display
- Follow existing error display pattern used by other field types
- Show validation errors below the multi-select component
- Clear errors when validation passes

## Testing Strategy

The multi-select field will be tested through manual testing and integration with existing form validation patterns. Testing will focus on ensuring the component works correctly within the existing form system and handles all specified validation scenarios.

## Implementation Approach

### Phase 1: Core Component
1. Create MultiSelectField component using shadcn Checkbox
2. Implement basic selection/deselection logic
3. Add proper TypeScript types

### Phase 2: Form Integration
1. Update FieldType union type
2. Add "multi" case to DynamicField component
3. Ensure proper value handling and form state integration

### Phase 3: Validation & Polish
1. Integrate with existing validation system
2. Add comprehensive error handling
3. Ensure accessibility compliance
4. Add visual polish and hover states

### Phase 4: Testing & Validation
1. Test with real form configurations
2. Validate accessibility compliance
3. Ensure proper error handling
4. Test conditional visibility integration