// Required imports for validation patterns and constants
const { subDays, subYears } = require("date-fns");

// TODO: Import from external data files when available
// const { US_STATES } = require("../data/property.data");
// const { formIds, PHONE_VALIDATION_REGEX } = require("../data/formConfig.data");
// const { BorrowerApplicationTypeEnum, PropertyTypeEnum, propertyUsageType } = require("../data/application-misc.data");

// Validation patterns and regex constants
const PHONE_VALIDATION_REGEX = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const SSN_VALIDATION_REGEX = '^\\d{9}$';
const ZIP_VALIDATION_REGEX = /^\d{5}$/;

// Form IDs (local definition until external import is available)
const formIds = {
    USER_REGISTRATION: "user-registration-steps"
};

// Borrower Application Type Enum (local definition until external import is available)
const BorrowerApplicationTypeEnum = {
    JOINT: "JOINT",
    INDIVIDUAL: "INDIVIDUAL"
};

// Property Type Enum (local definition until external import is available)
const PropertyTypeEnum = {
    SINGLE_FAMILY_RESIDENCE: "single_family_residence",
    CONDO: "condo",
    TWO_TO_FOUR_UNIT_DB: "two_to_four_unit_db",
    PUD: "pud",
    OTHER: "other"
};

// Property Usage Type (local definition until external import is available)
const propertyUsageType = {
    PRIMARY_RESIDENCE: "primaryResidence",
    SECOND_HOME: "secondHome",
    INVESTMENT: "investment"
};

// US States data (simplified version for this config)
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

// Property type options using PropertyTypeEnum
const PROPERTY_TYPE_OPTIONS = [
    { value: PropertyTypeEnum.SINGLE_FAMILY_RESIDENCE, label: "Single Family Residence" },
    { value: PropertyTypeEnum.CONDO, label: "Condominium" },
    { value: PropertyTypeEnum.TWO_TO_FOUR_UNIT_DB, label: "2-4 Unit Duplex/Triplex/Fourplex" },
    { value: PropertyTypeEnum.PUD, label: "Planned Unit Development (PUD)" },
    { value: PropertyTypeEnum.OTHER, label: "Other" }
];

// Custom validation rules for cross-field validation
const CUSTOM_VALIDATION_RULES = {
    notEqualToPhone: {
        validate: (value, formData) => {
            if (!value || !formData.phone) return true;
            return value !== formData.phone;
        },
        message: "Joint borrower phone must be different from applicant phone"
    },
    notEqualToEmail: {
        validate: (value, formData) => {
            if (!value || !formData.email) return true;
            return value !== formData.email;
        },
        message: "Joint borrower email must be different from applicant email"
    },
    notEqualToSSN: {
        validate: (value, formData) => {
            if (!value || !formData.ssn) return true;
            return value !== formData.ssn;
        },
        message: "Joint borrower SSN must be different from applicant SSN"
    }
};

