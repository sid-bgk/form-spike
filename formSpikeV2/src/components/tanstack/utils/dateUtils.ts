/**
 * Utility functions for date handling in forms
 */

/**
 * Converts a date value to HTML5 date input format (YYYY-MM-DD)
 * @param value - Date object, ISO string, or date string
 * @returns Formatted date string or empty string if invalid
 */
export function formatDateForInput(value: string | Date | undefined | null): string {
  if (!value) return ''
  
  try {
    const date = value instanceof Date ? value : new Date(value)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.warn('Error formatting date for input:', error)
    return ''
  }
}

/**
 * Converts HTML5 date input value to ISO string for backend
 * @param value - Date string in YYYY-MM-DD format
 * @returns ISO string or empty string if invalid
 */
export function formatDateForSubmission(value: string): string {
  if (!value) return ''
  
  try {
    const date = new Date(value + 'T00:00:00.000Z')
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    return date.toISOString()
  } catch (error) {
    console.warn('Error formatting date for submission:', error)
    return ''
  }
}

/**
 * Validates if a date string is within the specified range
 * @param value - Date string to validate
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @returns Validation result object
 */
export function validateDateRange(
  value: string,
  minDate?: string | Date,
  maxDate?: string | Date
): { isValid: boolean; error?: string } {
  if (!value) return { isValid: true }
  
  try {
    const date = new Date(value)
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Please enter a valid date' }
    }
    
    if (minDate) {
      const min = minDate instanceof Date ? minDate : new Date(minDate)
      if (date < min) {
        return { 
          isValid: false, 
          error: `Date must be after ${formatDateForInput(min)}` 
        }
      }
    }
    
    if (maxDate) {
      const max = maxDate instanceof Date ? maxDate : new Date(maxDate)
      if (date > max) {
        return { 
          isValid: false, 
          error: `Date must be before ${formatDateForInput(max)}` 
        }
      }
    }
    
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'Please enter a valid date' }
  }
}

/**
 * Validates age constraints for date fields
 * @param value - Date string to validate
 * @param minAge - Minimum age required
 * @param maxAge - Maximum age allowed
 * @returns Validation result object
 */
export function validateAge(
  value: string,
  minAge?: number,
  maxAge?: number
): { isValid: boolean; error?: string } {
  if (!value) return { isValid: true }
  
  try {
    const birthDate = new Date(value)
    
    if (isNaN(birthDate.getTime())) {
      return { isValid: false, error: 'Please enter a valid date' }
    }
    
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age
    
    if (minAge !== undefined && actualAge < minAge) {
      return { 
        isValid: false, 
        error: `Must be at least ${minAge} years old` 
      }
    }
    
    if (maxAge !== undefined && actualAge > maxAge) {
      return { 
        isValid: false, 
        error: `Must be no more than ${maxAge} years old` 
      }
    }
    
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'Please enter a valid date' }
  }
}