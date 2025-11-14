export default function LessonHeader({ lessonData }) {
  if (!lessonData) return null

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-white mb-2">{lessonData.title}</h2>
      {lessonData.description && (
        <p className="text-gray-300">{lessonData.description}</p>
      )}
    </div>
  )
}

