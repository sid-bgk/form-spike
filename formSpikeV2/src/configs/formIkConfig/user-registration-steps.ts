import * as Yup from 'yup';
import { subDays, subYears } from 'date-fns';

// Form field types
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'multi' | 'hidden' | 'label';

// Field configuration interface
export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  grid?: { xs: number; sm?: number };
  required?: boolean;
  conditions?: any; // JSON Logic conditions
  otherProps?: any;
  defaultValue?: any;
  computeValue?: any;
  formType?: string;
  inputProps?: any;
  orientation?: string;
  text?: string;
}

// Step configuration interface
export interface FormStepConfig {
  id: string;
  label: string;
  fields: FormFieldConfig[];
  conditions?: any;
}

// Main form configuration interface
export interface FormikStepFormConfig {
  title: string;
  description: string;
  steps: FormStepConfig[];
  validationSchema: Yup.ObjectSchema<any>;
  initialValues: Record<string, any>;
  submitButtonText?: string;
  resetButtonText?: string;
  onSubmit: (values: any) => Promise<void>;
}

// Validation patterns
const PHONE_VALIDATION_REGEX = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const SSN_VALIDATION_REGEX = /^\d{9}$/;
const ZIP_VALIDATION_REGEX = /^\d{5}$/;

// Enums
const BorrowerApplicationTypeEnum = {
  JOINT: "JOINT",
  INDIVIDUAL: "INDIVIDUAL"
};

const PropertyTypeEnum = {
  SINGLE_FAMILY_RESIDENCE: "single_family_residence",
  CONDO: "condo",
  TWO_TO_FOUR_UNIT_DB: "two_to_four_unit_db",
  PUD: "pud",
  OTHER: "other"
};

const propertyUsageType = {
  PRIMARY_RESIDENCE: "primaryResidence",
  SECOND_HOME: "secondHome",
  INVESTMENT: "investment"
};

// US States data
const US_STATES = [
  { abbreviation: "AL", name: "Alabama" },
  { abbreviation: "AK", name: "Alaska" },
  { abbreviation: "AZ", name: "Arizona" },
  { abbreviation: "AR", name: "Arkansas" },
  { abbreviation: "CA", name: "California" },
  { abbreviation: "CO", name: "Colorado" },
  { abbreviation: "CT", name: "Connecticut" },
  { abbreviation: "DE", name: "Delaware" },
  { abbreviation: "FL", name: "Florida" },
  { abbreviation: "GA", name: "Georgia" },
  { abbreviation: "HI", name: "Hawaii" },
  { abbreviation: "ID", name: "Idaho" },
  { abbreviation: "IL", name: "Illinois" },
  { abbreviation: "IN", name: "Indiana" },
  { abbreviation: "IA", name: "Iowa" },
  { abbreviation: "KS", name: "Kansas" },
  { abbreviation: "KY", name: "Kentucky" },
  { abbreviation: "LA", name: "Louisiana" },
  { abbreviation: "ME", name: "Maine" },
  { abbreviation: "MD", name: "Maryland" },
  { abbreviation: "MA", name: "Massachusetts" },
  { abbreviation: "MI", name: "Michigan" },
  { abbreviation: "MN", name: "Minnesota" },
  { abbreviation: "MS", name: "Mississippi" },
  { abbreviation: "MO", name: "Missouri" },
  { abbreviation: "MT", name: "Montana" },
  { abbreviation: "NE", name: "Nebraska" },
  { abbreviation: "NV", name: "Nevada" },
  { abbreviation: "NH", name: "New Hampshire" },
  { abbreviation: "NJ", name: "New Jersey" },
  { abbreviation: "NM", name: "New Mexico" },
  { abbreviation: "NY", name: "New York" },
  { abbreviation: "NC", name: "North Carolina" },
  { abbreviation: "ND", name: "North Dakota" },
  { abbreviation: "OH", name: "Ohio" },
  { abbreviation: "OK", name: "Oklahoma" },
  { abbreviation: "OR", name: "Oregon" },
  { abbreviation: "PA", name: "Pennsylvania" },
  { abbreviation: "RI", name: "Rhode Island" },
  { abbreviation: "SC", name: "South Carolina" },
  { abbreviation: "SD", name: "South Dakota" },
  { abbreviation: "TN", name: "Tennessee" },
  { abbreviation: "TX", name: "Texas" },
  { abbreviation: "UT", name: "Utah" },
  { abbreviation: "VT", name: "Vermont" },
  { abbreviation: "VA", name: "Virginia" },
  { abbreviation: "WA", name: "Washington" },
  { abbreviation: "WV", name: "West Virginia" },
  { abbreviation: "WI", name: "Wisconsin" },
  { abbreviation: "WY", name: "Wyoming" }
];

