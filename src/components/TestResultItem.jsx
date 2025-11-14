export default function TestResultItem({ test }) {
  return (
    <div
      className={`p-3 rounded border ${
        test.passed
          ? 'bg-green-900/20 border-green-700'
          : 'bg-red-900/20 border-red-700'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className={`text-lg ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
          {test.passed ? '✓' : '✗'}
        </span>
        <div className="flex-1">
          <div className={`font-medium ${test.passed ? 'text-green-300' : 'text-red-300'}`}>
            {test.name}
          </div>
          {test.error && (
            <div className="mt-1 text-sm text-red-400 font-mono">
              {test.error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

