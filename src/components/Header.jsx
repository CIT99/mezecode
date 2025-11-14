import { useEffect } from 'react'
import { getAllLessons } from '../lessons/index'
import { useLessonStore } from '../store/lessonStore'
import { loadLesson } from '../services/lessonLoader'

export default function Header() {
  const { currentLesson, lessonData, setCurrentLesson, setLessonData, setStepData, loadStepCode, resetLesson, setCurrentStep } = useLessonStore()
  const lessons = getAllLessons()

  // Restore persisted lesson on page load
  useEffect(() => {
    // Only run once on mount to restore persisted lesson
    const persistedLesson = currentLesson
    if (persistedLesson && !lessonData) {
      // Lesson is persisted but data isn't loaded yet
      loadLesson(persistedLesson)
        .then((data) => {
          setCurrentStep(0) // Always start at step 0 on page load
          setLessonData(data)
          
          // Load first step
          if (data.steps && data.steps.length > 0) {
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
    } catch (error) {
      console.error('Failed to load lesson:', error)
      alert('Failed to load lesson. Please try again.')
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Mezcode</h1>
          <nav className="flex gap-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson.id)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  currentLesson === lesson.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {lesson.icon} {lesson.title}
              </button>
            ))}
          </nav>
        </div>
        {currentLesson && (
          <button
            onClick={resetLesson}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
          >
            Close Lesson
          </button>
        )}
      </div>
    </header>
  )
}

