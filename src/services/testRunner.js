/**
 * Test runner service
 * Executes lesson tests against user code
 * Note: This is a simplified test runner for browser environment
 * In production, consider using a proper test framework or backend execution
 */

export const runTests = async (userCode, testCode) => {
  const results = []
  let allPassed = true

  try {
    // Create a test context with common testing utilities
    const testContext = {
      describe: (name, fn) => {
        try {
          fn()
        } catch (error) {
          results.push({
            name: `describe: ${name}`,
            passed: false,
            error: error.message,
          })
          allPassed = false
        }
      },
      it: (name, fn) => {
        try {
          fn()
          results.push({
            name,
            passed: true,
          })
        } catch (error) {
          results.push({
            name,
            passed: false,
            error: error.message,
          })
          allPassed = false
        }
      },
      test: (name, fn) => {
        try {
          fn()
          results.push({
            name,
            passed: true,
          })
        } catch (error) {
          results.push({
            name,
            passed: false,
            error: error.message,
          })
          allPassed = false
        }
      },
      expect: (actual) => ({
        toBe: (expected) => {
          if (actual !== expected) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`)
          }
        },
       toEqual: (expected) => {
          if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`)
          }
        },
        toContain: (item) => {
          if (!actual.includes || !actual.includes(item)) {
            throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`)
          }
        },
        toBeTruthy: () => {
          if (!actual) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`)
          }
        },
        toBeFalsy: () => {
          if (actual) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be falsy`)
          }
        },
        toBeDefined: () => {
          if (actual === undefined) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be defined`)
          }
        },
        toBeUndefined: () => {
          if (actual !== undefined) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be undefined`)
          }
        },
        toBeNull: () => {
          if (actual !== null) {
            throw new Error(`Expected ${JSON.stringify(actual)} to be null`)
          }
        },
        toBeGreaterThan: (expected) => {
          if (actual <= expected) {
            throw new Error(`Expected ${actual} to be greater than ${expected}`)
          }
        },
        toBeLessThan: (expected) => {
          if (actual >= expected) {
            throw new Error(`Expected ${actual} to be less than ${expected}`)
          }
        },
      }),
    }

    // Execute user code in a safe context
    const userContext = {}
    const userFunction = new Function('exports', 'module', userCode || '')
    userFunction(userContext, { exports: userContext })

    // Execute test code with access to user code and test utilities
    const testFunction = new Function(
      'userCode',
      'expect',
      'describe',
      'it',
      'test',
      testCode || ''
    )
    
    testFunction(
      userContext,
      testContext.expect,
      testContext.describe,
      testContext.it,
      testContext.test
    )

    return {
      passed: allPassed,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
    }
  } catch (error) {
    return {
      passed: false,
      results: [
        {
          name: 'Test execution error',
          passed: false,
          error: error.message,
        },
      ],
      totalTests: 0,
      passedTests: 0,
      error: error.message,
    }
  }
}

export const runTestsWithTimeout = async (userCode, testCode, timeout = 5000) => {
  return Promise.race([
    runTests(userCode, testCode),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Test execution timeout')), timeout)
    ),
  ]).catch((error) => ({
    passed: false,
    results: [
      {
        name: 'Test timeout',
        passed: false,
        error: error.message,
      },
    ],
    totalTests: 0,
    passedTests: 0,
    error: error.message,
  }))
}

