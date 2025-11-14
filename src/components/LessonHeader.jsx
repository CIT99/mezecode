import { useState, useEffect } from 'react'
import { X, Trophy } from 'lucide-react'

export default function LessonHeader({ lessonData, onClose, onStartOver, isComplete }) {
  const [shouldShow, setShouldShow] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (isComplete) {
      // Reset visibility when lesson becomes complete
      setShouldShow(true)
      setShouldRender(true)
      
      // Start fade out after 30 seconds
      const fadeTimer = setTimeout(() => {
        setShouldShow(false)
        // Remove from DOM after fade completes (1 second transition)
        setTimeout(() => {
          setShouldRender(false)
        }, 1000)
      }, 30000)

      return () => clearTimeout(fadeTimer)
    } else {
      // Reset when lesson is not complete
      setShouldShow(true)
      setShouldRender(true)
    }
  }, [isComplete])

  if (!lessonData) return null

  // Show completion message if all steps are complete
  if (isComplete) {
    if (!shouldRender) return null
    
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-b border-emerald-200 dark:border-emerald-700 px-4 py-2 relative transition-opacity duration-1000 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-3">
          <Trophy size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            Lesson Complete
          </span>
          {onStartOver && (
            <button
              onClick={onStartOver}
              className="ml-2 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded transition-colors"
              title="Restart lesson"
            >
              Restart
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors rounded hover:bg-emerald-100 dark:hover:bg-emerald-800/50"
            title="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
    )
  }

  // Normal description view
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 relative">
      <div className="flex items-center justify-center">
        {lessonData.description && (
          <p className="text-gray-700 dark:text-gray-300 text-center">{lessonData.description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Close description"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

