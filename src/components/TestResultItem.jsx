export default function TestResultItem({ test }) {
  return (
    <div
      className={`p-2 sm:p-3 rounded border ${
        test.passed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className={`text-base sm:text-lg ${test.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {test.passed ? '✓' : '✗'}
        </span>
        <div className="flex-1">
          <div className={`text-sm sm:text-base font-medium ${test.passed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
            {test.name}
          </div>
          {test.error && (
            <div className="mt-1 text-xs sm:text-sm text-red-700 dark:text-red-400 font-mono break-words">
              {test.error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

