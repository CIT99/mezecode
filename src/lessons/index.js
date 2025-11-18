/**
 * Lesson registry
 * Lists all available lessons
 */

export const lessons = [
  {
    id: 'build-frontend-framework',
    path: 'build-frontend-framework',
    title: 'Build a Frontend Framework',
    description: 'Learn to build a simple frontend framework from scratch',
    icon: '⚛️',
  },
  // Add more lessons here as they're created
]

export const getLessonById = (id) => {
  return lessons.find(lesson => lesson.id === id)
}

export const getLessonByPath = (path) => {
  return lessons.find(lesson => lesson.path === path)
}

export const getAllLessons = () => {
  return lessons
}