// Property type options
const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyTypeEnum.SINGLE_FAMILY_RESIDENCE, label: "Single Family Residence" },
  { value: PropertyTypeEnum.CONDO, label: "Condominium" },
  { value: PropertyTypeEnum.TWO_TO_FOUR_UNIT_DB, label: "2-4 Unit Duplex/Triplex/Fourplex" },
  { value: PropertyTypeEnum.PUD, label: "Planned Unit Development (PUD)" },
  { value: PropertyTypeEnum.OTHER, label: "Other" }
];

// Custom validation functions for cross-field validation
const createCrossFieldValidation = (fieldName: string, message: string) => {
  return Yup.string().test('not-equal-to-field', message, function(value) {
    const { parent } = this;
    if (!value || !parent[fieldName]) return true;
    return value !== parent[fieldName];
  });
};

// Age validation
const createAgeValidation = (minAge: number, maxAge: number) => {
  return Yup.date().test('age-range', `Age must be between ${minAge} and ${maxAge}`, function(value) {
    if (!value) return true;
    const today = new Date();
    const age = today.getFullYear() - value.getFullYear();
    return age >= minAge && age <= maxAge;
  });
};

// Validation schema for the entire form
const createValidationSchema = () => {
  return Yup.object().shape({
    // Personal Information
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    phone: Yup.string()
      .matches(PHONE_VALIDATION_REGEX, 'Please enter a valid US phone number')
      .required('Phone number is required'),
    ssn: Yup.string()
      .matches(SSN_VALIDATION_REGEX, 'Please enter a valid 9-digit SSN')
      .required('9 digits of SSN is required'),
    dob: createAgeValidation(18, 150).required('Date of birth is required'),
    maritalStatus: Yup.string().required('Marital Status is required'),
    citizenship: Yup.string().required('Citizenship is required'),

    // Property Information
    propertyUsage: Yup.string().required('Property usage is required'),
    propertyStreet: Yup.string().required('Street address is required'),
    propertyApartmentNumber: Yup.string(),
    propertyCity: Yup.string().required('City is required'),
    propertyState: Yup.string().required('State is required'),
    propertyZip: Yup.string()
      .matches(ZIP_VALIDATION_REGEX, 'Please enter a valid 5-digit ZIP code')
      .required('ZIP code is required'),
    additionalInfoOutstandingLoan: Yup.string().required('Outstanding Total Loan Balance on Subject Property is required'),
    additionalInfoEstimatedValue: Yup.string().required('Estimated Value of Property is required'),
    propertyType: Yup.string().required('Property type is required'),
    additionalInfoLive2Years: Yup.string().when('propertyUsage', {
      is: 'primaryResidence',
      then: () => Yup.string().required('This field is required'),
      otherwise: () => Yup.string()
    }),

    // Conditional property address fields
    additionalInfoPropertyStreet: Yup.string().when(['propertyUsage', 'additionalInfoLive2Years'], {
      is: (propertyUsage: string, live2Years: string) =>
        propertyUsage === 'secondHome' || propertyUsage === 'investment' ||
        (propertyUsage === 'primaryResidence' && live2Years === 'no'),
      then: () => Yup.string().required('Street address is required'),
      otherwise: () => Yup.string()
    }),
    additionalInfoPropertyCity: Yup.string().when(['propertyUsage', 'additionalInfoLive2Years'], {
      is: (propertyUsage: string, live2Years: string) =>
        propertyUsage === 'secondHome' || propertyUsage === 'investment' ||
        (propertyUsage === 'primaryResidence' && live2Years === 'no'),
      then: () => Yup.string().required('City is required'),
      otherwise: () => Yup.string()
    }),
    additionalInfoPropertyState: Yup.string().when(['propertyUsage', 'additionalInfoLive2Years'], {
      is: (propertyUsage: string, live2Years: string) =>
        propertyUsage === 'secondHome' || propertyUsage === 'investment' ||
        (propertyUsage === 'primaryResidence' && live2Years === 'no'),
      then: () => Yup.string().required('State is required'),
      otherwise: () => Yup.string()
    }),
    additionalInfoPropertyZip: Yup.string().when(['propertyUsage', 'additionalInfoLive2Years'], {
      is: (propertyUsage: string, live2Years: string) =>
        propertyUsage === 'secondHome' || propertyUsage === 'investment' ||
        (propertyUsage === 'primaryResidence' && live2Years === 'no'),
      then: () => Yup.string().matches(ZIP_VALIDATION_REGEX, 'Please enter a valid 5-digit ZIP code'),
      otherwise: () => Yup.string()
    }),
    additionalInfoPropertyType: Yup.string().when(['propertyUsage', 'additionalInfoLive2Years'], {
      is: (propertyUsage: string, live2Years: string) =>
        propertyUsage === 'secondHome' || propertyUsage === 'investment' ||
        (propertyUsage === 'primaryResidence' && live2Years === 'no'),
      then: () => Yup.string().required('Property type is required'),
      otherwise: () => Yup.string()
    }),

    // Application Information
    applicationType: Yup.string().required('Application type is required'),
    jointBorrowerLivesWithApplicant: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('This field is required'),
      otherwise: () => Yup.string()
    }),

    // Joint borrower fields (conditional on application type)
    jointFirstName: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('Joint borrower first name is required'),
      otherwise: () => Yup.string()
    }),
    jointLastName: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('Joint borrower last name is required'),
      otherwise: () => Yup.string()
    }),
    jointPhone: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => createCrossFieldValidation('phone', 'Joint borrower phone must be different from applicant phone')
        .matches(PHONE_VALIDATION_REGEX, 'Please enter a valid US phone number')
        .required('Joint borrower phone number is required'),
      otherwise: () => Yup.string()
    }),
    jointEmail: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => createCrossFieldValidation('email', 'Joint borrower email must be different from applicant email')
        .email('Please enter a valid email address')
        .required('Joint borrower email is required'),
      otherwise: () => Yup.string()
    }),
    jointSsn: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => createCrossFieldValidation('ssn', 'Joint borrower SSN must be different from applicant SSN')
        .matches(SSN_VALIDATION_REGEX, 'Please enter a valid 9-digit SSN')
        .required('Joint borrower 9 digits of SSN is required'),
      otherwise: () => Yup.string()
    }),
    jointDob: Yup.date().when('applicationType', {
      is: 'JOINT',
      then: () => createAgeValidation(18, 150).required('Joint borrower date of birth is required'),
      otherwise: () => Yup.date()
    }),
    jointMaritalStatus: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('Joint borrower marital status is required'),
      otherwise: () => Yup.string()
    }),
    jointCitizenship: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('Joint borrower citizenship is required'),
      otherwise: () => Yup.string()
    }),

    // Income Information
    additionalInfoSourceOfIncome: Yup.array().min(1, 'Source of income is required').required('Source of income is required'),
    additionalInfoSourceName: Yup.string().required('Employer/Source name is required'),
    additionalInfoPositionTitle: Yup.string(),
    additionalInfoSourceStartDate: Yup.date().max(new Date(), 'Start date cannot be in the future'),
    additionalInfoSourceStreet: Yup.string(),
    additionalInfoSourceUnitNumber: Yup.string(),
    additionalInfoSourceCity: Yup.string(),
    additionalInfoSourceState: Yup.string(),
    additionalInfoSourceZip: Yup.string().matches(ZIP_VALIDATION_REGEX, 'Please enter a valid 5-digit ZIP code'),

    // Previous employer (conditional on worked 2 years computed field)
    additionalInfoPreviousEmployerName: Yup.string(),
    additionalInfoPreviousEmployerPositionTitle: Yup.string(),
    additionalInfoPreviousEmployerStartDate: Yup.date(),
    additionalInfoPreviousEmployerEndDate: Yup.date(),

    // Co-borrower income fields (conditional on application type)
    coAdditionalInfoSourceOfIncome: Yup.array().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.array().min(1, 'Co-borrower source of income is required').required('Co-borrower source of income is required'),
      otherwise: () => Yup.array()
    }),
    coAdditionalInfoSourceName: Yup.string().when('applicationType', {
      is: 'JOINT',
      then: () => Yup.string().required('Co-borrower employer/source name is required'),
      otherwise: () => Yup.string()
    }),
  });
};

