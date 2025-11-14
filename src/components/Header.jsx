import { useEffect, useState } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { getAllLessons } from '../lessons/index'
import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'
import { useThemeStore } from '../store/themeStore'
import { loadLesson } from '../services/lessonLoader'
import Drawer from './Drawer'

export default function Header() {
  const { currentLesson, lessonData, currentStep, setCurrentLesson, setLessonData, setStepData, loadStepCode, resetLesson, setCurrentStep, clearStepCode } = useLessonStore()
  const { resetProgress } = useProgressStore()
  const { theme, toggleTheme } = useThemeStore()
  const lessons = getAllLessons()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Restore persisted lesson on page load
  useEffect(() => {
    // Only run once on mount to restore persisted lesson
    const persistedLesson = currentLesson
    if (persistedLesson && !lessonData) {
      // Lesson is persisted but data isn't loaded yet
      loadLesson(persistedLesson)
        .then((data) => {
          setLessonData(data)
          
          // Load the persisted step (or first step if none persisted)
          const stepIndex = currentStep || 0
          if (data.steps && data.steps[stepIndex]) {
            const step = data.steps[stepIndex]
            setStepData(step)
            loadStepCode(step.starterCode || '')
          } else if (data.steps && data.steps.length > 0) {
            // Fallback to first step
            setCurrentStep(0)
            const firstStep = data.steps[0]
            setStepData(firstStep)
            loadStepCode(firstStep.starterCode || '')
          }
        })
        .catch((error) => {
          console.error('Failed to restore lesson:', error)
          resetLesson() // Reset if restoration fails
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleLessonSelect = async (lessonId) => {
    try {
      resetLesson()
      const lessonData = await loadLesson(lessonId)
      setCurrentLesson(lessonId)
      setLessonData(lessonData)
      
      // Load first step
      if (lessonData.steps && lessonData.steps.length > 0) {
        const firstStep = lessonData.steps[0]
        setStepData(firstStep)
        loadStepCode(firstStep.starterCode || '')
      }
      setIsDrawerOpen(false) // Close drawer after selection
    } catch (error) {
      console.error('Failed to load lesson:', error)
      alert('Failed to load lesson. Please try again.')
    }
  }

  const handleCloseLesson = () => {
    resetLesson()
    setIsDrawerOpen(false)
  }

  const handleStartOver = () => {
    if (currentLesson) {
      // Reset progress for current lesson only
      resetProgress(currentLesson)
      // Clear saved code for current lesson
      clearStepCode(currentLesson)
      // Reset to step 0 and reload starter code
      setCurrentStep(0)
      if (lessonData?.steps && lessonData.steps.length > 0) {
        const firstStep = lessonData.steps[0]
        setStepData(firstStep)
        loadStepCode(firstStep.starterCode || '')
      }
      setIsDrawerOpen(false)
    }
  }

  return (
    <>
      <header className="bg-gray-800 dark:bg-gray-800 border-b border-gray-700 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-4xl font-bold font-code bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wider">Mezcode</h1>
          </div>
          <div className="flex-1 flex justify-center">
            {lessonData && (
              <h2 className="text-xl font-bold text-white dark:text-white">{lessonData.title}</h2>
            )}
          </div>
          <div className="flex-1 flex justify-end gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-700 dark:hover:bg-gray-700"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-700 dark:hover:bg-gray-700"
              title="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Menu">
        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-4">
              Lessons
            </h3>
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentLesson === lesson.id
                    ? 'bg-blue-600 dark:bg-blue-600 text-white dark:text-white'
                    : 'bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lesson.icon}</span>
                  <div>
                    <div className="font-medium">{lesson.title}</div>
                    {lesson.description && (
                      <div className="text-xs opacity-75 mt-0.5">{lesson.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {currentLesson && (
            <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-700 space-y-2">
              <button
                onClick={handleStartOver}
                className="w-full px-4 py-3 rounded-lg bg-amber-600 dark:bg-amber-600 text-white dark:text-white hover:bg-amber-700 dark:hover:bg-amber-700 transition-colors font-medium"
              >
                Start Over
              </button>
              <button
                onClick={handleCloseLesson}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close Lesson
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}

