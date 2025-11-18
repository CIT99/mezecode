import { useEffect } from 'react'
import Header from './components/Header'
import LessonView from './components/LessonView'
import { useLessonStore } from './store/lessonStore'
import { useThemeStore } from './store/themeStore'

function App() {
  const { currentLesson } = useLessonStore()
  const { initializeTheme } = useThemeStore()

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header />
      <main className="flex-1 overflow-hidden">
        {currentLesson ? (
          <LessonView />
        ) : (
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Mezcode</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Select a lesson to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

