import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'

export default function LessonNavigation({ onStepChange }) {
  const { lessonData, currentStep, setCurrentStep, loadStepCode } = useLessonStore()
  const { isStepUnlocked, isStepComplete } = useProgressStore()

  if (!lessonData || !lessonData.steps) return null

  const steps = lessonData.steps
  const canGoNext = currentStep < steps.length - 1
  const canGoPrev = currentStep > 0
  const nextUnlocked = canGoNext && isStepUnlocked(lessonData.id, currentStep + 1)
  const currentCompleted = isStepComplete(lessonData.id, currentStep)

  const handleNext = () => {
    // Check if current step is completed before allowing next
    if (!currentCompleted) {
      return
    }
    
    if (nextUnlocked && currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      const stepData = steps[nextStep]
      loadStepCode(stepData.starterCode || '')
      onStepChange?.(nextStep)
    }
  }

  const handlePrev = () => {
    if (canGoPrev) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      const stepData = steps[prevStep]
      loadStepCode(stepData.starterCode || '')
      onStepChange?.(prevStep)
    }
  }

  const handleStepClick = (index) => {
    const unlocked = isStepUnlocked(lessonData.id, index)
    if (unlocked && index !== currentStep) {
      setCurrentStep(index)
      const stepData = steps[index]
      loadStepCode(stepData.starterCode || '')
      onStepChange?.(index)
    }
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between gap-4">
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
          className={`px-4 py-2 rounded font-medium transition-colors flex-shrink-0 ${
          canGoPrev
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        ← Previous
      </button>
        
        {/* Step Indicator */}
        <div className="flex-1 flex items-center justify-center gap-2 overflow-x-auto px-4">
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
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!unlocked}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white cursor-default'
                      : completed
                      ? 'bg-green-600 text-white hover:bg-green-500 cursor-pointer'
                      : unlocked
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  title={`Step ${index + 1}: ${step.title}`}
                >
                  {completed ? '✓' : index + 1}
                </button>
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

      <button
        onClick={handleNext}
        disabled={!nextUnlocked}
          className={`px-4 py-2 rounded font-medium transition-colors flex-shrink-0 ${
          nextUnlocked
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        Next →
      </button>
      </div>
    </div>
  )
}

