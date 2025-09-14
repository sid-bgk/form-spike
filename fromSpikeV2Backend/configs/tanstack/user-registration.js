module.exports = {
  version: 1,
  form: {
    title: "User Registration (Config File) - tanstack",
    description: "Config served from backend file system",
    submitButtonText: "Create Account",
    resetButtonText: "Clear",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        validation: {
          required: "First name is required",
          minLength: { value: 2, message: "First name must be at least 2 characters" },
          maxLength: { value: 50, message: "First name cannot exceed 50 characters" },
          pattern: { value: "^[a-zA-Z\\s'-]+$", message: "First name can only contain letters, spaces, hyphens, and apostrophes" }
        },
        placeholder: "Jane",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        validation: {
          required: "Last name is required",
          minLength: { value: 2, message: "Last name must be at least 2 characters" },
          maxLength: { value: 50, message: "Last name cannot exceed 50 characters" },
          pattern: { value: "^[a-zA-Z\\s'-]+$", message: "Last name can only contain letters, spaces, hyphens, and apostrophes" }
        },
        placeholder: "Doe",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "30",
        validation: {
          required: "Age is required",
          min: { value: 13, message: "You must be at least 13 years old" },
          max: { value: 120, message: "Please enter a valid age" }
        }
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        validation: {
          required: "Email address is required",
          email: "Please enter a valid email address",
          maxLength: { value: 100, message: "Email address cannot exceed 100 characters" }
        },
        placeholder: "jane@example.com",
      },
      // Employment question - shows only if age > 17 (keeping legacy required format for backward compatibility testing)
      {
        name: "areYouWorking",
        label: "Are you working?",
        type: "radio",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        conditions: {
          ">": [{ "var": "age" }, 17]
        }
      },
      // Companies Information - shows only if working
      {
        name: "companies",
        label: "Company Information",
        type: "array",
        validation: {
          required: "Please add at least one company",
          minItems: { value: 1, message: "At least one company is required" },
          maxItems: { value: 5, message: "Maximum 5 companies allowed" }
        },
        addButtonText: "Add Another Company",
        removeButtonText: "Remove Company",
        description: "Add information for each company you work or have worked for",
        arrayItemFields: [
          {
            name: "companyName",
            label: "Company Name",
            type: "text",
            validation: {
              required: "Company name is required",
              minLength: { value: 2, message: "Company name must be at least 2 characters" },
              maxLength: { value: 100, message: "Company name cannot exceed 100 characters" }
            },
            placeholder: "Acme Corp"
          },
          {
            name: "designation",
            label: "Designation",
            type: "text",
            validation: {
              required: "Job designation is required",
              minLength: { value: 2, message: "Designation must be at least 2 characters" },
              maxLength: { value: 80, message: "Designation cannot exceed 80 characters" }
            },
            placeholder: "Software Engineer"
          },
          {
            name: "experience",
            label: "Years of Experience",
            type: "number",
            validation: {
              required: "Years of experience is required",
              min: { value: 0, message: "Experience cannot be negative" },
              max: { value: 50, message: "Please enter a realistic number of years" }
            },
            placeholder: "3"
          }
        ],
        conditions: {
          "==": [{ "var": "areYouWorking" }, "yes"]
        }
      },
      { 
        name: "acceptTos", 
        label: "I agree to the Terms", 
        type: "checkbox",
        validation: {
          required: "You must accept the terms and conditions to proceed"
        }
      },
    ],
  },
};
