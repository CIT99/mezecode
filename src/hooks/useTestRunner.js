import { useState, useCallback } from 'react'
import { runTestsWithTimeout } from '../services/testRunner'
import { formatTestResults } from '../utils/testUtils'
import { useProgressStore } from '../store/progressStore'
import { useLessonStore } from '../store/lessonStore'

export const useTestRunner = () => {
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const { setTestResults: saveTestResults, markStepComplete } = useProgressStore()
  const { currentLesson, currentStep } = useLessonStore()

  const runTests = useCallback(async (userCode, testCode) => {
    setIsRunning(true)
    setTestResults(null)

    try {
      const results = await runTestsWithTimeout(userCode, testCode, 5000)
      const formatted = formatTestResults(results)
      setTestResults(formatted)

      // Save results to store
      if (currentLesson) {
        saveTestResults(currentLesson, currentStep, formatted)

        // Mark step as complete if all tests pass
        if (formatted?.passed && formatted?.total > 0) {
          markStepComplete(currentLesson, currentStep)
        }
      }

      return formatted
    } catch (error) {
      const errorResults = {
        passed: false,
        total: 0,
        passedCount: 0,
        failedCount: 0,
        tests: [
          {
            name: 'Test execution error',
            passed: false,
            error: error.message,
          },
        ],
      }
      setTestResults(errorResults)
      return errorResults
    } finally {
      setIsRunning(false)
    }
  }, [currentLesson, currentStep, saveTestResults, markStepComplete])

  const resetTestResults = useCallback(() => {
    setTestResults(null)
    setIsRunning(false)
  }, [])

  return {
    runTests,
    testResults,
    isRunning,
    resetTestResults,
  }
}

