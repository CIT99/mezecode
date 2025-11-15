import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLessonStore = create(
  persist(
    (set, get) => ({
      currentLesson: null,
      currentStep: 0,
      code: '',
      lessonData: null,
      stepData: null,
      stepCode: {}, // { lessonId: { stepIndex: code } }
      
      setCurrentLesson: (lesson) => {
        set({ 
          currentLesson: lesson,
          currentStep: 0 // Always reset to step 0 when changing lessons
        })
      },
      
      setCurrentStep: (stepIndex) => set({ currentStep: stepIndex }),
      
      setCode: (code) => {
        const { currentLesson, currentStep } = get()
        set({ code })
        // Save code for current step
        if (currentLesson !== null) {
          set((state) => ({
            stepCode: {
              ...state.stepCode,
              [currentLesson]: {
                ...(state.stepCode[currentLesson] || {}),
                [currentStep]: code,
              },
            },
          }))
        }
      },
      
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
        const { currentLesson, currentStep, stepCode } = get()
        // Check if there's saved code for this step
        const savedCode = currentLesson !== null 
          ? stepCode[currentLesson]?.[currentStep] 
          : null
        
        // Use saved code if available, otherwise use starter code
        set({ code: savedCode !== undefined ? savedCode : (starterCode || '') })
      },
      
      clearStepCode: (lessonId) => {
        set((state) => {
          const newStepCode = { ...state.stepCode }
          if (lessonId) {
            delete newStepCode[lessonId]
          } else {
            // Clear all if no lessonId provided
            return { stepCode: {} }
          }
          return { stepCode: newStepCode }
        })
      },
      
      clearCurrentStepCode: () => {
        const { currentLesson, currentStep } = get()
        if (currentLesson !== null && currentStep !== undefined) {
          set((state) => {
            const newStepCode = { ...state.stepCode }
            if (newStepCode[currentLesson]) {
              const lessonStepCode = { ...newStepCode[currentLesson] }
              delete lessonStepCode[currentStep]
              newStepCode[currentLesson] = lessonStepCode
            }
            return { stepCode: newStepCode }
          })
        }
      },
      
      resetToStarterCode: (starterCode) => {
        const { currentLesson, currentStep } = get()
        // Clear saved code for current step and set code to starter code in one operation
        if (currentLesson !== null && currentStep !== undefined) {
          set((state) => {
            const newStepCode = { ...state.stepCode }
            if (newStepCode[currentLesson]) {
              const lessonStepCode = { ...newStepCode[currentLesson] }
              delete lessonStepCode[currentStep]
              newStepCode[currentLesson] = lessonStepCode
            }
            return { 
              code: starterCode || '',
              stepCode: newStepCode
            }
          })
        } else {
          set({ code: starterCode || '' })
        }
      },
    }),
    {
      name: 'mezcode-lesson',
      storage: createJSONStorage(() => localStorage),
      // Persist currentLesson, currentStep, and stepCode
      partialize: (state) => ({ 
        currentLesson: state.currentLesson,
        currentStep: state.currentStep,
        stepCode: state.stepCode,
      }),
    }
  )
)

