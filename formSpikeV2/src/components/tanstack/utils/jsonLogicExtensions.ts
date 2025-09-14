import * as jsonLogic from 'json-logic-js'

// Add custom operations to json-logic-js
function initializeJsonLogicExtensions() {
  // Add 'contains' operation for array/string containment checks
  // Usage: { "contains": [array_or_string, value_to_find] }
  jsonLogic.add_operation('contains', function(data: any, needle: any) {
    if (Array.isArray(data)) {
      return data.includes(needle)
    }
    if (typeof data === 'string' && typeof needle === 'string') {
      return data.includes(needle)
    }
    return false
  })

  // Add 'in' operation as an alternative (needle in haystack)
  // Usage: { "in": [value_to_find, array_or_string] }
  jsonLogic.add_operation('in', function(needle: any, haystack: any) {
    if (Array.isArray(haystack)) {
      return haystack.includes(needle)
    }
    if (typeof haystack === 'string' && typeof needle === 'string') {
      return haystack.includes(needle)
    }
    return false
  })
}

// Initialize extensions when this module is imported
initializeJsonLogicExtensions()

// Export the extended jsonLogic
export { jsonLogic }
export default jsonLogic