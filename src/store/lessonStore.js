import { create } from 'zustand'

export const useLessonStore = create((set) => ({
  currentLesson: null,
  currentStep: 0,
  code: '',
  lessonData: null,
  stepData: null,
  
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  
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
}))

