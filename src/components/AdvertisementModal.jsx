import Modal from './Modal'
import { getStep1ModalContent, getCompletionModalContent } from '../services/advertisementService'

/**
 * Advertisement Modal Component
 * 
 * Displays promotional modals at key points in the lesson flow.
 * This component is designed to be easily removable - simply delete this file
 * and remove the integration code from LessonView.jsx
 * 
 * @param {string} type - 'step1' | 'completion'
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {function} onContinue - Callback for step1 modal "Continue" button
 */
export default function AdvertisementModal({ type, isOpen, onClose, onContinue }) {
  const handleContinue = () => {
    onContinue?.()
    onClose()
  }

  if (type === 'step1') {
    const content = getStep1ModalContent()
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={content.title}
        size="md"
        closeOnBackdropClick={false}
        footer={
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              {content.buttonText}
            </button>
          </div>
        }
      >
        <div className="text-gray-300 dark:text-gray-300 space-y-6">
          {/* Profile Image and Intro - Side by Side */}
          <div className="flex items-center gap-4">
            {/* Profile Image - Smaller */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg ring-2 ring-blue-300/50 bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
                <img
                  src={content.profileImage}
                  alt="Rick Gomez"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
            
            {/* Personal Intro Text */}
            <div className="flex-1">
              <p className="text-base leading-relaxed">{content.personalIntro}</p>
            </div>
          </div>
          
          {/* Course Information - Marketing Focus */}
          <div className="space-y-4">
            {/* Main Course - Prominent but not button-like */}
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400 dark:text-blue-400 mb-1">
                {content.courseInfo}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {content.prerequisiteLabel} <span className="text-purple-400 dark:text-purple-400 font-semibold">{content.prerequisiteCourse}</span>
              </p>
            </div>
            
            {/* Call to Action - Text-based Marketing, NOT button-like */}
            <div className="text-center space-y-2 pt-2 border-t border-gray-700 dark:border-gray-600">
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">
                {content.callToAction}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-400">
                {content.enrollmentInfo}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  if (type === 'completion') {
    const content = getCompletionModalContent()
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={content.title}
        size="md"
        footer={
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="text-gray-300 dark:text-gray-300 space-y-6">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              {content.badgeText}
            </div>
          </div>
          
          {/* Message */}
          <p className="text-base leading-relaxed text-center">{content.message}</p>
        </div>
      </Modal>
    )
  }

  return null
}

