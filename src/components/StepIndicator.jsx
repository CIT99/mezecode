import { useProgressStore } from '../store/progressStore'
import { useLessonStore } from '../store/lessonStore'

export default function StepIndicator() {
  const { lessonData, currentStep } = useLessonStore()
  const { isStepUnlocked, isStepComplete } = useProgressStore()

  if (!lessonData || !lessonData.steps) return null

  const steps = lessonData.steps

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        {steps.map((step, index) => {
          const unlocked = isStepUnlocked(lessonData.id, index)
          const completed = isStepComplete(lessonData.id, index)
          const isCurrent = index === currentStep

          return (
            <div
              key={index}
              className={`flex items-center gap-2 flex-shrink-0 ${
                !unlocked ? 'opacity-50' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : completed
                    ? 'bg-green-600 text-white'
                    : unlocked
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {completed ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 ${
                    completed ? 'bg-green-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

