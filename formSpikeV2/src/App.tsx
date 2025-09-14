import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import { Home } from '@/pages/Home'
import { UserRegistrationSteps } from '@/pages/UserRegistrationSteps'
import { UserRegistrationStepsRHF } from '@/pages/UserRegistrationStepsRHF'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-registration-steps" element={<UserRegistrationSteps />} />
          <Route path="/user-registration-steps-rhf" element={<UserRegistrationStepsRHF />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
