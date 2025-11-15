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
  const [showHint, setShowHint] = useState(false)
  const [activeTab, setActiveTab] = useState('instructions') // 'instructions' or 'code'
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
  }, [lessonData?.id, currentStep, testResults?.passed, JSON.stringify(completedSteps[lessonData?.id] || [])])

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
  }, [lessonData?.id, lessonData?.steps?.length, JSON.stringify(completedSteps[lessonData?.id] || [])])

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
    setShowHint(false)
  }

  const handleShowHint = () => {
    setShowHint(!showHint)
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
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'instructions'
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'code'
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    Code
                  </button>
                </div>
                {activeTab === 'code' && (
                  <div className="flex items-center gap-2 px-4">
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white transition-colors"
                      title="Reset to starter code"
                    >
                      Reset
                    </button>
                    {stepData?.hint && (
                      <button
                        onClick={handleShowHint}
                        className={`px-3 py-1.5 text-sm rounded text-white transition-colors ${
                          showHint
                            ? 'bg-yellow-600 hover:bg-yellow-500'
                            : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                        title={showHint ? 'Hide hint' : 'Show hint'}
                      >
                        {showHint ? 'Hide Hint' : 'Hint'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'instructions' ? (
                  <>
                    {stepData?.hint && (
                      <div className="flex items-center justify-end p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleShowHint}
                          className={`px-3 py-1.5 text-sm rounded text-white transition-colors ${
                            showHint
                              ? 'bg-yellow-600 hover:bg-yellow-500'
                              : 'bg-blue-600 hover:bg-blue-500'
                          }`}
                          title={showHint ? 'Hide hint' : 'Show hint'}
                        >
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-6">
                      <StepDescription stepData={stepData} />
                      {showHint && stepData?.hint && (
                        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                          <div className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">Hint:</div>
                          <div className="text-yellow-700 dark:text-yellow-200 text-sm whitespace-pre-wrap">{stepData.hint}</div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor />
                    </div>
                    {showHint && stepData?.hint && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-t border-yellow-200 dark:border-yellow-700 p-4">
                        <div className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">Hint:</div>
                        <div className="text-yellow-700 dark:text-yellow-200 text-sm whitespace-pre-wrap">{stepData.hint}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              <div className="flex-1 overflow-hidden">
                <LivePreview />
              </div>
              <TestResultsPanel results={testResults} isLoading={isRunning} />
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

