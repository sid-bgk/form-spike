import React, { useState } from 'react'
import { jsonLogic } from '../utils/jsonLogicExtensions'

export function JsonLogicTest() {
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = () => {
    const results: string[] = []

    // Test 1: Array contains string
    const test1 = jsonLogic.apply(
      { "contains": [{ "var": "sourceOfIncome" }, "business_owner_or_self_employed"] },
      { sourceOfIncome: ["employee", "business_owner_or_self_employed", "contractor"] }
    )
    results.push(`Array contains test: ${test1 ? 'PASS' : 'FAIL'}`)

    // Test 2: Array does not contain string
    const test2 = jsonLogic.apply(
      { "contains": [{ "var": "sourceOfIncome" }, "business_owner_or_self_employed"] },
      { sourceOfIncome: ["employee", "contractor"] }
    )
    results.push(`Array does not contain test: ${!test2 ? 'PASS' : 'FAIL'}`)

    // Test 3: String contains substring
    const test3 = jsonLogic.apply(
      { "contains": [{ "var": "description" }, "business"] },
      { description: "business_owner_or_self_employed" }
    )
    results.push(`String contains test: ${test3 ? 'PASS' : 'FAIL'}`)

    // Test 4: Complex condition with contains
    const test4 = jsonLogic.apply(
      {
        "and": [
          { "===": [{ "var": "applicationType" }, "JOINT"] },
          { "contains": [{ "var": "coAdditionalInfoSourceOfIncome" }, "business_owner_or_self_employed"] }
        ]
      },
      {
        applicationType: "JOINT",
        coAdditionalInfoSourceOfIncome: ["employee", "business_owner_or_self_employed"]
      }
    )
    results.push(`Complex condition test: ${test4 ? 'PASS' : 'FAIL'}`)

    // Test 5: Test the 'in' operation
    const test5 = jsonLogic.apply(
      { "in": ["business_owner_or_self_employed", { "var": "sourceOfIncome" }] },
      { sourceOfIncome: ["employee", "business_owner_or_self_employed", "contractor"] }
    )
    results.push(`'in' operation test: ${test5 ? 'PASS' : 'FAIL'}`)

    setTestResults(results)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">JSON Logic Extensions Test</h2>
      
      <div className="space-y-4">
        <button 
          onClick={runTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Tests
        </button>

        {testResults.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`text-sm p-2 rounded ${
                    result.includes('PASS') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-4">
          <p>This test verifies that the custom 'contains' and 'in' operations work correctly with json-logic-js.</p>
        </div>
      </div>
    </div>
  )
}