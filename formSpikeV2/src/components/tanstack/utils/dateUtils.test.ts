/**
 * Simple tests for date utilities
 */

import { formatDateForInput, formatDateForSubmission, validateDateRange, validateAge } from './dateUtils'

// Test formatDateForInput
console.log('Testing formatDateForInput:')
console.log('Date object:', formatDateForInput(new Date('2023-12-25'))) // Should be 2023-12-25
console.log('ISO string:', formatDateForInput('2023-12-25T10:30:00.000Z')) // Should be 2023-12-25
console.log('Date string:', formatDateForInput('2023-12-25')) // Should be 2023-12-25
console.log('Empty:', formatDateForInput('')) // Should be empty
console.log('Null:', formatDateForInput(null)) // Should be empty
console.log('Invalid:', formatDateForInput('invalid-date')) // Should be empty

// Test formatDateForSubmission
console.log('\nTesting formatDateForSubmission:')
console.log('Valid date:', formatDateForSubmission('2023-12-25')) // Should be ISO string
console.log('Empty:', formatDateForSubmission('')) // Should be empty
console.log('Invalid:', formatDateForSubmission('invalid')) // Should be empty

// Test validateDateRange
console.log('\nTesting validateDateRange:')
const minDate = new Date('2020-01-01')
const maxDate = new Date('2025-12-31')
console.log('Valid date:', validateDateRange('2023-06-15', minDate, maxDate)) // Should be valid
console.log('Too early:', validateDateRange('2019-12-31', minDate, maxDate)) // Should be invalid
console.log('Too late:', validateDateRange('2026-01-01', minDate, maxDate)) // Should be invalid
console.log('Empty date:', validateDateRange('', minDate, maxDate)) // Should be valid

// Test validateAge
console.log('\nTesting validateAge:')
const eighteenYearsAgo = new Date()
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
const twentyFiveYearsAgo = new Date()
twentyFiveYearsAgo.setFullYear(twentyFiveYearsAgo.getFullYear() - 25)

console.log('18 years old:', validateAge(formatDateForInput(eighteenYearsAgo), 18, 100)) // Should be valid
console.log('25 years old:', validateAge(formatDateForInput(twentyFiveYearsAgo), 18, 100)) // Should be valid
console.log('Too young:', validateAge('2010-01-01', 18, 100)) // Should be invalid
console.log('Empty date:', validateAge('', 18, 100)) // Should be valid

console.log('\nDate utilities tests completed!')