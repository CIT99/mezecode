import { useEffect } from 'react'
import { useLessonStore } from '../store/lessonStore'
import { loadLesson } from '../services/lessonLoader'

export const useLesson = (lessonId) => {
  const {
    currentLesson,
    lessonData,
    setLessonData,
    setCurrentLesson,
    setCurrentStep,
    loadStepCode,
  } = useLessonStore()

  useEffect(() => {
    if (lessonId && lessonId !== currentLesson) {
      loadLesson(lessonId)
        .then((data) => {
          setCurrentLesson(lessonId)
          setLessonData(data)
          setCurrentStep(0)
          
          // Load first step
          if (data.steps && data.steps.length > 0) {
            const firstStep = data.steps[0]
            loadStepCode(firstStep.starterCode || '')
          }
        })
        .catch((error) => {
          console.error('Failed to load lesson:', error)
        })
    }
  }, [lessonId, currentLesson, setCurrentLesson, setLessonData, setCurrentStep, loadStepCode])

  return {
    lessonData,
    isLoading: lessonId && !lessonData,
  }
}

