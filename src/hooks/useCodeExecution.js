import { useCallback } from 'react'
import { useLessonStore } from '../store/lessonStore'

export const useCodeExecution = () => {
  const { code, stepData, resetToStarterCode } = useLessonStore()

  const resetCode = useCallback(() => {
    // Reset to starter code (clears saved code and sets code in one atomic operation)
    const starterCode = stepData?.starterCode !== undefined ? stepData.starterCode : ''
    resetToStarterCode(starterCode)
  }, [stepData?.starterCode, resetToStarterCode])

  return {
    code,
    resetCode,
  }
}

