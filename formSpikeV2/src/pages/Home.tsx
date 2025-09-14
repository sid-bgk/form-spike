import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Remote Form Demo
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            API-driven dynamic forms fetched from backend
          </p>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                Remote Config
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Registration Form
              </h3>
              <p className="text-gray-600 mb-4">
                Fetches user registration form configuration from the backend and renders dynamically with validation.
              </p>
              <Link to="/remote-form/tanstack/user-registration">
                <Button className="w-full">
                  View User Registration
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                Remote Config
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Registration Form
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive business registration form with nested objects and complex validation rules.
              </p>
              <Link to="/remote-form/tanstack/company-registration">
                <Button className="w-full">
                  View Company Registration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
