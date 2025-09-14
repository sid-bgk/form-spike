import React from 'react'
import { DateValidationTest } from '../components/tanstack/test/DateValidationTest'

export function DateValidationTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Date Validation Test Page</h1>
        <DateValidationTest />
      </div>
    </div>
  )
}