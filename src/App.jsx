import { useState } from 'react'
import Header from './components/Header'
import LessonView from './components/LessonView'
import { useLessonStore } from './store/lessonStore'

function App() {
  const { currentLesson } = useLessonStore()

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-1 overflow-hidden">
        {currentLesson ? (
          <LessonView />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to Mezcode</h1>
              <p className="text-gray-400">Select a lesson to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

