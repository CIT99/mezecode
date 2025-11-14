import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TestResultItem from './TestResultItem'

export default function TestResultsPanel({ results, isLoading }) {
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Test Results</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Running tests...</span>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />}
        </button>
        {isOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm">Running tests...</div>
          </div>
        )}
      </div>
    )
  }

  if (!results) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Test Results</h3>
          {isOpen ? <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />}
        </button>
        {isOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-sm">No test results yet</div>
          </div>
        )}
      </div>
    )
  }

  const { passed, total, passedCount, failedCount, tests } = results

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Test Results</h3>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              passed
                ? 'bg-green-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {passedCount}/{total} passed
          </span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />}
      </button>
      {isOpen && (
        <div className="max-h-64 overflow-y-auto p-4 border-t border-gray-200 dark:border-gray-700">
          {tests.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 text-sm">No tests to display</div>
          ) : (
            <div className="space-y-2">
              {tests.map((test, index) => (
                <TestResultItem key={index} test={test} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

