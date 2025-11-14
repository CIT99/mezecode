import { useState, useRef, useEffect } from 'react'

export default function SplitPane({ left, right, defaultSplit = 50 }) {
  const [split, setSplit] = useState(defaultSplit)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientX - rect.left) / rect.width) * 100
      const clampedSplit = Math.max(20, Math.min(80, newSplit))
      setSplit(clampedSplit)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  return (
    <div ref={containerRef} className="flex h-full relative">
      <div className="h-full overflow-hidden" style={{ width: `${split}%` }}>
        {left}
      </div>
      <div
        className={`w-1 bg-gray-300 dark:bg-gray-700 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors ${
          isDragging ? 'bg-gray-400 dark:bg-gray-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      />
      <div className="h-full overflow-hidden flex-1" style={{ width: `${100 - split}%` }}>
        {right}
      </div>
    </div>
  )
}

