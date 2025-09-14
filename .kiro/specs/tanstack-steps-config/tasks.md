# Implementation Plan

- [x] 1. Create step-based configuration file structure





  - Create new config file `fromSpikeV2Backend/configs/tanstack/user-registration-steps.js`
  - Set up basic module.exports structure with version and form properties
  - Add form metadata (title, description, button texts)
  - _Requirements: 4.1, 4.3_

- [x] 2. Implement Personal Information step





  - Create step with label "Personal Information" and id "personalInformation"
  - Add firstName field: type "text", required validation, grid {xs: 12, sm: 6}
  - Add lastName field: type "text", required validation, grid {xs: 12, sm: 6}
  - Add email field: type "text", required + email validation, grid {xs: 12}, disabled conditions
  - Add phone field: type "text", required + PHONE_VALIDATION_REGEX + phoneUS validation, grid {xs: 12}, disabled conditions
  - Add ssn field: type "password", required + 9-digit pattern validation, grid {xs: 12, sm: 6}
  - Add dob field: type "date", required + minAge/maxAge validation, portrait orientation, maxDate/minDate props, defaultValue
  - Add maritalStatus field: type "dropdown", required validation, options [married, unmarried, separated]
  - Add citizenship field: type "dropdown", required validation, options [us_citizen, permanent_resident_alien]
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 3. Implement Property Information step





  - Create step with label "Property Information" and id "propertyInformation"
  - Add propertyUsage field: type "dropdown", required validation, options [primaryResidence, secondHome, investment]
  - Add propertyStreet field: type "text", required validation, grid {xs: 12}
  - Add propertyApartmentNumber field: type "text", grid {xs: 12, sm: 6}
  - Add propertyCity field: type "text", required validation, grid {xs: 12, sm: 6}
  - Add propertyState field: type "dropdown", required validation, US_STATES options, grid {xs: 12, sm: 6}
  - Add propertyZip field: type "text", required + 5-digit ZIP pattern validation, grid {xs: 12, sm: 6}
  - Add additionalInfoOutstandingLoan field: type "text", formType "amount", startadornment "$", required validation
  - Add additionalInfoEstimatedValue field: type "text", formType "amount", startadornment "$", required validation
  - Add propertyType field: type "dropdown", required validation, PROPERTY_TYPE_OPTIONS
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1_

- [x] 4. Add Property Information conditional fields





  - Add additionalInfoLive2Years field: type "radio", required validation, options [yes, no], conditions for primaryResidence
  - Add additionalInfoCurrentAddress field: type "label", text "Current Address", conditions for secondHome OR investment
  - Add additionalInfoPreviousAddress field: type "label", text "Previous Address", conditions for primaryResidence AND live2Years=no
  - Add additionalInfoPropertyStreet field: type "text", required validation, complex OR/AND conditions
  - Add additionalInfoPropertyApartmentNumber field: type "text", complex OR/AND conditions
  - Add additionalInfoPropertyCity field: type "text", required validation, complex OR/AND conditions
  - Add additionalInfoPropertyState field: type "dropdown", required validation, US_STATES options, complex OR/AND conditions
  - Add additionalInfoPropertyZip field: type "text", 5-digit ZIP pattern validation, complex OR/AND conditions
  - Add additionalInfoPropertyType field: type "dropdown", required validation, PROPERTY_TYPE_OPTIONS, complex OR/AND conditions
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2_

- [x] 5. Implement Application Information step





  - Create step with label "Application Information" and id "applicationInformation"
  - Add applicationType field: type "radio", required validation, options [JOINT, INDIVIDUAL] from BorrowerApplicationTypeEnum
  - Add jointBorrowerLivesWithApplicant field: type "radio", required validation, options [yes, no], conditions for joint application
  - Add jointFirstName field: type "text", required validation, grid {xs: 12, sm: 6}, conditions for joint application
  - Add jointLastName field: type "text", required validation, grid {xs: 12, sm: 6}, conditions for joint application
  - Add jointPhone field: type "text", required + PHONE_VALIDATION_REGEX + phoneUS + notEqualToPhone validation, conditions for joint
  - Add jointEmail field: type "text", required + email + notEqualToEmail validation, conditions for joint application
  - Add jointSsn field: type "password", required + 9-digit pattern + notEqualToSSN validation, conditions for joint
  - Add jointDob field: type "date", required + minAge/maxAge validation, portrait orientation, maxDate/minDate props, defaultValue, conditions for joint
  - Add jointMaritalStatus field: type "dropdown", required validation, marital status options, conditions for joint application
  - Add jointCitizenship field: type "dropdown", required validation, citizenship options, conditions for joint application
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2_

