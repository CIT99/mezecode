import { useEffect, useState } from 'react'
import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'
import { useTestRunner } from '../hooks/useTestRunner'
import { useCodeExecution } from '../hooks/useCodeExecution'
import SplitPane from './SplitPane'
import CodeEditor from './CodeEditor'
import LivePreview from './LivePreview'
import TestResultsPanel from './TestResultsPanel'
import LessonHeader from './LessonHeader'
import LessonNavigation from './LessonNavigation'
import TestFeedback from './TestFeedback'
import StepDescription from './StepDescription'
import ReactMarkdown from 'react-markdown'
import { X } from 'lucide-react'
// Advertisement modal integration - easily removable
import AdvertisementModal from './AdvertisementModal'

export default function LessonView() {
  const {
    lessonData,
    currentStep,
    code,
    stepData,
    setStepData,
    setCurrentStep,
    loadStepCode,
    clearStepCode,
  } = useLessonStore()

  const { resetProgress, completedSteps, hasModalBeenShown, markModalAsShown } = useProgressStore()
  const { runTests, testResults, isRunning } = useTestRunner()
  const { resetCode } = useCodeExecution()
  const [previewContent, setPreviewContent] = useState('preview') // 'preview' | 'instructions' | 'hint'
  const [showLessonHeader, setShowLessonHeader] = useState(true)
  
  // Advertisement modal state - easily removable
  const [showStep1Ad, setShowStep1Ad] = useState(false)
  const [showCompletionAd, setShowCompletionAd] = useState(false)

  // Check if all steps are completed
  const isComplete = lessonData && lessonData.steps
    ? lessonData.steps.every((_, index) => {
        const completed = completedSteps[lessonData.id] || []
        return completed.includes(index)
      })
    : false

  // Advertisement modal logic - easily removable
  // Check if we should show step1 advertisement modal (after the first step completes)
  // The first step is at index 0 (step number 1)
  useEffect(() => {
    if (!lessonData) return
    
    // Check if step 0 (first step, step number 1) is completed
    const completed = completedSteps[lessonData.id] || []
    const isFirstStepComplete = completed.includes(0)
    
    // Also check if we just completed step 0 (for immediate feedback)
    const justCompletedFirstStep = currentStep === 0 && testResults?.passed
    
    if (!isFirstStepComplete && !justCompletedFirstStep) return
    
    const modalKey = 'step1'
    if (!hasModalBeenShown(lessonData.id, modalKey)) {
      setShowStep1Ad(true)
      markModalAsShown(lessonData.id, modalKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonData?.id, currentStep, testResults?.passed, completedSteps[lessonData?.id]?.length, completedSteps[lessonData?.id]?.[0]])

  // Check if we should show completion advertisement modal
  useEffect(() => {
    if (!lessonData || !lessonData.steps) return
    
    const completed = completedSteps[lessonData.id] || []
    const allStepsComplete = lessonData.steps.every((_, index) => completed.includes(index))
    
    if (!allStepsComplete) return
    
    const modalKey = 'completion'
    if (!hasModalBeenShown(lessonData.id, modalKey)) {
      setShowCompletionAd(true)
      markModalAsShown(lessonData.id, modalKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonData?.id, lessonData?.steps?.length, completedSteps[lessonData?.id]?.length])

  // Handle "Continue with the challenge" button
  const handleContinueChallenge = () => {
    if (lessonData && lessonData.steps && currentStep < lessonData.steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      const stepData = lessonData.steps[nextStep]
      loadStepCode(stepData.starterCode || '')
    }
  }

  const handleStartOver = () => {
    if (lessonData) {
      // Reset progress for current lesson only (this also clears modal state)
      resetProgress(lessonData.id)
      // Clear saved code for current lesson
      clearStepCode(lessonData.id)
      
      // Reset modal state
      setShowStep1Ad(false)
      setShowCompletionAd(false)
      
      // Reset to step 0 and reload starter code
      setCurrentStep(0)
      if (lessonData.steps && lessonData.steps.length > 0) {
        const firstStep = lessonData.steps[0]
        setStepData(firstStep)
        loadStepCode(firstStep.starterCode || '')
      }
    }
  }

  // Load current step data
  useEffect(() => {
    if (lessonData && lessonData.steps && lessonData.steps[currentStep]) {
      const step = lessonData.steps[currentStep]
      setStepData(step)
      // Load starter code for this step
      if (step.starterCode !== undefined) {
        loadStepCode(step.starterCode || '')
      }
    }
  }, [lessonData, currentStep, setStepData, loadStepCode])

  // Auto-run tests when code changes (debounced)
  useEffect(() => {
    if (!stepData?.testCode) return

    const timeoutId = setTimeout(() => {
      runTests(code, stepData.testCode)
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [code, stepData?.testCode, runTests])

  const handleReset = () => {
    resetCode()
    setPreviewContent('preview')
  }

  const handleShowInstructions = () => {
    setPreviewContent(previewContent === 'instructions' ? 'preview' : 'instructions')
  }

  const handleShowHint = () => {
    setPreviewContent(previewContent === 'hint' ? 'preview' : 'hint')
  }

  if (!lessonData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading lesson...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {showLessonHeader && (
        <div className="flex-shrink-0">
          <LessonHeader 
            lessonData={lessonData} 
            onClose={() => setShowLessonHeader(false)}
            onStartOver={handleStartOver}
            isComplete={isComplete}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <SplitPane
          defaultSplit={50}
          left={
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              {/* Editor Header with Filename and Action Buttons */}
              <div className="flex items-end justify-between bg-gray-50 dark:bg-gray-800 px-4 pt-2 pb-0 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-end">
                  <div className="px-3 py-1.5 text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-l border-r border-gray-300 dark:border-gray-600 rounded-t-md -mb-px relative">
                    index.js
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShowInstructions}
                    className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
                      previewContent === 'instructions'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                    title="Show instructions"
                  >
                    Instructions
                    {previewContent === 'instructions' && <X size={14} />}
                  </button>
                  {stepData?.hint && (
                    <button
                      onClick={handleShowHint}
                      className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
                        previewContent === 'hint'
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                      title="Show hint"
                    >
                      Hint
                      {previewContent === 'hint' && <X size={14} />}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white transition-colors"
                    title="Reset to starter code"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              {previewContent === 'instructions' ? (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-end border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 flex-shrink-0">
                    <button
                      onClick={() => setPreviewContent('preview')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Close instructions"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <StepDescription stepData={stepData} />
                  </div>
                </div>
              ) : previewContent === 'hint' && stepData?.hint ? (
                <div className="flex-1 overflow-hidden flex flex-col bg-yellow-50 dark:bg-yellow-900/30">
                  <div className="flex items-center justify-end border-b border-yellow-200 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-800/50 px-4 py-2 flex-shrink-0">
                    <button
                      onClick={() => setPreviewContent('preview')}
                      className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors p-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700/50"
                      title="Close hint"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-sm max-w-none prose-yellow dark:prose-invert">
                      <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-300">Hint</h2>
                      <ReactMarkdown
                        components={{
                          code: ({ node, inline, ...props }) => {
                            if (inline) {
                              return (
                                <code
                                  className="!inline bg-yellow-100 dark:bg-yellow-800/50 px-1.5 py-0.5 rounded text-yellow-800 dark:text-yellow-200 font-mono text-sm"
                                  style={{ display: 'inline' }}
                                  {...props}
                                />
                              )
                            }
                            return (
                              <code
                                className="block bg-yellow-100 dark:bg-yellow-800/50 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm text-yellow-900 dark:text-yellow-100"
                                {...props}
                              />
                            )
                          },
                          pre: ({ node, ...props }) => (
                            <pre className="bg-yellow-100 dark:bg-yellow-800/50 p-4 rounded-lg my-4 overflow-x-auto" {...props} />
                          ),
                          p: ({ node, ...props }) => <p className="mb-4 text-yellow-700 dark:text-yellow-200 leading-relaxed" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-yellow-800 dark:text-yellow-300" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-yellow-800 dark:text-yellow-300" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-yellow-700 dark:text-yellow-200" {...props} />,
                          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold text-yellow-800 dark:text-yellow-300" {...props} />,
                        }}
                      >
                        {stepData.hint}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-hidden">
                    <LivePreview />
                  </div>
                  <TestResultsPanel results={testResults} isLoading={isRunning} />
                </>
              )}
            </div>
          }
        />
      </div>

      {testResults && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <TestFeedback results={testResults} />
        </div>
      )}

      <div className="flex-shrink-0">
        <LessonNavigation />
      </div>

      {/* Advertisement modals - easily removable */}
      <AdvertisementModal
        type="step1"
        isOpen={showStep1Ad}
        onClose={() => setShowStep1Ad(false)}
        onContinue={handleContinueChallenge}
      />
      <AdvertisementModal
        type="completion"
        isOpen={showCompletionAd}
        onClose={() => setShowCompletionAd(false)}
      />
    </div>
  )
}

