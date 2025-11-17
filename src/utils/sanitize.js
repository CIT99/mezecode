/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') {
    return String(text)
  }
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  
  return text.replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * Escapes text for use in JavaScript string literals
 * @param {string} text - Text to escape
 * @returns {string} Escaped JavaScript string
 */
export const escapeJs = (text) => {
  if (typeof text !== 'string') {
    return String(text)
  }
  
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/**
 * Sanitizes error messages for safe display in HTML
 * @param {Error|string} error - Error object or error message
 * @returns {string} Sanitized error message
 */
export const sanitizeError = (error) => {
  if (!error) return ''
  
  let errorMessage = ''
  if (error instanceof Error) {
    errorMessage = error.message || error.toString()
  } else {
    errorMessage = String(error)
  }
  
  return escapeHtml(errorMessage)
}

/**
 * Sanitizes error stack trace for safe display
 * @param {Error|string} error - Error object or stack trace
 * @returns {string} Sanitized stack trace
 */
export const sanitizeStack = (error) => {
  if (!error) return ''
  
  let stack = ''
  if (error instanceof Error && error.stack) {
    stack = error.stack
  } else if (typeof error === 'string') {
    stack = error
  } else {
    return ''
  }
  
  return escapeHtml(stack)
}

/**
 * Validates that code doesn't contain dangerous patterns
 * @param {string} code - Code to validate
 * @returns {{valid: boolean, reason?: string}} Validation result
 */
export const validateCode = (code) => {
  if (typeof code !== 'string') {
    return { valid: false, reason: 'Code must be a string' }
  }
  
  // Check for extremely long code (potential DoS)
  if (code.length > 100000) {
    return { valid: false, reason: 'Code is too long' }
  }
  
  // Check for potentially dangerous patterns that could affect the main app
  const dangerousPatterns = [
    // Code execution
    { pattern: /eval\s*\(/i, reason: 'eval() is not allowed' },
    { pattern: /\bFunction\s*\(/, reason: 'Function constructor is not allowed' },
    
    // Timers (can be used for DoS)
    { pattern: /setTimeout\s*\(/i, reason: 'setTimeout() is not allowed' },
    { pattern: /setInterval\s*\(/i, reason: 'setInterval() is not allowed' },
    
    // Storage APIs
    { pattern: /document\.cookie/i, reason: 'document.cookie is not allowed' },
    { pattern: /localStorage\.setItem/i, reason: 'localStorage is not allowed' },
    { pattern: /sessionStorage\.setItem/i, reason: 'sessionStorage is not allowed' },
    
    // Network requests
    { pattern: /XMLHttpRequest/i, reason: 'XMLHttpRequest is not allowed' },
    { pattern: /fetch\s*\(/i, reason: 'fetch() is not allowed' },
    
    // Direct document manipulation (students should use the provided render function)
    { pattern: /document\.(body|head|documentElement)/i, reason: 'Direct access to document.body, document.head, or document.documentElement is not allowed. Use the provided render function instead.' },
    { pattern: /document\.getElementById\s*\(\s*['"]root['"]\s*\)/i, reason: 'Access to document.getElementById(\'root\') is not allowed. Use the container provided to your render function instead.' },
    
    // Window parent access (could affect main app)
    { pattern: /window\.(parent|top|frameElement)/i, reason: 'Access to window.parent, window.top, or window.frameElement is not allowed' },
    { pattern: /self\.(parent|top)/i, reason: 'Access to self.parent or self.top is not allowed' },
    { pattern: /frames\[/i, reason: 'Access to frames array is not allowed' },
    { pattern: /parent\./i, reason: 'Access to parent window is not allowed' },
    { pattern: /top\./i, reason: 'Access to top window is not allowed' },
    
    // Other dangerous APIs
    { pattern: /postMessage\s*\(/i, reason: 'postMessage() is not allowed' },
  ]
  
  for (const { pattern, reason } of dangerousPatterns) {
    if (pattern.test(code)) {
      return { valid: false, reason }
    }
  }
  
  return { valid: true }
}

/**
 * Sanitizes user code for safe execution in sandboxed environment
 * Note: This doesn't prevent all attacks, but works with iframe sandbox
 * @param {string} code - User code to sanitize
 * @returns {string} Sanitized code
 */
export const sanitizeCode = (code) => {
  if (typeof code !== 'string') {
    return ''
  }
  
  // Basic validation
  const validation = validateCode(code)
  if (!validation.valid) {
    throw new Error(`Code validation failed: ${validation.reason}`)
  }
  
  // Return code as-is since we're relying on iframe sandbox for security
  // The sandbox attribute prevents most dangerous operations
  return code
}

