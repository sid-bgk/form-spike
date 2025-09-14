import { DynamicForm } from '@/components/tanstack/forms'
import { userRegistrationFormConfig } from '@/components/tanstack/configs/userRegistrationForm'

export function TanUserRegistration() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
              TanStack Form
            </div>
          </div>
          <DynamicForm config={userRegistrationFormConfig} />
        </div>
      </div>
    </div>
  )
}