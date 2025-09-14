import type { FormConfig } from '../types/form'

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
    accountType: 'personal'
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'First name is required'
          if (value.length < 2) return 'First name must be at least 2 characters'
          if (value.length > 50) return 'First name must be less than 50 characters'
          return undefined
        }
      }
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Last name is required'
          if (value.length < 2) return 'Last name must be at least 2 characters'
          if (value.length > 50) return 'Last name must be less than 50 characters'
          return undefined
        }
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Email is required'
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) return 'Please enter a valid email address'
          return undefined
        },
        onChangeAsync: async ({ value }) => {
          // Simulate API call to check if email exists
          await new Promise(resolve => setTimeout(resolve, 500))
          if (value === 'test@example.com') {
            return 'This email is already registered'
          }
          return undefined
        },
        onChangeAsyncDebounceMs: 300
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a secure password',
      required: true,
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Password is required'
          if (value.length < 8) return 'Password must be at least 8 characters'
          if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
          if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
          if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
          return undefined
        }
      }
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
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Age is required'
          if (value < 13) return 'You must be at least 13 years old'
          if (value > 120) return 'Please enter a valid age'
          return undefined
        }
      }
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
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Please select your country'
          return undefined
        }
      }
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      placeholder: 'Tell us about yourself (optional)',
      description: 'A brief description about yourself',
      validators: {
        onChange: ({ value }) => {
          if (value && value.length > 500) {
            return 'Biography must be less than 500 characters'
          }
          return undefined
        }
      }
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
      validators: {
        onChange: ({ value }) => {
          if (!value) return 'Please select an account type'
          return undefined
        }
      }
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
