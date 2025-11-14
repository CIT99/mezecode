/**
 * Test utility functions
 */

export const formatTestResults = (results) => {
  if (!results) return null
  
  return {
    passed: results.passed,
    total: results.totalTests || 0,
    passedCount: results.passedTests || 0,
    failedCount: (results.totalTests || 0) - (results.passedTests || 0),
    tests: results.results || [],
  }
}

export const hasAllTestsPassed = (results) => {
  return results?.passed === true && results?.totalTests > 0
}