- [x] 6. Implement Income Information step





  - Create step with label "Income Information" and id "incomeInformation"
  - Add additionalInfoSourceOfIncome field: type "multi", required validation, options [salary_or_wages, business_owner_or_self_employed, other_sources]
  - Add additionalInfoSourceName field: type "text", required validation, grid {xs: 12}
  - Add additionalInfoPositionTitle field: type "text", grid {xs: 12, sm: 6}
  - Add additionalInfoSourceStartDate field: type "date", portrait orientation, compareDates validation (< today), maxDate prop
  - Add additionalInfoSourceStreet field: type "text", grid {xs: 12}
  - Add additionalInfoSourceUnitNumber field: type "text", grid {xs: 12, sm: 6}
  - Add additionalInfoSourceCity field: type "text", grid {xs: 12, sm: 6}
  - Add additionalInfoSourceState field: type "dropdown", US_STATES options, grid {xs: 12, sm: 6}
  - Add additionalInfoSourceZip field: type "text", 5-digit ZIP pattern validation, grid {xs: 12, sm: 6}
  - Add additionalInfoWorked2Years field: type "hidden", defaultValue "no", computeValue with dateDiffInYears logic
  - Add additionalInfo25PercentOwner field: type "radio", options [yes, no], conditions for business_owner_or_self_employed
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2_

- [x] 7. Add Income Information previous employer fields





  - Add additionalInfoPreviousEmployerText field: type "label", text "Please provide previous employer name and address", conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerName field: type "text", required validation, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerPositionTitle field: type "text", conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerStartDate field: type "date", portrait orientation, complex compareDates validation, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerEndDate field: type "date", portrait orientation, complex compareDates validation, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerStreet field: type "text", conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerApartmentNumber field: type "text", grid {xs: 12, sm: 6}, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerCity field: type "text", grid {xs: 12, sm: 6}, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerState field: type "dropdown", US_STATES options, grid {xs: 12, sm: 6}, conditions for worked_2_years=no
  - Add additionalInfoPreviousEmployerZip field: type "text", grid {xs: 12, sm: 6}, conditions for worked_2_years=no
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2_

- [x] 8. Implement Co-Borrower Income Information step





  - Create step with label "Co-Borrower Income Information" and id "coIncomeInformation"
  - Add coAdditionalInfoSourceOfIncome field: type "multi", required validation, income source options, conditions for joint application
  - Add coAdditionalInfoSourceName field: type "text", required validation, conditions for joint application
  - Add coAdditionalInfoPositionTitle field: type "text", conditions for joint application
  - Add all co-borrower employment address fields with proper validation and conditions
  - Add all co-borrower previous employer fields with conditional rendering
  - Mirror all income information validation rules for co-borrower fields
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2_

- [x] 9. Add required imports and constants





  - Import US_STATES from property data
  - Import formIds and PHONE_VALIDATION_REGEX from formConfig.data
  - Import BorrowerApplicationTypeEnum, PropertyTypeEnum, propertyUsageType from application-misc.data
  - Import date functions (subDays, subYears) from date-fns
  - Define PROPERTY_TYPE_OPTIONS array with all property types
  - _Requirements: 1.2, 2.1_

- [x] 10. Implement all validation patterns and rules





  - Add PHONE_VALIDATION_REGEX pattern for phone validation
  - Add 9-digit SSN pattern validation (^\\d{9}$)
  - Add 5-digit ZIP pattern validation (^\\d{5}$)
  - Add email validation rules
  - Add minAge/maxAge validation for date fields
  - Add compareDates validation with multiple operators and field references
  - Add notEqualToPhone, notEqualToEmail, notEqualToSSN custom validation rules
  - _Requirements: 2.1, 2.2_

- [x] 11. Implement complex conditional logic





  - Add JSONLogic format conditions using ===, or, and operators
  - Add contains operator for multi-select field conditions
  - Add computed field logic using dateDiffInYears and CURRENT_DATE functions
  - Add complex OR/AND conditions for property address fields
  - Ensure all conditional rendering works across step boundaries
  - _Requirements: 3.2_
-

- [x] 12. Validate configuration structure and compatibility





  - Verify the new step-based config maintains all original field properties
  - Ensure module.exports structure matches existing pattern
  - Confirm version property is included for config management
  - _Requirements: 2.1, 2.2, 4.1, 4.2_