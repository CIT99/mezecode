/**
 * Code utility functions
 */

export const formatCode = (code) => {
  // Basic code formatting - can be enhanced with prettier later
  return code || ''
}

export const validateCode = (code) => {
  try {
    // Basic syntax validation
    new Function(code)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

