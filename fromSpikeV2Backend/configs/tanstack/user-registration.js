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
        required: true,
        placeholder: "Jane",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Doe",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "30",
        required: true
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "jane@example.com",
      },
      // Employment question - shows only if age > 17
      {
        name: "areYouWorking",
        label: "Are you working?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        showWhen: {
          ">": [{ "var": "age" }, 17]
        }
      },
      // Companies Information - shows only if working
      {
        name: "companies",
        label: "Company Information",
        type: "array",
        required: true,
        minItems: 1,
        maxItems: 5,
        addButtonText: "Add Another Company",
        removeButtonText: "Remove Company",
        description: "Add information for each company you work or have worked for",
        arrayItemFields: [
          {
            name: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
            placeholder: "Acme Corp"
          },
          {
            name: "designation",
            label: "Designation",
            type: "text",
            required: true,
            placeholder: "Software Engineer"
          },
          {
            name: "experience",
            label: "Years of Experience",
            type: "number",
            required: true,
            placeholder: "3"
          }
        ],
        showWhen: {
          "==": [{ "var": "areYouWorking" }, "yes"]
        }
      },
      { name: "acceptTos", label: "I agree to the Terms", type: "checkbox" },
    ],
  },
};
