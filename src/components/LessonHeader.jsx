import { X } from 'lucide-react'

export default function LessonHeader({ lessonData, onClose }) {
  if (!lessonData) return null

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 relative">
      <div className="flex items-center justify-center">
        {lessonData.description && (
          <p className="text-gray-300 text-center">{lessonData.description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
          title="Close description"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

