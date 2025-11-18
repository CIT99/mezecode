import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import LessonView from './components/LessonView'
import { useLessonStore } from './store/lessonStore'
import { useThemeStore } from './store/themeStore'
import { getLessonByPath } from './lessons/index'
import { loadLesson } from './services/lessonLoader'

function Home() {
  const { resetLesson, currentLesson } = useLessonStore()

  // Clear lesson state when on home page
  useEffect(() => {
    if (currentLesson) {
      resetLesson()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Mezcode</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Select a lesson to get started</p>
      </div>
    </div>
  )
}

function LessonRoute() {
  const { path } = useParams()
  const {
    currentLesson,
    lessonData,
    currentStep,
    setCurrentLesson,
    setLessonData,
    setStepData,
    loadStepCode,
    resetLesson,
    setCurrentStep,
  } = useLessonStore()

  useEffect(() => {
    // Check if path matches a lesson
    const lesson = getLessonByPath(path)
    
    if (!lesson) {
      // Path doesn't match any lesson, redirect will happen via Navigate
      return
    }

    // If lesson is already loaded and matches, don't reload
    if (currentLesson === lesson.id && lessonData) {
      // But ensure step is loaded
      if (lessonData.steps && lessonData.steps[currentStep]) {
        const step = lessonData.steps[currentStep]
        setStepData(step)
        loadStepCode(step.starterCode || '')
      }
      return
    }

    // Load the lesson
    const loadLessonData = async () => {
      try {
        const wasSameLesson = currentLesson === lesson.id
        const savedStep = wasSameLesson ? currentStep : 0
        
        // Only reset if switching to a different lesson
        if (currentLesson && currentLesson !== lesson.id) {
          resetLesson()
        }
        
        const data = await loadLesson(lesson.id)
        setCurrentLesson(lesson.id)
        setLessonData(data)
        
        // Use saved step if it was the same lesson, otherwise start at step 0
        const stepIndex = wasSameLesson && savedStep !== undefined && savedStep !== null ? savedStep : 0
        
        if (data.steps && data.steps[stepIndex]) {
          const step = data.steps[stepIndex]
          setStepData(step)
          setCurrentStep(stepIndex)
          loadStepCode(step.starterCode || '')
        } else if (data.steps && data.steps.length > 0) {
          // Fallback to first step
          const firstStep = data.steps[0]
          setStepData(firstStep)
          setCurrentStep(0)
          loadStepCode(firstStep.starterCode || '')
        }
      } catch (error) {
        console.error('Failed to load lesson:', error)
        // Will redirect to home on error
      }
    }

    loadLessonData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  // Check if path matches a lesson
  const lesson = getLessonByPath(path)
  
  if (!lesson) {
    // Redirect to home if path doesn't match any lesson
    return <Navigate to="/" replace />
  }

  // Show loading state while lesson is being loaded
  if (!lessonData || currentLesson !== lesson.id) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading lesson...</div>
      </div>
    )
  }

  return <LessonView />
}

function App() {
  const { initializeTheme } = useThemeStore()

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:path" element={<LessonRoute />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

