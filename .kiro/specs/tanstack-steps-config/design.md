# Design Document

## Overview

The TanStack Steps Configuration system transforms field-based form configurations into step-based configurations that organize related fields into logical groups. This design maintains full backward compatibility with existing TanStack form systems while enabling multi-step form workflows.

## Architecture

The step-based configuration follows a hierarchical structure:
- **Form Level**: Contains metadata (title, description, buttons) and steps array
- **Step Level**: Contains step metadata (label, id) and fields array  
- **Field Level**: Contains individual field configurations with validation and properties

The design leverages the existing stepsOakTree.js structure as a reference for organizing fields into logical steps.

## Components and Interfaces

### Configuration Structure

```javascript
module.exports = {
  version: 1,
  form: {
    title: "Form Title",
    description: "Form Description", 
    submitButtonText: "Submit",
    resetButtonText: "Reset",
    steps: [
      {
        label: "Step Label",
        id: "step_id",
        fields: [
          // Field configurations
        ]
      }
    ]
  }
}
```

### Step Organization

Based on the stepsOakTree.js analysis, fields will be organized into these logical steps:

1. **Personal Information**: Basic user details (name, email, phone, SSN, DOB, marital status, citizenship)
2. **Employment Information**: Work-related fields (employment status, company details, experience)
3. **Terms and Conditions**: Agreement and consent fields

### Field Properties

Each field maintains the existing TanStack structure with these key properties:
- `name`: Field identifier
- `label`: Display label
- `type`: Input type (text, email, number, radio, checkbox, array)
- `validation`: Validation rules object
- `placeholder`: Placeholder text
- `conditions`: Conditional rendering logic
- `formType`: Special formatting type (amount, date, etc.)
- `inputProps`: Additional input properties

## Data Models

### Step Model
```javascript
{
  label: string,           // Display name for the step
  id: string,             // Unique identifier for the step
  fields: Field[]         // Array of field configurations
}
```

### Field Model
```javascript
{
  name: string,           // Field name/identifier
  label: string,          // Display label
  type: string,           // Input type
  validation?: object,    // Validation rules
  placeholder?: string,   // Placeholder text
  conditions?: object,    // Conditional rendering
  formType?: string,      // Special formatting
  inputProps?: object,    // Additional properties
  options?: array,        // For select/radio fields
  arrayItemFields?: array // For array type fields
}
```

## Error Handling

- **Invalid Step Structure**: Validate that each step has required label and id properties
- **Missing Field Properties**: Ensure required field properties (name, label, type) are present
- **Validation Rule Conflicts**: Check for conflicting validation rules within fields
- **Circular Dependencies**: Prevent circular references in conditional field logic

## Testing Strategy

### Validation Tests
- Test all field validation rules work correctly in step context
- Test conditional field showing/hiding based on step data
- Test array field functionality within steps
- Test form reset and clear functionality across steps