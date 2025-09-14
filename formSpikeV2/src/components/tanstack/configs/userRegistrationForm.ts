import type { FormConfig } from '../types/form'
import { buildValidatorsForField } from '@/lib/validation'

interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  age: number
  country: string | undefined
  bio: string
  newsletter: boolean
  accountType: string
  phone: string
}

export const userRegistrationFormConfig: FormConfig<UserRegistrationData> = {
  title: 'User Registration',
  description: 'Create your account to get started',
  submitButtonText: 'Create Account',
  resetButtonText: 'Clear Form',
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 18,
    country: undefined,
    bio: '',
    newsletter: false,
    accountType: 'personal',
    phone: ''
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      validators: buildValidatorsForField(
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        {
          string: {
            trim: true,
            minLength: { value: 2, message: 'First name must be at least 2 characters' },
            maxLength: { value: 50, message: 'First name must be less than 50 characters' },
          },
        }
      ).validators
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      validators: buildValidatorsForField(
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        {
          string: {
            trim: true,
            minLength: { value: 2, message: 'Last name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Last name must be less than 50 characters' },
          },
        }
      ).validators
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
      validators: {
        ...buildValidatorsForField(
          { name: 'email', label: 'Email Address', type: 'email', required: true }
        ).validators,
        onChangeAsync: async ({ value }) => {
          // Simulate API call to check if email exists
          await new Promise(resolve => setTimeout(resolve, 500))
          if (value === 'test@example.com') {
            return 'This email is already registered'
          }
          return undefined
        },
        onChangeAsyncDebounceMs: 300,
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a secure password',
      required: true,
      validators: buildValidatorsForField(
        { name: 'password', label: 'Password', type: 'password', required: true },
        {
          string: { minLength: { value: 8, message: 'Password must be at least 8 characters' } },
          customize: (schema) =>
            schema
              .refine((v) => /(?=.*[a-z])/.test(v), 'Password must contain at least one lowercase letter')
              .refine((v) => /(?=.*[A-Z])/.test(v), 'Password must contain at least one uppercase letter')
              .refine((v) => /(?=.*\d)/.test(v), 'Password must contain at least one number'),
        }
      ).validators
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Please confirm your password'
          return undefined
        }
      }
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Enter your age',
      required: true,
      validators: buildValidatorsForField(
        { name: 'age', label: 'Age', type: 'number', required: true },
        { number: { int: true, min: { value: 13, message: 'You must be at least 13 years old' }, max: { value: 120, message: 'Please enter a valid age' } } }
      ).validators
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select your country',
      required: true,
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'jp', label: 'Japan' },
        { value: 'in', label: 'India' },
        { value: 'br', label: 'Brazil' }
      ],
      validators: buildValidatorsForField(
        { name: 'country', label: 'Country', type: 'select', required: true }
      ).validators
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      placeholder: 'Tell us about yourself (optional)',
      description: 'A brief description about yourself',
      validators: buildValidatorsForField(
        { name: 'bio', label: 'Biography', type: 'textarea', required: false },
        { string: { maxLength: { value: 500, message: 'Biography must be less than 500 characters' } } }
      ).validators
    },
    {
      name: 'newsletter',
      label: 'Subscribe to Newsletter',
      type: 'checkbox',
      description: 'Receive updates about new features and promotions'
    },
    {
      name: 'accountType',
      label: 'Account Type',
      type: 'radio',
      required: true,
      options: [
        { value: 'personal', label: 'Personal Account' },
        { value: 'business', label: 'Business Account' },
        { value: 'enterprise', label: 'Enterprise Account' }
      ],
      validators: buildValidatorsForField(
        { name: 'accountType', label: 'Account Type', type: 'radio', required: true }
      ).validators
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'US phone (e.g., 555-555-5555)',
      required: true,
      description: 'US-only format accepted',
      validators: buildValidatorsForField(
        { name: 'phone', label: 'Phone Number', type: 'text', required: true },
        { format: 'phoneUS', messages: { invalidPhoneUS: 'US phone only (e.g., 555-555-5555)' } }
      ).validators
    }
  ],
  onSubmit: async ({ value }) => {
    // Form-wide validation
    if (value.password !== value.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    console.log('Form submitted with data:', value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('Registration successful! Welcome to our platform.')
  }
}
