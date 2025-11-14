import { useProgressStore } from '../store/progressStore'
import { useLessonStore } from '../store/lessonStore'

export default function StepIndicator({ onStepClick }) {
  const { lessonData, currentStep } = useLessonStore()
  const { isStepUnlocked, isStepComplete } = useProgressStore()

  if (!lessonData || !lessonData.steps) return null

  const steps = lessonData.steps

  const handleStepClick = (index) => {
    const unlocked = isStepUnlocked(lessonData.id, index)
    if (unlocked && index !== currentStep) {
      onStepClick?.(index)
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {steps.map((step, index) => {
        const unlocked = isStepUnlocked(lessonData.id, index)
        const completed = isStepComplete(lessonData.id, index)
        const isCurrent = index === currentStep
        // Only show as current/active if it's completed
        const isActive = isCurrent && completed

        return (
          <div
            key={index}
            className={`flex items-center gap-2 flex-shrink-0 ${
              !unlocked ? 'opacity-50' : ''
            }`}
          >
            <button
              onClick={() => handleStepClick(index)}
              disabled={!unlocked}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-500 dark:bg-blue-600 text-white cursor-default'
                  : completed
                  ? 'bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer'
                  : unlocked
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              title={`Step ${index + 1}: ${step.title}`}
            >
              {completed ? '✓' : index + 1}
            </button>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-1 transition-colors ${
                  completed 
                    ? 'bg-emerald-500 dark:bg-emerald-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