// Initial form values
const createInitialValues = () => {
  const defaultDate = subDays(subYears(new Date(), 18), 1);

  return {
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    dob: defaultDate,
    maritalStatus: '',
    citizenship: '',

    // Property Information
    propertyUsage: '',
    propertyStreet: '',
    propertyApartmentNumber: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    additionalInfoOutstandingLoan: '',
    additionalInfoEstimatedValue: '',
    propertyType: '',
    additionalInfoLive2Years: '',

    // Additional property address fields
    additionalInfoPropertyStreet: '',
    additionalInfoPropertyApartmentNumber: '',
    additionalInfoPropertyCity: '',
    additionalInfoPropertyState: '',
    additionalInfoPropertyZip: '',
    additionalInfoPropertyType: '',

    // Application Information
    applicationType: '',
    jointBorrowerLivesWithApplicant: '',

    // Joint borrower fields
    jointFirstName: '',
    jointLastName: '',
    jointPhone: '',
    jointEmail: '',
    jointSsn: '',
    jointDob: defaultDate,
    jointMaritalStatus: '',
    jointCitizenship: '',

    // Income Information
    additionalInfoSourceOfIncome: [],
    additionalInfoSourceName: '',
    additionalInfoPositionTitle: '',
    additionalInfoSourceStartDate: null,
    additionalInfoSourceStreet: '',
    additionalInfoSourceUnitNumber: '',
    additionalInfoSourceCity: '',
    additionalInfoSourceState: '',
    additionalInfoSourceZip: '',
    additionalInfoWorked2Years: 'no',
    additionalInfo25PercentOwner: '',

    // Previous employer
    additionalInfoPreviousEmployerName: '',
    additionalInfoPreviousEmployerPositionTitle: '',
    additionalInfoPreviousEmployerStartDate: null,
    additionalInfoPreviousEmployerEndDate: null,
    additionalInfoPreviousEmployerStreet: '',
    additionalInfoPreviousEmployerApartmentNumber: '',
    additionalInfoPreviousEmployerCity: '',
    additionalInfoPreviousEmployerState: '',
    additionalInfoPreviousEmployerZip: '',

    // Co-borrower income fields
    coAdditionalInfoSourceOfIncome: [],
    coAdditionalInfoSourceName: '',
    coAdditionalInfoPositionTitle: '',
    coAdditionalInfoSourceStartDate: null,
    coAdditionalInfoSourceStreet: '',
    coAdditionalInfoSourceUnitNumber: '',
    coAdditionalInfoSourceCity: '',
    coAdditionalInfoSourceState: '',
    coAdditionalInfoSourceZip: '',
    coAdditionalInfoWorked2Years: 'no',
    coAdditionalInfo25PercentOwner: '',

    // Co-borrower previous employer
    coAdditionalInfoPreviousEmployerName: '',
    coAdditionalInfoPreviousEmployerPositionTitle: '',
    coAdditionalInfoPreviousEmployerStartDate: null,
    coAdditionalInfoPreviousEmployerEndDate: null,
    coAdditionalInfoPreviousEmployerStreet: '',
    coAdditionalInfoPreviousEmployerApartmentNumber: '',
    coAdditionalInfoPreviousEmployerCity: '',
    coAdditionalInfoPreviousEmployerState: '',
    coAdditionalInfoPreviousEmployerZip: '',
  };
};

