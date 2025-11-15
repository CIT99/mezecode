import { useState } from 'react'
import Modal from './Modal'

/**
 * Example usage of the Modal component
 * This file demonstrates various ways to use the Modal component
 */
export default function ModalExamples() {
  const [isBasicOpen, setIsBasicOpen] = useState(false)
  const [isWithFooterOpen, setIsWithFooterOpen] = useState(false)
  const [isLargeOpen, setIsLargeOpen] = useState(false)
  const [isNoBackdropCloseOpen, setIsNoBackdropCloseOpen] = useState(false)

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-white mb-6">Modal Examples</h1>

      {/* Basic Modal */}
      <div>
        <button
          onClick={() => setIsBasicOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Basic Modal
        </button>
        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="Basic Modal"
        >
          <p className="text-gray-300">
            This is a basic modal with a title and close button.
            You can close it by clicking the X button, pressing Escape, or clicking outside.
          </p>
        </Modal>
      </div>

      {/* Modal with Footer */}
      <div>
        <button
          onClick={() => setIsWithFooterOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Modal with Footer
        </button>
        <Modal
          isOpen={isWithFooterOpen}
          onClose={() => setIsWithFooterOpen(false)}
          title="Modal with Footer"
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsWithFooterOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsWithFooterOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          }
        >
          <p className="text-gray-300">
            This modal has a footer with action buttons.
          </p>
        </Modal>
      </div>

      {/* Large Modal */}
      <div>
        <button
          onClick={() => setIsLargeOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Large Modal
        </button>
        <Modal
          isOpen={isLargeOpen}
          onClose={() => setIsLargeOpen(false)}
          title="Large Modal"
          size="xl"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              This is a large modal (xl size). You can also use 'sm', 'md', 'lg', or 'full'.
            </p>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-300">Content area with scroll if needed.</p>
            </div>
          </div>
        </Modal>
      </div>

      {/* Modal without backdrop close */}
      <div>
        <button
          onClick={() => setIsNoBackdropCloseOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Modal (No Backdrop Close)
        </button>
        <Modal
          isOpen={isNoBackdropCloseOpen}
          onClose={() => setIsNoBackdropCloseOpen(false)}
          title="Modal Without Backdrop Close"
          closeOnBackdropClick={false}
        >
          <p className="text-gray-300">
            This modal cannot be closed by clicking outside. You must use the close button or Escape key.
          </p>
        </Modal>
      </div>

      {/* Modal without title */}
      <div>
        <button
          onClick={() => setIsBasicOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Modal Without Title
        </button>
        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          showCloseButton={true}
        >
          <p className="text-gray-300">
            This modal doesn't have a title, but still has a close button.
          </p>
        </Modal>
      </div>
    </div>
  )
}

