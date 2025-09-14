# Requirements Document

## Introduction

This feature transforms the existing field-based TanStack form configuration into a step-based configuration system. The new configuration will organize form fields into logical steps/sections based on the knowledge base stepsOakTree.js structure, enabling multi-step form workflows while maintaining compatibility with the existing TanStack form system.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to create step-based form configurations, so that I can build multi-step forms with logical groupings of related fields.

#### Acceptance Criteria

1. WHEN a step-based config is created THEN the system SHALL organize fields into logical steps with labels and IDs
2. WHEN each step is defined THEN the system SHALL include a label, id, and fields array similar to stepsOakTree structure
3. WHEN the config is processed THEN the system SHALL maintain backward compatibility with existing TanStack form validation and field types

### Requirement 2

**User Story:** As a developer, I want to convert existing field configurations into step-based configurations, so that I can migrate from single-page forms to multi-step forms without losing existing functionality.

#### Acceptance Criteria

1. WHEN converting existing configs THEN the system SHALL preserve all existing field properties (name, label, type, validation, etc.)
2. WHEN grouping fields into steps THEN the system SHALL organize related fields logically (personal info, contact info, employment, etc.)
3. WHEN maintaining validation THEN the system SHALL ensure all existing validation rules are preserved in the new structure

### Requirement 3

**User Story:** As a developer, I want to add form type specifications to fields, so that I can handle special field types like amounts, dates, and conditional fields.

#### Acceptance Criteria

1. WHEN a field requires special formatting THEN the system SHALL support formType property (e.g., "amount" for currency fields)
2. WHEN fields have conditions THEN the system SHALL support conditional rendering based on other field values
3. WHEN fields need special input properties THEN the system SHALL support inputProps for additional field configuration

### Requirement 4

**User Story:** As a developer, I want to maintain the existing TanStack form structure, so that the new step-based config can be easily integrated with existing form rendering systems.

#### Acceptance Criteria

1. WHEN the config is exported THEN the system SHALL use the same module.exports structure as existing configs
2. WHEN version control is needed THEN the system SHALL include version property for config management
3. WHEN form metadata is required THEN the system SHALL include title, description, and button text properties