// Form steps configuration
const steps: FormStepConfig[] = [
  {
    id: "personalInformation",
    label: "Personal Information",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        grid: { xs: 12, sm: 6 },
        required: true,
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        grid: { xs: 12, sm: 6 },
        required: true,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        grid: { xs: 12 },
        required: true,
      },
      {
        name: "phone",
        type: "text",
        label: "Phone",
        required: true,
      },
      {
        name: "ssn",
        type: "password",
        label: "9 digits of SSN",
        grid: { xs: 12, sm: 6 },
        required: true,
      },
      {
        name: "dob",
        type: "date",
        label: "Date of Birth",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        required: true,
        otherProps: {
          maxDate: subDays(subYears(new Date(), 18), 1),
          minDate: subYears(new Date(), 150),
        },
        defaultValue: subDays(subYears(new Date(), 18), 1),
      },
      {
        name: "maritalStatus",
        type: "select",
        label: "Marital Status",
        grid: { xs: 12 },
        options: [
          { value: "married", label: "Married" },
          { value: "unmarried", label: "Unmarried" },
          { value: "separated", label: "Separated" },
        ],
        required: true,
      },
      {
        name: "citizenship",
        type: "select",
        label: "Citizenship",
        grid: { xs: 12 },
        options: [
          { value: "us_citizen", label: "U.S. Citizen" },
          { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "propertyInformation",
    label: "Property Information",
    fields: [
      {
        name: "propertyUsage",
        type: "select",
        label: "Property Usage",
        grid: { xs: 12 },
        options: [
          { value: propertyUsageType.PRIMARY_RESIDENCE, label: "Primary Residence" },
          { value: propertyUsageType.SECOND_HOME, label: "Second Home" },
          { value: propertyUsageType.INVESTMENT, label: "Investment" }
        ],
        required: true,
      },
      {
        name: "propertyStreet",
        type: "text",
        label: "Street",
        grid: { xs: 12 },
        required: true,
      },
      {
        name: "propertyApartmentNumber",
        type: "text",
        label: "Apt or Unit #",
        grid: { xs: 12, sm: 6 },
      },
      {
        name: "propertyCity",
        type: "text",
        label: "City",
        grid: { xs: 12, sm: 6 },
        required: true,
      },
      {
        name: "propertyState",
        type: "select",
        label: "State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
        required: true,
      },
      {
        name: "propertyZip",
        type: "text",
        label: "ZIP",
        grid: { xs: 12, sm: 6 },
        required: true,
      },
      {
        name: "additionalInfoOutstandingLoan",
        type: "text",
        label: "Outstanding Total Loan Balance on Subject Property",
        formType: "amount",
        inputProps: {
          startadornment: "$",
        },
        grid: { xs: 12 },
        required: true,
      },
      {
        name: "additionalInfoEstimatedValue",
        type: "text",
        label: "Estimated Value of Property",
        formType: "amount",
        inputProps: {
          startadornment: "$",
        },
        grid: { xs: 12 },
        required: true,
      },
      {
        name: "propertyType",
        type: "select",
        label: "Property Type",
        grid: { xs: 12 },
        options: PROPERTY_TYPE_OPTIONS,
        required: true,
      },
      {
        name: "additionalInfoLive2Years",
        type: "radio",
        label: "Have you lived at this property for 2 years?",
        grid: { xs: 12 },
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        conditions: [
          {
            "===": [{ var: "propertyUsage" }, "primaryResidence"]
          }
        ],
        required: true,
      },
      // Conditional fields for current/previous address
      {
        name: "additionalInfoCurrentAddress",
        type: "label",
        label: "Current Address",
        text: "Current Address",
        grid: { xs: 12 },
        conditions: [
          {
            or: [
              { "===": [{ var: "propertyUsage" }, "secondHome"] },
              { "===": [{ var: "propertyUsage" }, "investment"] }
            ]
          }
        ],
      },
      {
        name: "additionalInfoPreviousAddress",
        type: "label",
        label: "Previous Address",
        text: "Previous Address",
        grid: { xs: 12 },
        conditions: [
          {
            and: [
              { "===": [{ var: "propertyUsage" }, "primaryResidence"] },
              { "===": [{ var: "additionalInfoLive2Years" }, "no"] }
            ]
          }
        ],
      },
      // Additional property address fields (conditional)
      {
        name: "additionalInfoPropertyStreet",
        type: "text",
        label: "Street",
        grid: { xs: 12 },
        conditions: [
          {
            or: [
              {
                or: [
                  { "===": [{ var: "propertyUsage" }, "secondHome"] },
                  { "===": [{ var: "propertyUsage" }, "investment"] }
                ]
              },
              {
                and: [
                  { "===": [{ var: "propertyUsage" }, "primaryResidence"] },
                  { "===": [{ var: "additionalInfoLive2Years" }, "no"] }
                ]
              }
            ]
          }
        ],
        required: true,
      },
      // ... rest of conditional property fields
    ],
  },
  {
    id: "applicationInformation",
    label: "Application Information",
    fields: [
      {
        name: "applicationType",
        type: "radio",
        label: "Application Type",
        grid: { xs: 12 },
        options: [
          { value: BorrowerApplicationTypeEnum.JOINT, label: "Joint" },
          { value: BorrowerApplicationTypeEnum.INDIVIDUAL, label: "Individual" }
        ],
        required: true,
      },
      {
        name: "jointBorrowerLivesWithApplicant",
        type: "radio",
        label: "Does the joint borrower live with the applicant?",
        grid: { xs: 12 },
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        conditions: [
          {
            "===": [{ var: "applicationType" }, "JOINT"]
          }
        ],
        required: true,
      },
      // Joint borrower fields
      {
        name: "jointFirstName",
        type: "text",
        label: "Joint Borrower First Name",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            "===": [{ var: "applicationType" }, "JOINT"]
          }
        ],
        required: true,
      },
      {
        name: "jointLastName",
        type: "text",
        label: "Joint Borrower Last Name",
        grid: { xs: 12, sm: 6 },
        conditions: [
          {
            "===": [{ var: "applicationType" }, "JOINT"]
          }
        ],
        required: true,
      },
      // ... rest of joint borrower fields
    ],
  },
  {
    id: "incomeInformation",
    label: "Income Information",
    fields: [
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
        required: true,
      },
      {
        name: "additionalInfoSourceName",
        type: "text",
        label: "Employer/Source Name",
        grid: { xs: 12 },
        required: true,
      },
      // ... rest of income fields
    ],
  },
  {
    id: "coIncomeInformation",
    label: "Co-Borrower Income Information",
    fields: [
      {
        name: "coAdditionalInfoSourceOfIncome",
        type: "multi",
        label: "Co-Borrower Source of Income",
        grid: { xs: 12 },
        options: [
          { value: "salary_or_wages", label: "Salary or Wages" },
          { value: "business_owner_or_self_employed", label: "Business Owner or Self Employed" },
          { value: "other_sources", label: "Other Sources" }
        ],
        required: true,
      },
      {
        name: "coAdditionalInfoSourceName",
        type: "text",
        label: "Co-Borrower Employer/Source Name",
        grid: { xs: 12 },
        required: true,
      },
      {
        name: "coAdditionalInfoPositionTitle",
        type: "text",
        label: "Co-Borrower Position/Title",
        grid: { xs: 12, sm: 6 },
      },
      {
        name: "coAdditionalInfoSourceStartDate",
        type: "date",
        label: "Co-Borrower Start Date",
        orientation: "portrait",
        grid: { xs: 12, sm: 6 },
        otherProps: {
          maxDate: new Date(),
        },
      },
      {
        name: "coAdditionalInfoSourceStreet",
        type: "text",
        label: "Co-Borrower Employer Street Address",
        grid: { xs: 12 },
      },
      {
        name: "coAdditionalInfoSourceUnitNumber",
        type: "text",
        label: "Co-Borrower Employer Unit Number",
        grid: { xs: 12, sm: 6 },
      },
      {
        name: "coAdditionalInfoSourceCity",
        type: "text",
        label: "Co-Borrower Employer City",
        grid: { xs: 12, sm: 6 },
      },
      {
        name: "coAdditionalInfoSourceState",
        type: "select",
        label: "Co-Borrower Employer State",
        grid: { xs: 12, sm: 6 },
        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
      },
      {
        name: "coAdditionalInfoSourceZip",
        type: "text",
        label: "Co-Borrower Employer ZIP Code",
        grid: { xs: 12, sm: 6 },
      },
      {
        name: "coAdditionalInfo25PercentOwner",
        type: "radio",
        label: "Does the co-borrower own 25% or more of the business?",
        grid: { xs: 12 },
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        conditions: [
          {
            contains: [
              { var: "coAdditionalInfoSourceOfIncome" },
              "business_owner_or_self_employed"
            ]
          }
        ],
      },
      // Previous employer fields for co-borrower would go here...
    ],
    conditions: [
      {
        "===": [{ var: "applicationType" }, "JOINT"]
      }
    ],
  },
];

// Export the complete configuration
export const getUserRegistrationStepsConfig = (): FormikStepFormConfig => {
  return {
    title: "User Registration (Step-based Config) - Formik",
    description: "Step-based configuration using Formik with Yup validation",
    steps,
    validationSchema: createValidationSchema(),
    initialValues: createInitialValues(),
    submitButtonText: "Create Account",
    resetButtonText: "Clear",
    onSubmit: async (values: any) => {
      console.log('Form submitted with values:', values);
      alert('User registration submitted successfully!');
    }
  };
};

export default getUserRegistrationStepsConfig;