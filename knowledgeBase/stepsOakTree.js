import { US_STATES } from "../../property/property.data";
import { formIds, PHONE_VALIDATION_REGEX } from "./formConfig.data";
import { BorrowerApplicationTypeEnum, PropertyTypeEnum, propertyUsageType } from "../application-misc.data";
import { subDays, subYears } from "date-fns";

const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyTypeEnum.SINGLE_FAMILY_RESIDENCE.value, label: PropertyTypeEnum.SINGLE_FAMILY_RESIDENCE.label },
  { value: PropertyTypeEnum.CONDO.value, label: PropertyTypeEnum.CONDO.label },
  { value: PropertyTypeEnum.TWO_TO_FOUR_UNIT_DB.value, label: PropertyTypeEnum.TWO_TO_FOUR_UNIT_DB.label },
  { value: PropertyTypeEnum.PUD.value, label: PropertyTypeEnum.PUD.label },
  { value: PropertyTypeEnum.OTHER.value, label: PropertyTypeEnum.OTHER.label },
];

export const stepsOakTree_v1 = [
  {
    label: "Personal Information",
    id: formIds.personalInformation,
    fields: [
      {
        id: formIds.firstName,
        type: "text",
        name: formIds.firstName,
        label: "First Name",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "First name is required",
        },
      },
      {
        id: formIds.lastName,
        type: "text",
        name: formIds.lastName,
        label: "Last Name",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "Last name is required",
        },
      },
      {
        id: formIds.email,
        type: "text",
        name: formIds.email,
        label: "Email",
        grid: { xs: 12 },
        disabled: [
          {
            "===": [{ var: "isEmailDisabled" }, true],
          },
        ],
        validation: {
          required: "Email is required",
          email: "Please enter a valid email address",
        },
      },
      {
        id: formIds.phone,
        type: "text",
        name: formIds.phone,
        label: "Phone",
        grid: { xs: 12 },
        disabled: [
          {
            "===": [{ var: "isPhoneDisabled" }, true],
          },
        ],
        validation: {
          required: "Phone number is required",
          matches: {
            pattern: PHONE_VALIDATION_REGEX,
            message: "Please enter a valid phone number",
          },
          phoneUS: "Please enter a valid US phone number",
        },
      },
      {
        id: formIds.ssn,
        type: "password",
        name: formIds.ssn,
        label: "9 digits of SSN",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "9 digits of SSN is required",
          matches: {
            pattern: "^\\d{9}$",
            message: "Please enter a valid 9-digit SSN",
          },
        },
      },
      {
        id: formIds.dob,
        type: "date",
        name: formIds.dob,
        label: "Date of Birth",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "Date of birth is required",
          minAge: 18,
          maxAge: 150,
        },
        otherProps: {
          maxDate: subDays(subYears(new Date(), 18), 1),
          minDate: subYears(new Date(), 150),
        },
        defaultValue: subDays(subYears(new Date(), 18), 1),
      },
      {
        id: formIds.maritalStatus,
        type: "dropdown",
        name: formIds.maritalStatus,
        label: "Marital Status",
        grid: { xs: 12 },
        options: [
          { value: "married", label: "Married" },
          { value: "unmarried", label: "Unmarried" },
          { value: "separated", label: "Separated" },
        ],
        validation: {
          required: "Marital Status is required",
        },
      },
      {
        id: formIds.citizenship,
        type: "dropdown",
        name: formIds.citizenship,
        label: "Citizenship",
        grid: { xs: 12 },
        options: [
          { value: "us_citizen", label: "U.S. Citizen" },
          { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
        ],
        validation: {
          required: "Citizenship is required",
        },
      },
    ],
  },
  {
    label: "Property Information",
    id: formIds.propertyInformation,
    fields: [
      {
        id: formIds.propertyUsage,
        type: "dropdown",
        name: formIds.propertyUsage,
        label: "Property Usage",
        grid: { xs: 12 },
        options: [propertyUsageType.primaryResidence, propertyUsageType.secondHome, propertyUsageType.investment],
        validation: {
          required: "Property usage is required",
        },
      },
      {
        id: formIds.propertyStreet,
        type: "text",
        name: formIds.propertyStreet,
        label: "Street",
        grid: { xs: 12 },
        validation: {
          required: "Apartment street is required",
        },
      },
      {
        id: formIds.propertyApartmentNumber,
        type: "text",
        name: formIds.propertyApartmentNumber,
        label: "Apt or Unit #",
        grid: { xs: 12, sm: 6 },
      },
      {
        id: formIds.propertyCity,
        type: "text",
        name: formIds.propertyCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "Apartment city is required",
        },
      },
      {
        id: formIds.propertyState,
        type: "dropdown",
        name: formIds.propertyState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        validation: {
          required: "State is required",
        },
      },
      {
        id: formIds.propertyZip,
        type: "text",
        name: formIds.propertyZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        validation: {
          required: "ZIP code is required",
          matches: {
            pattern: "^\\d{5}$",
            message: "Please enter a valid 5-digit ZIP code",
          },
        },
      },
      {
        id: formIds.additionalInfoOutstandingLoan,
        type: "text",
        name: formIds.additionalInfoOutstandingLoan,
        label: "Outstanding Total Loan Balance on Subject Property",
        inputProps: {
          startadornment: "$",
        },
        formType: "amount",
        grid: { xs: 12 },
        validation: {
          required: "Outstanding Total Loan Balance on Subject Property is required",
        },
      },
      {
        id: formIds.additionalInfoEstimatedValue,
        type: "text",
        name: formIds.additionalInfoEstimatedValue,
        label: "Estimated Value of Property",
        inputProps: {
          startadornment: "$",
        },
        formType: "amount",
        grid: { xs: 12 },
        validation: {
          required: "Estimated Value of Property is required",
        },
      },
      {
        id: formIds.propertyType,
        type: "dropdown",
        name: formIds.propertyType,
        label: "Property Type",
        grid: { xs: 12 },
        options: PROPERTY_TYPE_OPTIONS,
        validation: {
          required: "Property type is required",
        },
      },
      // Conditional Fields
      {
        id: formIds.additionalInfoLive2Years,
        type: "radio",
        name: formIds.additionalInfoLive2Years,
        label: "Have you lived here for over 2 years?",
        grid: { xs: 12 },
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        conditions: [
          {
            "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value],
          },
        ],
        validation: {
          required: "Have you lived here for over 2 years is required",
        },
      },
      {
        id: formIds.additionalInfoCurrentAddress,
        type: "label",
        name: formIds.additionalInfoCurrentAddress,
        text: "Current Address",
        sx: { fontWeight: "bold", my: 2, mx: 1, fontSize: "13px" },
        grid: { xs: 12 },
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
        ],
      },
      {
        id: formIds.additionalInfoPreviousAddress,
        type: "label",
        name: formIds.additionalInfoPreviousAddress,
        text: "Previous Address",
        sx: { fontWeight: "bold", my: 2, mx: 1, fontSize: "13px" },
        grid: { xs: 12 },
        conditions: [
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
      },
      // Fields that require complex conditions
      // These fields will appear if:
      // - property_usage is 'second_home' or 'investment', OR
      // - property_usage is 'primary_residence' AND additional_info_live_2_yrs is 'no'
      {
        id: formIds.additionalInfoPropertyStreet,
        type: "text",
        name: formIds.additionalInfoPropertyStreet,
        label: "Street",
        grid: { xs: 12 },
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
        validation: {
          required: "Street address is required",
        },
      },
      {
        id: formIds.additionalInfoPropertyApartmentNumber,
        type: "text",
        name: formIds.additionalInfoPropertyApartmentNumber,
        label: "Apt or Unit #",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.additionalInfoPropertyCity,
        type: "text",
        name: formIds.additionalInfoPropertyCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
        validation: {
          required: "City is required",
        },
      },
      {
        id: formIds.additionalInfoPropertyState,
        type: "dropdown",
        name: formIds.additionalInfoPropertyState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
        validation: {
          required: "State is required",
        },
      },
      {
        id: formIds.additionalInfoPropertyZip,
        type: "text",
        name: formIds.additionalInfoPropertyZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
        validation: {
          matches: {
            pattern: "^\\d{5}$",
            message: "Please enter a valid 5-digit ZIP code",
          },
        },
      },
      {
        id: formIds.additionalInfoPropertyType,
        type: "dropdown",
        name: formIds.additionalInfoPropertyType,
        label: "Property Type",
        grid: { xs: 12 },
        options: PROPERTY_TYPE_OPTIONS,
        conditions: [
          {
            or: [
              { "===": [{ var: "property_usage" }, propertyUsageType.secondHome.value] },
              { "===": [{ var: "property_usage" }, propertyUsageType.investment.value] },
            ],
          },
          {
            and: [
              { "===": [{ var: "property_usage" }, propertyUsageType.primaryResidence.value] },
              { "===": [{ var: "additional_info_live_2_yrs" }, "no"] },
            ],
          },
        ],
        validation: {
          required: "Property type is required",
        },
      },
    ],
  },
  {
    label: "Application Information",
    id: formIds.applicationInformation,
    fields: [
      {
        id: formIds.applicationType,
        type: "radio",
        name: formIds.applicationType,
        label: "Application Type",
        grid: { xs: 12 },
        options: [BorrowerApplicationTypeEnum.JOINT, BorrowerApplicationTypeEnum.INDIVIDUAL],
        validation: {
          required: "Application type is required",
        },
      },
      {
        id: formIds.jointBorrowerLivesWithApplicant,
        type: "radio",
        name: formIds.jointBorrowerLivesWithApplicant,
        label: "Does the Co-Borrower live with you?",
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        grid: { xs: 12 },
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        validation: {
          required: "Co-Borrower lives with you is required",
        },
      },
      // Conditional Fields for Co-borrower
      {
        id: formIds.jointFirstName,
        type: "text",
        name: formIds.jointFirstName,
        label: "Co-borrower First Name",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Co-borrower First Name is required",
        },
      },
      {
        id: formIds.jointLastName,
        type: "text",
        name: formIds.jointLastName,
        label: "Co-borrower Last Name",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Co-borrower Last name is required",
        },
      },
      {
        id: formIds.jointPhone,
        type: "text",
        name: formIds.jointPhone,
        label: "Co-borrower Phone",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Co-borrower Phone is required",
          matches: {
            pattern: PHONE_VALIDATION_REGEX,
            message: "Please enter a valid phone number",
          },
          phoneUS: "Please enter a valid phone number",
          notEqualToPhone: {
            field: "phone",
            message:
              "Please provide an alternative contact number, as the co-borrower phone number cannot be the same as primary borrower phone number",
          },
        },
      },
      {
        id: formIds.jointEmail,
        type: "text",
        name: formIds.jointEmail,
        label: "Co-borrower Email",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Co-borrower Email is required",
          email: "Please enter a valid email address",
          notEqualToEmail: {
            field: "email",
            message:
              "Please provide an alternative email address, as the co-borrower email cannot be the same as primary borrower email",
          },
        },
      },
      {
        id: formIds.jointSsn,
        type: "password",
        name: formIds.jointSsn,
        label: "9 Digit SSN",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "9 digits of SSN is required",
          matches: {
            pattern: "^\\d{9}$",
            message: "Please enter a valid 9-digit SSN",
          },
          notEqualToSSN: {
            field: "ssn",
            message:
              "Please provide a different SSN, as the co-borrower SSN cannot be the same as the primary borrower SSN.",
          },
        },
      },
      {
        id: formIds.jointDob,
        type: "date",
        name: formIds.jointDob,
        label: "Date of Birth",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Date of birth is required",
          minAge: 18,
          maxAge: 150,
        },
        otherProps: {
          maxDate: subDays(subYears(new Date(), 18), 1),
          minDate: subYears(new Date(), 150),
        },
        defaultValue: subDays(subYears(new Date(), 18), 1),
      },
      {
        id: formIds.jointMaritalStatus,
        type: "dropdown",
        name: formIds.jointMaritalStatus,
        label: "Marital Status",
        grid: { xs: 12 },
        options: [
          { value: "married", label: "Married" },
          { value: "unmarried", label: "Unmarried" },
          { value: "separated", label: "Separated" },
        ],
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Marital Status is required",
        },
      },
      {
        id: formIds.jointCitizenship,
        type: "dropdown",
        name: formIds.jointCitizenship,
        label: "Citizenship",
        grid: { xs: 12 },
        options: [
          { value: "us_citizen", label: "U.S. Citizen" },
          { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
        ],
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Citizenship is required",
        },
      },
    ],
  },
  {
    label: "Income Information",
    id: formIds.incomeInformation,
    fields: [
      {
        id: formIds.additionalInfoSourceOfIncome,
        type: "multi",
        name: formIds.additionalInfoSourceOfIncome,
        label: "What is the source of your income?",
        grid: { xs: 12 },
        options: [
          { value: "salary_or_wages", label: "Salary or Wages" },
          { value: "business_owner_or_self_employed", label: "Business Owner or Self Employed" },
          { value: "other_sources", label: "Other sources" },
        ],
        validation: {
          required: "Source of your income is required",
        },
      },
      {
        id: formIds.additionalInfoSourceName,
        type: "text",
        name: formIds.additionalInfoSourceName,
        label: "Employer/ Business/Other Source Name",
        grid: { xs: 12 },
        validation: {
          required: "Employer/ Business/Other Source Name is required",
        },
      },
      {
        id: formIds.additionalInfoPositionTitle,
        type: "text",
        name: formIds.additionalInfoPositionTitle,
        label: "Position or Title",
        grid: { xs: 12, sm: 6 },
      },
      {
        id: formIds.additionalInfoSourceStartDate,
        type: "date",
        name: formIds.additionalInfoSourceStartDate,
        label: "Start Date",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          compareDates: [
            {
              today: true,
              operator: "<",
              message: "Start date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.additionalInfoSourceStreet,
        type: "text",
        name: formIds.additionalInfoSourceStreet,
        label: "Street",
        grid: { xs: 12 },
      },
      {
        id: formIds.additionalInfoSourceUnitNumber,
        type: "text",
        name: formIds.additionalInfoSourceUnitNumber,
        label: "Unit #",
        grid: { xs: 12, sm: 6 },
      },
      {
        id: formIds.additionalInfoSourceCity,
        type: "text",
        name: formIds.additionalInfoSourceCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
      },
      {
        id: formIds.additionalInfoSourceState,
        type: "dropdown",
        name: formIds.additionalInfoSourceState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
      },
      {
        id: formIds.additionalInfoSourceZip,
        type: "text",
        name: formIds.additionalInfoSourceZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        validation: {
          matches: {
            pattern: "^\\d{5}$",
            message: "Please enter a valid 5-digit ZIP code",
          },
        },
      },
      {
        id: formIds.additionalInfoWorked2Years,
        type: "hidden",
        name: formIds.additionalInfoWorked2Years,
        defaultValue: "no",
        computeValue: {
          if: [
            {
              ">=": [{ dateDiffInYears: [{ var: "additional_info_source_start_date" }, { CURRENT_DATE: [] }] }, 2],
            },
            "yes",
            "no",
          ],
        },
      },
      // Conditional Field for 25% Owner
      {
        id: formIds.additionalInfo25PercentOwner,
        type: "radio",
        name: formIds.additionalInfo25PercentOwner,
        label: "Do you own 25% or more of this business?",
        grid: { xs: 12 },
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        conditions: [{ contains: [{ var: "additional_info_source_of_income" }, "business_owner_or_self_employed"] }],
      },
      // Conditional Fields for Previous Employer
      {
        id: formIds.additionalInfoPreviousEmployerText,
        type: "label",
        name: formIds.additionalInfoPreviousEmployerText,
        text: "Please provide previous employer name and address",
        sx: { fontWeight: "bold", my: 2, mx: 1, fontSize: "13px" },
        grid: { xs: 12, sm: 10 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
      {
        id: formIds.additionalInfoPreviousEmployerName,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerName,
        label: "Previous Employer Name",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
        validation: {
          required: "Previous Employer Name is required",
        },
      },
      {
        id: formIds.additionalInfoPreviousEmployerPositionTitle,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerPositionTitle,
        label: "Position or Title",
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
        grid: { xs: 12 },
      },
      {
        id: formIds.additionalInfoPreviousEmployerStartDate,
        type: "date",
        name: formIds.additionalInfoPreviousEmployerStartDate,
        label: "Start Date",
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          compareDates: [
            {
              field: "additional_info_source_start_date",
              operator: "<",
              message: "Start date must be before Primary income start date",
            },
            {
              field: "additional_info_previous_employer_end_date",
              operator: "<",
              message: "Start date must be before End Date",
            },
            {
              today: true,
              operator: "<",
              message: "Start date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.additionalInfoPreviousEmployerEndDate,
        type: "date",
        name: formIds.additionalInfoPreviousEmployerEndDate,
        label: "End Date",
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          compareDates: [
            {
              field: "additional_info_source_start_date",
              operator: "<",
              message: "End date must be before Primary income start date",
            },
            {
              field: "additional_info_previous_employer_start_date",
              operator: ">",
              message: "End date must be after start Date",
            },
            {
              today: true,
              operator: "<",
              message: "End date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.additionalInfoPreviousEmployerStreet,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerStreet,
        label: "Street",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
      {
        id: formIds.additionalInfoPreviousEmployerApartmentNumber,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerApartmentNumber,
        label: "Apt or Unit #",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
      {
        id: formIds.additionalInfoPreviousEmployerCity,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
      {
        id: formIds.additionalInfoPreviousEmployerState,
        type: "dropdown",
        name: formIds.additionalInfoPreviousEmployerState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
      {
        id: formIds.additionalInfoPreviousEmployerZip,
        type: "text",
        name: formIds.additionalInfoPreviousEmployerZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "additional_info_worked_2_years" }, "no"] }],
      },
    ],
  },
  {
    label: "Co-Borrower Income Information",
    id: formIds.coIncomeInformation,
    fields: [
      {
        id: formIds.coAdditionalInfoSourceOfIncome,
        type: "multi",
        name: formIds.coAdditionalInfoSourceOfIncome,
        label: "What is the source of co borrower's income?",
        grid: { xs: 12 },
        options: [
          { value: "salary_or_wages", label: "Salary or Wages" },
          { value: "business_owner_or_self_employed", label: "Business Owner or Self Employed" },
          { value: "other_sources", label: "Other sources" },
        ],
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Source of co borrower's income is required",
        },
      },
      {
        id: formIds.coAdditionalInfoSourceName,
        type: "text",
        name: formIds.coAdditionalInfoSourceName,
        label: "Employer/ Business/Other Source Name",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          required: "Employer/ Business/Other Source Name is required",
        },
      },
      {
        id: formIds.coAdditionalInfoPositionTitle,
        type: "text",
        name: formIds.coAdditionalInfoPositionTitle,
        label: "Position or Title",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
      },
      {
        id: formIds.coAdditionalInfoSourceStartDate,
        type: "date",
        name: formIds.coAdditionalInfoSourceStartDate,
        label: "Start Date",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          compareDates: [
            {
              today: true,
              operator: "<",
              message: "Start date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.coAdditionalInfoSourceStreet,
        type: "text",
        name: formIds.coAdditionalInfoSourceStreet,
        label: "Street",
        grid: { xs: 12 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
      },
      {
        id: formIds.coAdditionalInfoSourceUnitNumber,
        type: "text",
        name: formIds.coAdditionalInfoSourceUnitNumber,
        label: "Unit #",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
      },
      {
        id: formIds.coAdditionalInfoSourceCity,
        type: "text",
        name: formIds.coAdditionalInfoSourceCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
      },
      {
        id: formIds.coAdditionalInfoSourceState,
        type: "dropdown",
        name: formIds.coAdditionalInfoSourceState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
      },
      {
        id: formIds.coAdditionalInfoSourceZip,
        type: "text",
        name: formIds.coAdditionalInfoSourceZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        validation: {
          matches: {
            pattern: "^\\d{5}$",
            message: "Please enter a valid 5-digit ZIP code",
          },
        },
      },
      {
        id: formIds.coAdditionalInfoWorked2Years,
        type: "hidden",
        name: formIds.coAdditionalInfoWorked2Years,
        defaultValue: "no",
        conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
        computeValue: {
          if: [
            {
              ">=": [
                {
                  dateDiffInYears: [{ var: "co_additional_info_source_start_date" }, { CURRENT_DATE: [] }],
                },
                2,
              ],
            },
            "yes",
            "no",
          ],
        },
      },
      // Conditional Field for 25% Owner
      {
        id: formIds.coAdditionalInfo25PercentOwner,
        type: "radio",
        name: formIds.coAdditionalInfo25PercentOwner,
        label: "Do you own 25% or more of this business?",
        grid: { xs: 12 },
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { contains: [{ var: "co_additional_info_source_of_income" }, "business_owner_or_self_employed"] },
            ],
          },
        ],
      },
      // Conditional Fields for Previous Employer
      {
        id: formIds.coAdditionalInfoPreviousEmployerText,
        type: "label",
        name: formIds.coAdditionalInfoPreviousEmployerText,
        text: "Please provide previous employer name and address",
        sx: { fontWeight: "bold", my: 2, mx: 1, fontSize: "13px" },
        grid: { xs: 12, sm: 10 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerName,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerName,
        label: "Previous Employer Name",
        grid: { xs: 12 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
        validation: {
          required: "Previous Employer Name is required",
        },
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerPositionTitle,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerPositionTitle,
        label: "Position or Title",
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
        grid: { xs: 12 },
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerStartDate,
        type: "date",
        name: formIds.coAdditionalInfoPreviousEmployerStartDate,
        label: "Start Date",
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          compareDates: [
            {
              field: "co_additional_info_source_start_date",
              operator: "<",
              message: "Start date must be before Primary income start date",
            },
            {
              field: "co_additional_info_previous_employer_end_date",
              operator: "<",
              message: "Start date must be before End Date",
            },
            {
              today: true,
              operator: "<",
              message: "Start date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerEndDate,
        type: "date",
        name: formIds.coAdditionalInfoPreviousEmployerEndDate,
        label: "End Date",
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        validation: {
          compareDates: [
            {
              field: "co_additional_info_source_start_date",
              operator: "<",
              message: "End date must be before Primary income start date",
            },
            {
              field: "co_additional_info_previous_employer_start_date",
              operator: ">",
              message: "End date must be after start Date",
            },
            {
              today: true,
              operator: "<",
              message: "End date cannot be in the future",
            },
          ],
        },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerStreet,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerStreet,
        label: "Street",
        grid: { xs: 12 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerApartmentNumber,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerApartmentNumber,
        label: "Apt or Unit #",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerCity,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerCity,
        label: "City",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerState,
        type: "dropdown",
        name: formIds.coAdditionalInfoPreviousEmployerState,
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
      {
        id: formIds.coAdditionalInfoPreviousEmployerZip,
        type: "text",
        name: formIds.coAdditionalInfoPreviousEmployerZip,
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            and: [
              { "===": [{ var: "application_type" }, "joint"] },
              { "===": [{ var: "co_additional_info_worked_2_years" }, "no"] },
            ],
          },
        ],
      },
    ],
    conditions: [{ "===": [{ var: "application_type" }, "joint"] }],
  },
];
