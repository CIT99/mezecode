export default function TestFeedback({ results }) {
  if (!results) return null

  const { passed, total } = results

  // Only show success message when all tests pass
  if (passed && total > 0) {
    return (
      <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded">
        <div className="text-sm sm:text-base text-green-800 dark:text-green-300 font-semibold mb-1">
          ✓ All tests passed!
        </div>
        <div className="text-xs sm:text-sm text-green-700 dark:text-green-400">
          Great job! You've completed this step.
        </div>
      </div>
    )
  }

  return null
}

