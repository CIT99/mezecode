import { useCallback } from 'react'
import { useLessonStore } from '../store/lessonStore'

export const useCodeExecution = () => {
  const { code, stepData, loadStepCode } = useLessonStore()

  const resetCode = useCallback(() => {
    if (stepData?.starterCode) {
      loadStepCode(stepData.starterCode)
    } else {
      loadStepCode('')
    }
  }, [stepData, loadStepCode])

  return {
    code,
    resetCode,
  }
}

