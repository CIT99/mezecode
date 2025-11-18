import { useEffect, useState } from 'react'
import { useLessonStore } from '../store/lessonStore'
import { useProgressStore } from '../store/progressStore'
import { useTestRunner } from '../hooks/useTestRunner'
import { useCodeExecution } from '../hooks/useCodeExecution'
import { useMobile } from '../hooks/useMobile'
import SplitPane from './SplitPane'
import CodeEditor from './CodeEditor'
import LivePreview from './LivePreview'
import TestResultsPanel from './TestResultsPanel'
import LessonHeader from './LessonHeader'
import LessonNavigation from './LessonNavigation'
import TestFeedback from './TestFeedback'
import StepDescription from './StepDescription'
import ReactMarkdown from 'react-markdown'
import { X, Code, Eye, CheckSquare } from 'lucide-react'
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
  const { runTests, testResults, isRunning, resetTestResults } = useTestRunner()
  const { resetCode } = useCodeExecution()
  const isMobile = useMobile()
  const [previewContent, setPreviewContent] = useState('preview') // 'preview' | 'instructions' | 'hint'
  const [showLessonHeader, setShowLessonHeader] = useState(true)
  const [activePane, setActivePane] = useState('left') // 'left' (editor) | 'right' (preview) | 'tests'
  const [showTests, setShowTests] = useState(false)
  
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
      
      // Reset test results to prevent stale data from triggering modals
      resetTestResults()
      
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
    if (isMobile && activePane === 'right') {
      // On mobile, switch to editor pane to show overlay
      setActivePane('left')
    }
    setPreviewContent(previewContent === 'instructions' ? 'preview' : 'instructions')
  }

  const handleShowHint = () => {
    if (isMobile && activePane === 'right') {
      // On mobile, switch to editor pane to show overlay
      setActivePane('left')
    }
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
      
      {/* Mobile Toggle Buttons - Tab Bar Style - Always visible on mobile, outside overflow container */}
      {isMobile && (
        <div className="flex items-stretch bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 z-30" style={{ minHeight: '56px' }}>
            <button
              onClick={() => {
                setActivePane('left')
                setShowTests(false)
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-2 transition-colors min-h-[56px] ${
                activePane === 'left' && !showTests
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Code size={22} strokeWidth={activePane === 'left' && !showTests ? 2.5 : 2} />
              <span className="text-[11px] font-medium">Editor</span>
            </button>
            <button
              onClick={() => {
                setActivePane('right')
                setShowTests(false)
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-2 transition-colors min-h-[56px] ${
                activePane === 'right' && !showTests
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Eye size={22} strokeWidth={activePane === 'right' && !showTests ? 2.5 : 2} />
              <span className="text-[11px] font-medium">Preview</span>
            </button>
            <button
              onClick={() => {
                setShowTests(!showTests)
                if (!showTests) {
                  setActivePane('tests')
                } else {
                  setActivePane('left')
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-2 transition-colors min-h-[56px] relative ${
                showTests
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <CheckSquare size={22} strokeWidth={showTests ? 2.5 : 2} />
              <span className="text-[11px] font-medium">Tests</span>
              {testResults && !testResults.passed && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {testResults && testResults.passed && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </div>
        )}
      
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-hidden min-h-0">
        <SplitPane
          defaultSplit={50}
          isMobile={isMobile}
          activePane={showTests ? 'tests' : activePane}
          left={
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              {/* Editor Header with Filename and Action Buttons */}
              <div className="flex items-end justify-between bg-gray-50 dark:bg-gray-800 px-2 sm:px-4 pt-2 pb-0 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-end">
                  <div className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-l border-r border-gray-300 dark:border-gray-600 rounded-t-md -mb-px relative">
                    index.js
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {!isMobile && (
                    <button
                      onClick={() => setPreviewContent('preview')}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] ${
                        previewContent === 'preview'
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                      title="Show preview"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                  )}
                  <button
                    onClick={handleShowInstructions}
                    className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] ${
                      previewContent === 'instructions'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                    title="Show instructions"
                  >
                    <span className="hidden sm:inline">Instructions</span>
                    <span className="sm:hidden">Info</span>
                    {previewContent === 'instructions' && <X size={14} />}
                  </button>
                  {stepData?.hint && (
                    <button
                      onClick={handleShowHint}
                      className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] ${
                        previewContent === 'hint'
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                      title="Show hint"
                    >
                      <span className="hidden sm:inline">Hint</span>
                      <span className="sm:hidden">?</span>
                      {previewContent === 'hint' && <X size={14} />}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white transition-colors min-h-[44px]"
                    title="Reset to starter code"
                  >
                    <span className="hidden sm:inline">Reset</span>
                    <span className="sm:hidden">↺</span>
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden relative flex flex-col">
                <div className="flex-1 overflow-hidden relative">
                <CodeEditor />
                  
                  {/* Mobile Overlay for Instructions */}
                  {isMobile && previewContent === 'instructions' && activePane === 'left' && (
                  <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 sm:px-4 py-2 flex-shrink-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Instructions</h3>
                      <button
                        onClick={() => setPreviewContent('preview')}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title="Close instructions"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <StepDescription stepData={stepData} />
                    </div>
                  </div>
                )}
                
                {/* Mobile Overlay for Hint */}
                {isMobile && previewContent === 'hint' && activePane === 'left' && stepData?.hint && (
                  <div className="absolute inset-0 z-50 bg-yellow-50 dark:bg-yellow-900/30 flex flex-col">
                    <div className="flex items-center justify-between border-b border-yellow-200 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-800/50 px-3 sm:px-4 py-2 flex-shrink-0">
                      <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Hint</h3>
                      <button
                        onClick={() => setPreviewContent('preview')}
                        className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors p-1.5 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700/50 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title="Close hint"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="prose prose-sm max-w-none prose-yellow dark:prose-invert">
                        <h2 className="text-xl font-bold mb-3 text-yellow-800 dark:text-yellow-300">Hint</h2>
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
                )}
                </div>
                
              </div>
            </div>
          }
          right={
            showTests && isMobile ? (
              <div className="h-full flex flex-col bg-white dark:bg-gray-900">
                <div className="flex-1 overflow-y-auto">
                  <TestResultsPanel results={testResults} isLoading={isRunning} defaultOpen={true} />
                </div>
              </div>
            ) : (
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              {/* On mobile, always show preview in right pane (instructions/hint overlay on editor) */}
              {isMobile ? (
                <>
                  <div className="flex-1 overflow-hidden">
                    <LivePreview />
                  </div>
                  <TestResultsPanel results={testResults} isLoading={isRunning} />
                </>
              ) : previewContent === 'instructions' ? (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-end border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 sm:px-4 py-2 flex-shrink-0">
                    <button
                      onClick={() => setPreviewContent('preview')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1.5 sm:p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Close instructions"
                    >
                      <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <StepDescription stepData={stepData} />
                  </div>
                </div>
              ) : previewContent === 'hint' && stepData?.hint ? (
                <div className="flex-1 overflow-hidden flex flex-col bg-yellow-50 dark:bg-yellow-900/30">
                  <div className="flex items-center justify-end border-b border-yellow-200 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-800/50 px-3 sm:px-4 py-2 flex-shrink-0">
                    <button
                      onClick={() => setPreviewContent('preview')}
                      className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors p-1.5 sm:p-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700/50 min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Close hint"
                    >
                      <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="prose prose-sm sm:prose-base max-w-none prose-yellow dark:prose-invert">
                      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-800 dark:text-yellow-300">Hint</h2>
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
            )
          }
        />
        </div>
      </div>

      {testResults && (
        <div className="flex-shrink-0 px-3 sm:px-4 py-2 border-t border-gray-200 dark:border-gray-700">
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

