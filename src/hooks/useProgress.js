import { useProgressStore } from '../store/progressStore'

export const useProgress = (lessonId) => {
  const {
    completedSteps,
    isStepComplete,
    isStepUnlocked,
    markStepComplete,
    getTestResults,
  } = useProgressStore()

  const lessonCompleted = completedSteps[lessonId] || []
  const totalSteps = 0 // This should come from lesson data

  return {
    completedSteps: lessonCompleted,
    isStepComplete: (stepIndex) => isStepComplete(lessonId, stepIndex),
    isStepUnlocked: (stepIndex) => isStepUnlocked(lessonId, stepIndex),
    markStepComplete: (stepIndex) => markStepComplete(lessonId, stepIndex),
    getTestResults: (stepIndex) => getTestResults(lessonId, stepIndex),
    progress: totalSteps > 0 ? (lessonCompleted.length / totalSteps) * 100 : 0,
  }
}

