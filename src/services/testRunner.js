/**
 * Test runner service
 * Executes lesson tests against user code
 * Note: This is a simplified test runner for browser environment
 * In production, consider using a proper test framework or backend execution
 */

import { sanitizeCode, sanitizeError, validateCode } from '../utils/sanitize'

export const runTests = async (userCode, testCode) => {
  const results = []
  let allPassed = true

  try {
    // Validate code before execution
    const userCodeValidation = validateCode(userCode || '')
    if (!userCodeValidation.valid) {
      return {
        passed: false,
        results: [
          {
            name: 'Code validation error',
            passed: false,
            error: sanitizeError(userCodeValidation.reason || 'Invalid code'),
          },
        ],
        totalTests: 0,
        passedTests: 0,
        error: sanitizeError(userCodeValidation.reason || 'Invalid code'),
      }
    }

    const testCodeValidation = validateCode(testCode || '')
    if (!testCodeValidation.valid) {
      return {
        passed: false,
        results: [
          {
            name: 'Test code validation error',
            passed: false,
            error: sanitizeError(testCodeValidation.reason || 'Invalid test code'),
          },
        ],
        totalTests: 0,
        passedTests: 0,
        error: sanitizeError(testCodeValidation.reason || 'Invalid test code'),
      }
    }

    // Sanitize code before execution
    let sanitizedUserCode = ''
    let sanitizedTestCode = ''
    try {
      sanitizedUserCode = sanitizeCode(userCode || '')
      sanitizedTestCode = sanitizeCode(testCode || '')
    } catch (error) {
      return {
        passed: false,
        results: [
          {
            name: 'Code sanitization error',
            passed: false,
            error: sanitizeError(error),
          },
        ],
        totalTests: 0,
        passedTests: 0,
        error: sanitizeError(error),
      }
    }

    // Create a test context with common testing utilities
    const testContext = {
      describe: (name, fn) => {
        try {
          fn()
        } catch (error) {
          results.push({
            name: `describe: ${sanitizeError(name)}`,
            passed: false,
            error: sanitizeError(error),
          })
          allPassed = false
        }
      },
      it: (name, fn) => {
        try {
          fn()
          results.push({
            name: sanitizeError(name),
            passed: true,
          })
        } catch (error) {
          results.push({
            name: sanitizeError(name),
            passed: false,
            error: sanitizeError(error),
          })
          allPassed = false
        }
      },
      test: (name, fn) => {
        try {
          fn()
          results.push({
            name: sanitizeError(name),
            passed: true,
          })
        } catch (error) {
          results.push({
            name: sanitizeError(name),
            passed: false,
            error: sanitizeError(error),
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
    
    // For step1 of build-frontend-framework, provide framework code in background
    // Check if user code uses exports.createElement but doesn't define it
    const needsFramework = sanitizedUserCode.includes('exports.createElement') && 
                          !sanitizedUserCode.includes('function createElement')
    
    if (needsFramework) {
      // Provide framework code in exports before executing user code
      const frameworkCode = `
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

function render(element, container) {
  const domElement = document.createElement(element.type);
  
  Object.keys(element.props).forEach(key => {
    if (key === 'className') {
      domElement.setAttribute('class', element.props[key]);
    } else if (key.startsWith('on') && typeof element.props[key] === 'function') {
      const eventName = key.slice(2).toLowerCase();
      domElement.addEventListener(eventName, element.props[key]);
    } else {
      domElement.setAttribute(key, element.props[key]);
    }
  });
  
  element.children.forEach(child => {
    if (typeof child === 'string') {
      domElement.appendChild(document.createTextNode(child));
    } else {
      render(child, domElement);
    }
  });
  
  container.appendChild(domElement);
}

exports.createElement = createElement;
exports.render = render;
`
      const frameworkFunction = new Function('exports', 'module', frameworkCode)
      frameworkFunction(userContext, { exports: userContext })
    }
    
    // Wrap user code execution to capture the 'element' variable if it exists
    // This is needed for step1 where student creates: const element = exports.createElement(...)
    const wrappedUserCode = `
      ${sanitizedUserCode}
      // If element variable exists, export it so tests can access it
      if (typeof element !== 'undefined') {
        exports.element = element;
      }
    `
    
    const userFunction = new Function('exports', 'module', wrappedUserCode)
    userFunction(userContext, { exports: userContext })

    // Execute test code with access to user code and test utilities
    const testFunction = new Function(
      'userCode',
      'expect',
      'describe',
      'it',
      'test',
      sanitizedTestCode
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
          error: sanitizeError(error),
        },
      ],
      totalTests: 0,
      passedTests: 0,
      error: sanitizeError(error),
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
        error: sanitizeError(error),
      },
    ],
    totalTests: 0,
    passedTests: 0,
    error: sanitizeError(error),
  }))
}

