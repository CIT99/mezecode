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

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          canGoPrev
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        ← Previous
      </button>
      <div className="text-sm text-gray-400">
        Step {currentStep + 1} of {steps.length}
      </div>
      <button
        onClick={handleNext}
        disabled={!nextUnlocked}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          nextUnlocked
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        Next →
      </button>
    </div>
  )
}

