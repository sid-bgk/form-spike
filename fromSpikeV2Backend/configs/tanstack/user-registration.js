module.exports = {
  version: 1,
  form: {
    title: 'User Registration (Config File) - tanstack',
    description: 'Config served from backend file system',
    submitButtonText: 'Create Account',
    resetButtonText: 'Clear',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Jane' },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'jane@example.com' },
      { name: 'acceptTos', label: 'I agree to the Terms', type: 'checkbox' },
    ],
  },
}

