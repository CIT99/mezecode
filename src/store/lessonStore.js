import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLessonStore = create(
  persist(
    (set) => ({
      currentLesson: null,
      currentStep: 0,
      code: '',
      lessonData: null,
      stepData: null,
      
      setCurrentLesson: (lesson) => {
        set({ 
          currentLesson: lesson,
          currentStep: 0 // Always reset to step 0 when changing lessons
        })
      },
      
      setCurrentStep: (stepIndex) => set({ currentStep: stepIndex }),
      
      setCode: (code) => set({ code }),
      
      setLessonData: (data) => set({ lessonData: data }),
      
      setStepData: (data) => set({ stepData: data }),
      
      resetLesson: () => set({
        currentLesson: null,
        currentStep: 0,
        code: '',
        lessonData: null,
        stepData: null,
      }),
      
      loadStepCode: (starterCode) => {
        set({ code: starterCode || '' })
      },
    }),
    {
      name: 'mezcode-lesson',
      storage: createJSONStorage(() => localStorage),
      // Only persist currentLesson, not currentStep or code
      partialize: (state) => ({ currentLesson: state.currentLesson }),
    }
  )
)

