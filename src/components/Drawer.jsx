import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Drawer({ isOpen, onClose, children, title }) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 dark:bg-gray-800 border-l border-gray-700 dark:border-gray-700 z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-700">
          {title && (
            <h2 className="text-lg font-semibold text-white dark:text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-700 dark:hover:bg-gray-700"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Drawer Content */}
        <div className="h-[calc(100%-65px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

