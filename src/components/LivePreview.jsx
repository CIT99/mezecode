import { useEffect, useRef, useState } from 'react'
import { useLessonStore } from '../store/lessonStore'
import { createPreviewHTML, createBlobURL } from '../services/previewRenderer'

export default function LivePreview() {
  const { code } = useLessonStore()
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)
  const blobURLRef = useRef(null)

  useEffect(() => {
    if (!iframeRef.current) return

    // Clean up previous blob URL
    if (blobURLRef.current) {
      URL.revokeObjectURL(blobURLRef.current)
    }

    try {
      setError(null)
      const html = createPreviewHTML(code || '')
      const blobURL = createBlobURL(html)
      blobURLRef.current = blobURL
      iframeRef.current.src = blobURL
    } catch (err) {
      setError(err.message)
      console.error('Preview error:', err)
    }

    return () => {
      if (blobURLRef.current) {
        URL.revokeObjectURL(blobURLRef.current)
      }
    }
  }, [code])

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
      </div>
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 p-4 bg-red-50 text-red-800">
            <div className="font-semibold mb-2">Preview Error:</div>
            <pre className="text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            title="Code Preview"
          />
        )}
      </div>
    </div>
  )
}

