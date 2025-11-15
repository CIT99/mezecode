import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * A reusable Modal component with best practices:
 * - Accessibility (ARIA attributes, focus management, keyboard navigation)
 * - Body scroll lock when open
 * - Escape key to close
 * - Click outside to close (optional)
 * - Focus trap
 * - Proper z-index layering
 * - Smooth animations
 * - Dark mode support
 * - Portal rendering ready
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {React.ReactNode} children - Modal content
 * @param {string} title - Optional modal title
 * @param {boolean} closeOnBackdropClick - Whether clicking backdrop closes modal (default: true)
 * @param {boolean} showCloseButton - Whether to show close button (default: true)
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', 'full' (default: 'md')
 * @param {React.ReactNode} footer - Optional footer content
 * @param {string} className - Additional CSS classes for the modal container
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  closeOnBackdropClick = true,
  showCloseButton = true,
  size = 'md',
  footer,
  className = '',
}) {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the currently focused element
      previousActiveElement.current = document.activeElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
    
    return () => {
      document.body.style.overflow = ''
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
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

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative z-10
          w-full ${sizeClasses[size]}
          bg-gray-800 dark:bg-gray-800
          border border-gray-700 dark:border-gray-700
          rounded-lg shadow-xl
          flex flex-col
          max-h-[90vh]
          transform transition-all duration-300 ease-out
          ${className}
        `}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-700">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-white dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-700 dark:hover:bg-gray-700 ml-auto"
                title="Close"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-700 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

