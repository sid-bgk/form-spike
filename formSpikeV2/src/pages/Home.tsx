import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Form Libraries Comparison
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Compare TanStack Form vs React Hook Form implementations
          </p>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                TanStack Form
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Registration Steps
              </h3>
              <p className="text-gray-600 mb-4">
                Multi-step form with conditional fields using TanStack Form library. Features step-by-step validation and dynamic field visibility.
              </p>
              <Link to="/user-registration-steps">
                <Button className="w-full">
                  View TanStack Implementation
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
                React Hook Form
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Registration Steps
              </h3>
              <p className="text-gray-600 mb-4">
                Same multi-step form implemented with React Hook Form. Compare performance, API, and developer experience with TanStack.
              </p>
              <Link to="/user-registration-steps-rhf">
                <Button className="w-full">
                  View React Hook Form Implementation
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Compare Both Implementations
            </h3>
            <p className="text-gray-600 mb-4">
              Both forms use the same configuration and UI components, allowing you to compare:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left max-w-2xl mx-auto">
              <li>• <strong>Form validation</strong> - Field-level and cross-field validation</li>
              <li>• <strong>Conditional rendering</strong> - Dynamic fields and steps based on user input</li>
              <li>• <strong>Step navigation</strong> - Multi-step flow with validation</li>
              <li>• <strong>Performance</strong> - Re-render optimization and form state management</li>
              <li>• <strong>Developer experience</strong> - API differences and ease of use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}