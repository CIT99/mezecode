import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'
import StepIndicator from './StepIndicator'

export default function LessonNavigation({ onStepChange }) {
  const { lessonData, currentStep, setCurrentStep, loadStepCode } = useLessonStore()
  const { isStepUnlocked } = useProgressStore()

  if (!lessonData || !lessonData.steps) return null

  const steps = lessonData.steps
  const canGoNext = currentStep < steps.length - 1
  const canGoPrev = currentStep > 0
  const nextUnlocked = canGoNext && isStepUnlocked(lessonData.id, currentStep + 1)

  const handleNext = () => {
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
    setCurrentStep(index)
    const stepData = steps[index]
    loadStepCode(stepData.starterCode || '')
    onStepChange?.(index)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between gap-4">
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
          className={`px-4 py-2 rounded font-medium transition-colors flex-shrink-0 ${
          canGoPrev
            ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        ← Previous
      </button>
        
        {/* Step Indicator */}
        <div className="flex-1 flex items-center justify-center px-4">
          <StepIndicator onStepClick={handleStepClick} />
        </div>

      <button
        onClick={handleNext}
        disabled={!nextUnlocked}
          className={`px-4 py-2 rounded font-medium transition-colors flex-shrink-0 ${
          nextUnlocked
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        Next →
      </button>
      </div>
    </div>
  )
}

