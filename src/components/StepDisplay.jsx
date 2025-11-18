import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'
import { CheckCircle2 } from 'lucide-react'

export default function StepDisplay() {
  const { lessonData, currentStep, stepData } = useLessonStore()
  const { isStepComplete } = useProgressStore()

  if (!lessonData || !lessonData.steps || !stepData) return null

  const totalSteps = lessonData.steps.length
  const isComplete = isStepComplete(lessonData.id, currentStep)

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {isComplete && (
        <CheckCircle2 
          size={18} 
          className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" 
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Step {stepData.number || currentStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  )
}

