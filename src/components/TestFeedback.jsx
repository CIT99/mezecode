export default function TestFeedback({ results }) {
  if (!results) return null

  const { passed, total, passedCount } = results

  if (passed && total > 0) {
    return (
      <div className="p-4 bg-green-900/30 border border-green-700 rounded">
        <div className="text-green-300 font-semibold mb-1">
          ✓ All tests passed!
        </div>
        <div className="text-green-400 text-sm">
          Great job! You've completed this step.
        </div>
      </div>
    )
  }

  if (total > 0 && passedCount < total) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700 rounded">
        <div className="text-red-300 font-semibold mb-1">
          ✗ Some tests failed
        </div>
        <div className="text-red-400 text-sm">
          {total - passedCount} test{total - passedCount !== 1 ? 's' : ''} need{total - passedCount === 1 ? 's' : ''} to pass.
        </div>
      </div>
    )
  }

  return null
}

