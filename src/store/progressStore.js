import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      completedSteps: {}, // { lessonId: [stepIndex1, stepIndex2, ...] }
      testResults: {}, // { lessonId: { stepIndex: { passed: bool, results: [] } } }
      
      markStepComplete: (lessonId, stepIndex) => {
        set((state) => {
          const completed = state.completedSteps[lessonId] || []
          if (!completed.includes(stepIndex)) {
            return {
              completedSteps: {
                ...state.completedSteps,
                [lessonId]: [...completed, stepIndex],
              },
            }
          }
          return state
        })
      },
      
      setTestResults: (lessonId, stepIndex, results) => {
        set((state) => {
          const lessonResults = state.testResults[lessonId] || {}
          return {
            testResults: {
              ...state.testResults,
              [lessonId]: {
                ...lessonResults,
                [stepIndex]: results,
              },
            },
          }
        })
      },
      
      isStepComplete: (lessonId, stepIndex) => {
        const completed = get().completedSteps[lessonId] || []
        return completed.includes(stepIndex)
      },
      
      isStepUnlocked: (lessonId, stepIndex) => {
        // Step 0 is always unlocked
        if (stepIndex === 0) return true
        
        // Previous step must be completed
        const completed = get().completedSteps[lessonId] || []
        return completed.includes(stepIndex - 1)
      },
      
      getTestResults: (lessonId, stepIndex) => {
        return get().testResults[lessonId]?.[stepIndex] || null
      },
      
      resetProgress: () => set({
        completedSteps: {},
        testResults: {},
      }),
    }),
    {
      name: 'mezcode-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

