import type { FormConfig } from '../types/form'

interface CompanyRegistrationData {
  companyName: string
  legalName: string
  businessType: string | undefined
  registrationNumber: string
  taxId: string
  foundingDate: string
  employeeCount: string | undefined
  industry: string | undefined
  website: string
  primaryContact: {
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string | undefined
    zipCode: string
    country: string | undefined
  }
  description: string
  termsAccepted: boolean
}

export const companyRegistrationFormConfig: FormConfig<CompanyRegistrationData> = {
  title: 'Company Registration',
  description: 'Register your company with us to access business services',
  submitButtonText: 'Register Company',
  resetButtonText: 'Clear Form',
  defaultValues: {
    companyName: '',
    legalName: '',
    businessType: undefined,
    registrationNumber: '',
    taxId: '',
    foundingDate: '',
    employeeCount: undefined,
    industry: undefined,
    website: '',
    primaryContact: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      state: undefined,
      zipCode: '',
      country: undefined
    },
    description: '',
    termsAccepted: false
  },
  fields: [
    // Company Information
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter your company name',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Company name is required'
          if (value.length < 2) return 'Company name must be at least 2 characters'
          if (value.length > 100) return 'Company name must be less than 100 characters'
          return undefined
        }
      }
    },
    {
      name: 'legalName',
      label: 'Legal Company Name',
      type: 'text',
      placeholder: 'Enter legal company name (if different)',
      description: 'Official legal name as registered with authorities',
      validators: {
        onChange: ({ value }) => {
          if (value && value.length > 100) {
            return 'Legal name must be less than 100 characters'
          }
          return undefined
        }
      }
    },
    {
      name: 'businessType',
      label: 'Business Type',
      type: 'select',
      placeholder: 'Select business type',
      required: true,
      options: [
        { value: 'corporation', label: 'Corporation' },
        { value: 'llc', label: 'Limited Liability Company (LLC)' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
        { value: 'nonprofit', label: 'Non-Profit Organization' },
        { value: 'cooperative', label: 'Cooperative' },
        { value: 'other', label: 'Other' }
      ],
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Please select a business type'
          return undefined
        }
      }
    },
    {
      name: 'registrationNumber',
      label: 'Business Registration Number',
      type: 'text',
      placeholder: 'Enter business registration number',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Registration number is required'
          if (!/^[A-Z0-9-]+$/i.test(value)) return 'Registration number can only contain letters, numbers, and hyphens'
          return undefined
        }
      }
    },
    {
      name: 'taxId',
      label: 'Tax ID / EIN',
      type: 'text',
      placeholder: 'Enter tax identification number',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Tax ID is required'
          if (!/^\d{2}-\d{7}$/.test(value) && !/^\d{9}$/.test(value)) {
            return 'Tax ID must be in format XX-XXXXXXX or XXXXXXXXX'
          }
          return undefined
        }
      }
    },
    {
      name: 'foundingDate',
      label: 'Founding Date',
      type: 'text',
      placeholder: 'YYYY-MM-DD',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Founding date is required'
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (!dateRegex.test(value)) return 'Date must be in YYYY-MM-DD format'

          const date = new Date(value)
          const today = new Date()
          if (date > today) return 'Founding date cannot be in the future'
          if (date.getFullYear() < 1800) return 'Please enter a valid founding date'

          return undefined
        }
      }
    },
    {
      name: 'employeeCount',
      label: 'Number of Employees',
      type: 'select',
      placeholder: 'Select employee count range',
      options: [
        { value: '1', label: 'Just me (1)' },
        { value: '2-10', label: '2-10 employees' },
        { value: '11-50', label: '11-50 employees' },
        { value: '51-200', label: '51-200 employees' },
        { value: '201-500', label: '201-500 employees' },
        { value: '501-1000', label: '501-1000 employees' },
        { value: '1000+', label: '1000+ employees' }
      ]
    },
    {
      name: 'industry',
      label: 'Industry',
      type: 'select',
      placeholder: 'Select your industry',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance & Banking' },
        { value: 'retail', label: 'Retail & E-commerce' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'education', label: 'Education' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'hospitality', label: 'Hospitality & Tourism' },
        { value: 'agriculture', label: 'Agriculture' },
        { value: 'construction', label: 'Construction' },
        { value: 'media', label: 'Media & Entertainment' },
        { value: 'transportation', label: 'Transportation & Logistics' },
        { value: 'energy', label: 'Energy & Utilities' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'website',
      label: 'Company Website',
      type: 'text',
      placeholder: 'https://www.example.com',
      validators: {
        onChange: ({ value }) => {
          if (value) {
            const urlRegex = /^https?:\/\/.+\..+/
            if (!urlRegex.test(value)) return 'Please enter a valid website URL'
          }
          return undefined
        }
      }
    },

    // Primary Contact Information
    {
      name: 'primaryContact.firstName',
      label: 'Contact First Name',
      type: 'text',
      placeholder: 'Enter contact person first name',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Contact first name is required'
          if (value.length < 2) return 'First name must be at least 2 characters'
          return undefined
        }
      }
    },
    {
      name: 'primaryContact.lastName',
      label: 'Contact Last Name',
      type: 'text',
      placeholder: 'Enter contact person last name',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Contact last name is required'
          if (value.length < 2) return 'Last name must be at least 2 characters'
          return undefined
        }
      }
    },
    {
      name: 'primaryContact.title',
      label: 'Contact Title',
      type: 'text',
      placeholder: 'CEO, Founder, Manager, etc.',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Contact title is required'
          return undefined
        }
      }
    },
    {
      name: 'primaryContact.email',
      label: 'Contact Email',
      type: 'email',
      placeholder: 'contact@company.com',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Contact email is required'
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) return 'Please enter a valid email address'
          return undefined
        }
      }
    },
    {
      name: 'primaryContact.phone',
      label: 'Contact Phone',
      type: 'text',
      placeholder: '+1 (555) 123-4567',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Contact phone is required'
          const phoneRegex = /^[\+]?[\d\s\(\)\-]{10,}$/
          if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
          return undefined
        }
      }
    },

    // Address Information
    {
      name: 'address.street',
      label: 'Street Address',
      type: 'text',
      placeholder: 'Enter street address',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Street address is required'
          return undefined
        }
      }
    },
    {
      name: 'address.city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'City is required'
          return undefined
        }
      }
    },
    {
      name: 'address.state',
      label: 'State/Province',
      type: 'select',
      placeholder: 'Select state/province',
      options: [
        { value: 'AL', label: 'Alabama' },
        { value: 'CA', label: 'California' },
        { value: 'FL', label: 'Florida' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' },
        { value: 'WA', label: 'Washington' },
        { value: 'ON', label: 'Ontario' },
        { value: 'BC', label: 'British Columbia' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'address.zipCode',
      label: 'ZIP/Postal Code',
      type: 'text',
      placeholder: 'Enter ZIP or postal code',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'ZIP/Postal code is required'
          return undefined
        }
      }
    },
    {
      name: 'address.country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select country',
      required: true,
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'jp', label: 'Japan' },
        { value: 'other', label: 'Other' }
      ],
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Please select a country'
          return undefined
        }
      }
    },

    // Additional Information
    {
      name: 'description',
      label: 'Company Description',
      type: 'textarea',
      placeholder: 'Briefly describe your company, its mission, and main activities...',
      description: 'Tell us about your company (optional)',
      validators: {
        onChange: ({ value }) => {
          if (value && value.length > 1000) {
            return 'Description must be less than 1000 characters'
          }
          return undefined
        }
      }
    },

    // Terms and Conditions
    {
      name: 'termsAccepted',
      label: 'I agree to the Terms and Conditions and Privacy Policy',
      type: 'checkbox',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'You must accept the terms and conditions'
          return undefined
        }
      }
    }
  ],
  onSubmit: async ({ value }) => {
    console.log('Company registration submitted:', value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert(`Company "${value.companyName}" registered successfully! Welcome to our platform.`)
  }
}