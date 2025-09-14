import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Form Library Showcase
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Explore different form libraries and their implementations
          </p>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                TanStack Form
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Registration
              </h3>
              <p className="text-gray-600 mb-4">
                Personal user registration form with validation, async checks, and multiple field types.
              </p>
              <Link to="/tan-user-registration">
                <Button className="w-full">
                  View User Form
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                Remote Config
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                API-driven Form
              </h3>
              <p className="text-gray-600 mb-4">
                Fetches form configuration from the backend on load and renders dynamically.
              </p>
              <Link to="/remote-form/tanstack/user-registration">
                <Button className="w-full">
                  View Remote Form
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                TanStack Form
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Registration
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive business registration form with nested objects, complex validation, and extensive field types.
              </p>
              <Link to="/tan-company-registration">
                <Button className="w-full">
                  View Company Form
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 mb-3">
                Coming Soon
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                React Hook Form
              </h3>
              <p className="text-gray-400 mb-4">
                Performance-focused form library with minimal re-renders and excellent TypeScript support.
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
