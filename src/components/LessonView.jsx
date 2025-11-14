import { useEffect, useState } from 'react'
import { useLessonStore } from '../store/lessonStore'
import { useTestRunner } from '../hooks/useTestRunner'
import { useCodeExecution } from '../hooks/useCodeExecution'
import SplitPane from './SplitPane'
import CodeEditor from './CodeEditor'
import EditorControls from './EditorControls'
import LivePreview from './LivePreview'
import TestResultsPanel from './TestResultsPanel'
import LessonHeader from './LessonHeader'
import StepIndicator from './StepIndicator'
import LessonNavigation from './LessonNavigation'
import TestFeedback from './TestFeedback'
import StepDescription from './StepDescription'

export default function LessonView() {
  const {
    lessonData,
    currentStep,
    code,
    stepData,
    setStepData,
    setCurrentStep,
    loadStepCode,
  } = useLessonStore()

  const { runTests, testResults, isRunning } = useTestRunner()
  const { resetCode } = useCodeExecution()
  const [showHint, setShowHint] = useState(false)

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
        <div className="text-gray-400">Loading lesson...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <LessonHeader lessonData={lessonData} />
      <StepIndicator />
      <StepDescription stepData={stepData} />
      
      <div className="flex-1 overflow-hidden">
        <SplitPane
          left={
            <div className="h-full flex flex-col bg-gray-900">
              <EditorControls onReset={handleReset} onShowHint={handleShowHint} />
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
              {showHint && stepData?.hint && (
                <div className="bg-yellow-900/30 border-t border-yellow-700 p-4">
                  <div className="text-yellow-300 font-semibold mb-2">Hint:</div>
                  <div className="text-yellow-200 text-sm whitespace-pre-wrap">{stepData.hint}</div>
                </div>
              )}
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <LivePreview />
              </div>
              <div className="h-64 border-t border-gray-700">
                <TestResultsPanel results={testResults} isLoading={isRunning} />
              </div>
            </div>
          }
        />
      </div>

      {testResults && (
        <div className="px-4 py-2 border-t border-gray-700">
          <TestFeedback results={testResults} />
        </div>
      )}

      <LessonNavigation />
    </div>
  )
}

