import { useLessonStore } from '../store/lessonStore'

export default function EditorControls({ onReset, onShowHint }) {
  const { stepData } = useLessonStore()

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      <button
        onClick={onReset}
        className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
        title="Reset to starter code"
      >
        Reset
      </button>
      {stepData?.hint && (
        <button
          onClick={onShowHint}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
          title="Show hint"
        >
          Hint
        </button>
      )}
    </div>
  )
}

