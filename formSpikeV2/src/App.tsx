import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import { Home } from '@/pages/Home'
import { RemoteForm } from '@/pages/RemoteForm'
import { UserRegistrationSteps } from '@/pages/UserRegistrationSteps'
import { CalendarTestPage } from '@/pages/CalendarTest'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/remote-form" element={<RemoteForm />} />
          <Route path="/remote-form/:formType/:config" element={<RemoteForm />} />
          <Route path="/user-registration-steps" element={<UserRegistrationSteps />} />
          <Route path="/calendar-test" element={<CalendarTestPage />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
