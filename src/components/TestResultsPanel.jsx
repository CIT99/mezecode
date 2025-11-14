import TestResultItem from './TestResultItem'

export default function TestResultsPanel({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className="h-full bg-gray-800 p-4">
        <div className="text-gray-400 text-sm">Running tests...</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="h-full bg-gray-800 p-4">
        <div className="text-gray-400 text-sm">No test results yet</div>
      </div>
    )
  }

  const { passed, total, passedCount, failedCount, tests } = results

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Test Results</h3>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              passed
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {passedCount}/{total} passed
          </span>
        </div>
        {failedCount > 0 && (
          <div className="text-sm text-red-400">
            {failedCount} test{failedCount !== 1 ? 's' : ''} failed
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tests.length === 0 ? (
          <div className="text-gray-400 text-sm">No tests to display</div>
        ) : (
          <div className="space-y-2">
            {tests.map((test, index) => (
              <TestResultItem key={index} test={test} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