module.exports = {
    version: 1,
    validationPatterns: {
        PHONE_VALIDATION_REGEX,
        SSN_VALIDATION_REGEX,
        ZIP_VALIDATION_REGEX
    },
    customValidationRules: CUSTOM_VALIDATION_RULES,
    form: {
        title: "User Registration (Step-based Config) - TanStack",
        description: "Step-based configuration served from backend file system",
        submitButtonText: "Create Account",
        resetButtonText: "Clear",
        steps: [
            {
                label: "Personal Information",
                id: "personalInformation",
                fields: [
                    {
                        name: "firstName",
                        type: "text",
                        label: "First Name",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            required: "First name is required",
                        },
                    },
                    {
                        name: "lastName",
                        type: "text",
                        label: "Last Name",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            required: "Last name is required",
                        },
                    },
                    {
                        name: "email",
                        type: "text",
                        label: "Email",
                        grid: { xs: 12 },
                        validation: {
                            required: "Email is required",
                            email: "Please enter a valid email address",
                        },
                    },
                    {
                        name: "phone",
                        type: "text",
                        label: "Phone",
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
                        name: "ssn",
                        type: "password",
                        label: "9 digits of SSN",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            required: "9 digits of SSN is required",
                            matches: {
                                pattern: SSN_VALIDATION_REGEX,
                                message: "Please enter a valid 9-digit SSN",
                            },
                        },
                    },
                    {
                        name: "dob",
                        type: "date",
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
                        name: "maritalStatus",
                        type: "dropdown",
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
                        name: "citizenship",
                        type: "dropdown",
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
                id: "propertyInformation",
                fields: [
                    {
                        name: "propertyUsage",
                        type: "dropdown",
                        label: "Property Usage",
                        grid: { xs: 12 },
                        options: [
                            { value: propertyUsageType.PRIMARY_RESIDENCE, label: "Primary Residence" },
                            { value: propertyUsageType.SECOND_HOME, label: "Second Home" },
                            { value: propertyUsageType.INVESTMENT, label: "Investment" }
                        ],
                        validation: {
                            required: "Property usage is required",
                        },
                    },
                    {
                        name: "propertyStreet",
                        type: "text",
                        label: "Street",
                        grid: { xs: 12 },
                        validation: {
                            required: "Street address is required",
                        },
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
                        validation: {
                            required: "City is required",
                        },
                    },
                    {
                        name: "propertyState",
                        type: "dropdown",
                        label: "State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
                        validation: {
                            required: "State is required",
                        },
                    },
                    {
                        name: "propertyZip",
                        type: "text",
                        label: "ZIP",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            required: "ZIP code is required",
                            matches: {
                                pattern: ZIP_VALIDATION_REGEX,
                                message: "Please enter a valid 5-digit ZIP code",
                            },
                        },
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
                        validation: {
                            required: "Outstanding Total Loan Balance on Subject Property is required",
                        },
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
                        validation: {
                            required: "Estimated Value of Property is required",
                        },
                    },
                    {
                        name: "propertyType",
                        type: "dropdown",
                        label: "Property Type",
                        grid: { xs: 12 },
                        options: PROPERTY_TYPE_OPTIONS,
                        validation: {
                            required: "Property type is required",
                        },
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
                        validation: {
                            required: "This field is required",
                        },
                    },
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
                        validation: {
                            required: "Street address is required",
                        },
                    },
                    {
                        name: "additionalInfoPropertyApartmentNumber",
                        type: "text",
                        label: "Apt or Unit #",
                        grid: { xs: 12, sm: 6 },
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
                    },
                    {
                        name: "additionalInfoPropertyCity",
                        type: "text",
                        label: "City",
                        grid: { xs: 12, sm: 6 },
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
                        validation: {
                            required: "City is required",
                        },
                    },
                    {
                        name: "additionalInfoPropertyState",
                        type: "dropdown",
                        label: "State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
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
                        validation: {
                            required: "State is required",
                        },
                    },
                    {
                        name: "additionalInfoPropertyZip",
                        type: "text",
                        label: "ZIP",
                        grid: { xs: 12, sm: 6 },
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
                        validation: {
                            matches: {
                                pattern: ZIP_VALIDATION_REGEX,
                                message: "Please enter a valid 5-digit ZIP code",
                            },
                        },
                    },
                    {
                        name: "additionalInfoPropertyType",
                        type: "dropdown",
                        label: "Property Type",
                        grid: { xs: 12 },
                        options: PROPERTY_TYPE_OPTIONS,
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
                        validation: {
                            required: "Property type is required",
                        },
                    },
                ],
            },
            {
                label: "Application Information",
                id: "applicationInformation",
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
                        validation: {
                            required: "Application type is required",
                        },
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
                        validation: {
                            required: "This field is required",
                        },
                    },
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
                        validation: {
                            required: "Joint borrower first name is required",
                        },
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
                        validation: {
                            required: "Joint borrower last name is required",
                        },
                    },
                    {
                        name: "jointPhone",
                        type: "text",
                        label: "Joint Borrower Phone",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower phone number is required",
                            matches: {
                                pattern: PHONE_VALIDATION_REGEX,
                                message: "Please enter a valid phone number",
                            },
                            phoneUS: "Please enter a valid US phone number",
                            notEqualToPhone: "Joint borrower phone must be different from applicant phone",
                        },
                    },
                    {
                        name: "jointEmail",
                        type: "text",
                        label: "Joint Borrower Email",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower email is required",
                            email: "Please enter a valid email address",
                            notEqualToEmail: "Joint borrower email must be different from applicant email",
                        },
                    },
                    {
                        name: "jointSsn",
                        type: "password",
                        label: "Joint Borrower 9 digits of SSN",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower 9 digits of SSN is required",
                            matches: {
                                pattern: SSN_VALIDATION_REGEX,
                                message: "Please enter a valid 9-digit SSN",
                            },
                            notEqualToSSN: "Joint borrower SSN must be different from applicant SSN",
                        },
                    },
                    {
                        name: "jointDob",
                        type: "date",
                        label: "Joint Borrower Date of Birth",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower date of birth is required",
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
                        name: "jointMaritalStatus",
                        type: "dropdown",
                        label: "Joint Borrower Marital Status",
                        grid: { xs: 12 },
                        options: [
                            { value: "married", label: "Married" },
                            { value: "unmarried", label: "Unmarried" },
                            { value: "separated", label: "Separated" },
                        ],
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower marital status is required",
                        },
                    },
                    {
                        name: "jointCitizenship",
                        type: "dropdown",
                        label: "Joint Borrower Citizenship",
                        grid: { xs: 12 },
                        options: [
                            { value: "us_citizen", label: "U.S. Citizen" },
                            { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
                        ],
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Joint borrower citizenship is required",
                        },
                    },
                ],
            },
            {
                label: "Income Information",
                id: "incomeInformation",
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
                        validation: {
                            required: "Source of income is required",
                        },
                    },
                    {
                        name: "additionalInfoSourceName",
                        type: "text",
                        label: "Employer/Source Name",
                        grid: { xs: 12 },
                        validation: {
                            required: "Employer/Source name is required",
                        },
                    },
                    {
                        name: "additionalInfoPositionTitle",
                        type: "text",
                        label: "Position/Title",
                        grid: { xs: 12, sm: 6 },
                    },
                    {
                        name: "additionalInfoSourceStartDate",
                        type: "date",
                        label: "Start Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            compareDates: [
                                {
                                    today: true,
                                    operator: "<",
                                    message: "Start date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "additionalInfoSourceStreet",
                        type: "text",
                        label: "Street Address",
                        grid: { xs: 12 },
                    },
                    {
                        name: "additionalInfoSourceUnitNumber",
                        type: "text",
                        label: "Unit Number",
                        grid: { xs: 12, sm: 6 },
                    },
                    {
                        name: "additionalInfoSourceCity",
                        type: "text",
                        label: "City",
                        grid: { xs: 12, sm: 6 },
                    },
                    {
                        name: "additionalInfoSourceState",
                        type: "dropdown",
                        label: "State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
                    },
                    {
                        name: "additionalInfoSourceZip",
                        type: "text",
                        label: "ZIP Code",
                        grid: { xs: 12, sm: 6 },
                        validation: {
                            matches: {
                                pattern: ZIP_VALIDATION_REGEX,
                                message: "Please enter a valid 5-digit ZIP code",
                            },
                        },
                    },
                    {
                        name: "additionalInfoWorked2Years",
                        type: "hidden",
                        label: "Worked 2+ Years (Computed)",
                        defaultValue: "no",
                        computeValue: {
                            if: [
                                {
                                    ">=": [{ dateDiffInYears: [{ var: "additionalInfoSourceStartDate" }, { CURRENT_DATE: [] }] }, 2]
                                },
                                "yes",
                                "no"
                            ]
                        }
                    },
                    {
                        name: "additionalInfo25PercentOwner",
                        type: "radio",
                        label: "Do you own 25% or more of the business?",
                        grid: { xs: 12 },
                        options: [
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" }
                        ],
                        conditions: [
                            {
                                contains: [
                                    { var: "additionalInfoSourceOfIncome" },
                                    "business_owner_or_self_employed"
                                ]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerText",
                        type: "label",
                        label: "Previous Employer Information",
                        text: "Please provide previous employer name and address",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerName",
                        type: "text",
                        label: "Previous Employer Name",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                        validation: {
                            required: "Previous employer name is required",
                        },
                    },
                    {
                        name: "additionalInfoPreviousEmployerPositionTitle",
                        type: "text",
                        label: "Previous Position/Title",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerStartDate",
                        type: "date",
                        label: "Previous Employment Start Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                        validation: {
                            compareDates: [
                                {
                                    field: "additionalInfoSourceStartDate",
                                    operator: "<",
                                    message: "Start date must be before Primary income start date"
                                },
                                {
                                    field: "additionalInfoPreviousEmployerEndDate",
                                    operator: "<",
                                    message: "Start date must be before End Date"
                                },
                                {
                                    today: true,
                                    operator: "<",
                                    message: "Start date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "additionalInfoPreviousEmployerEndDate",
                        type: "date",
                        label: "Previous Employment End Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                        validation: {
                            compareDates: [
                                {
                                    field: "additionalInfoSourceStartDate",
                                    operator: "<",
                                    message: "End date must be before Primary income start date"
                                },
                                {
                                    field: "additionalInfoPreviousEmployerStartDate",
                                    operator: ">",
                                    message: "End date must be after start Date"
                                },
                                {
                                    today: true,
                                    operator: "<",
                                    message: "End date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "additionalInfoPreviousEmployerStreet",
                        type: "text",
                        label: "Previous Employer Street Address",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerApartmentNumber",
                        type: "text",
                        label: "Previous Employer Unit Number",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerCity",
                        type: "text",
                        label: "Previous Employer City",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerState",
                        type: "dropdown",
                        label: "Previous Employer State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                    {
                        name: "additionalInfoPreviousEmployerZip",
                        type: "text",
                        label: "Previous Employer ZIP Code",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "additionalInfoWorked2Years" }, "no"]
                            }
                        ],
                    },
                ],
            },
            {
                label: "Co-Borrower Income Information",
                id: "coIncomeInformation",
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
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Co-borrower source of income is required",
                        },
                    },
                    {
                        name: "coAdditionalInfoSourceName",
                        type: "text",
                        label: "Co-Borrower Employer/Source Name",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            required: "Co-borrower employer/source name is required",
                        },
                    },
                    {
                        name: "coAdditionalInfoPositionTitle",
                        type: "text",
                        label: "Co-Borrower Position/Title",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoSourceStartDate",
                        type: "date",
                        label: "Co-Borrower Start Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            compareDates: [
                                {
                                    today: true,
                                    operator: "<",
                                    message: "Start date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "coAdditionalInfoSourceStreet",
                        type: "text",
                        label: "Co-Borrower Employer Street Address",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoSourceUnitNumber",
                        type: "text",
                        label: "Co-Borrower Employer Unit Number",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoSourceCity",
                        type: "text",
                        label: "Co-Borrower Employer City",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoSourceState",
                        type: "dropdown",
                        label: "Co-Borrower Employer State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoSourceZip",
                        type: "text",
                        label: "Co-Borrower Employer ZIP Code",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        validation: {
                            matches: {
                                pattern: ZIP_VALIDATION_REGEX,
                                message: "Please enter a valid 5-digit ZIP code",
                            },
                        },
                    },
                    {
                        name: "coAdditionalInfoWorked2Years",
                        type: "hidden",
                        label: "Co-Borrower Worked 2+ Years (Computed)",
                        defaultValue: "no",
                        conditions: [
                            {
                                "===": [{ var: "applicationType" }, "JOINT"]
                            }
                        ],
                        computeValue: {
                            if: [
                                {
                                    ">=": [{ dateDiffInYears: [{ var: "coAdditionalInfoSourceStartDate" }, { CURRENT_DATE: [] }] }, 2]
                                },
                                "yes",
                                "no"
                            ]
                        }
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
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    {
                                        contains: [
                                            { var: "coAdditionalInfoSourceOfIncome" },
                                            "business_owner_or_self_employed"
                                        ]
                                    }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerText",
                        type: "label",
                        label: "Co-Borrower Previous Employer Information",
                        text: "Please provide co-borrower previous employer name and address",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerName",
                        type: "text",
                        label: "Co-Borrower Previous Employer Name",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                        validation: {
                            required: "Co-borrower previous employer name is required",
                        },
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerPositionTitle",
                        type: "text",
                        label: "Co-Borrower Previous Position/Title",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerStartDate",
                        type: "date",
                        label: "Co-Borrower Previous Employment Start Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                        validation: {
                            compareDates: [
                                {
                                    field: "coAdditionalInfoSourceStartDate",
                                    operator: "<",
                                    message: "Start date must be before Primary income start date"
                                },
                                {
                                    field: "coAdditionalInfoPreviousEmployerEndDate",
                                    operator: "<",
                                    message: "Start date must be before End Date"
                                },
                                {
                                    today: true,
                                    operator: "<",
                                    message: "Start date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerEndDate",
                        type: "date",
                        label: "Co-Borrower Previous Employment End Date",
                        orientation: "portrait",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                        validation: {
                            compareDates: [
                                {
                                    field: "coAdditionalInfoSourceStartDate",
                                    operator: "<",
                                    message: "End date must be before Primary income start date"
                                },
                                {
                                    field: "coAdditionalInfoPreviousEmployerStartDate",
                                    operator: ">",
                                    message: "End date must be after start Date"
                                },
                                {
                                    today: true,
                                    operator: "<",
                                    message: "End date cannot be in the future"
                                }
                            ]
                        },
                        otherProps: {
                            maxDate: new Date(),
                        },
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerStreet",
                        type: "text",
                        label: "Co-Borrower Previous Employer Street Address",
                        grid: { xs: 12 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerApartmentNumber",
                        type: "text",
                        label: "Co-Borrower Previous Employer Unit Number",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerCity",
                        type: "text",
                        label: "Co-Borrower Previous Employer City",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerState",
                        type: "dropdown",
                        label: "Co-Borrower Previous Employer State",
                        grid: { xs: 12, sm: 6 },
                        options: US_STATES.map((state) => ({ value: state.abbreviation, label: state.name })),
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                    {
                        name: "coAdditionalInfoPreviousEmployerZip",
                        type: "text",
                        label: "Co-Borrower Previous Employer ZIP Code",
                        grid: { xs: 12, sm: 6 },
                        conditions: [
                            {
                                and: [
                                    { "===": [{ var: "applicationType" }, "JOINT"] },
                                    { "===": [{ var: "coAdditionalInfoWorked2Years" }, "no"] }
                                ]
                            }
                        ],
                    },
                ],
            },
        ]
    }
};