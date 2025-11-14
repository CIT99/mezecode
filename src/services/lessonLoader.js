/**
 * Dynamic lesson loading service
 * Loads lesson data from JSON files and associated code/test files
 */

export const loadLesson = async (lessonId) => {
  try {
    // Load lesson.json
    const lessonResponse = await fetch(`/src/lessons/${lessonId}/lesson.json`)
    if (!lessonResponse.ok) {
      throw new Error(`Failed to load lesson: ${lessonId}`)
    }
    const lessonData = await lessonResponse.json()
    
    // Load all step data
    const steps = []
    for (let i = 0; i < lessonData.steps.length; i++) {
      const stepNumber = lessonData.steps[i].number
      const stepData = await loadStepData(lessonId, stepNumber)
      steps.push({
        ...lessonData.steps[i],
        ...stepData,
      })
    }
    
    return {
      ...lessonData,
      id: lessonId,
      steps,
    }
  } catch (error) {
    console.error('Error loading lesson:', error)
    throw error
  }
}

export const loadStepData = async (lessonId, stepNumber) => {
  try {
    // Load step.json
    const stepResponse = await fetch(`/src/lessons/${lessonId}/step${stepNumber}.json`)
    if (!stepResponse.ok) {
      throw new Error(`Failed to load step ${stepNumber} for lesson ${lessonId}`)
    }
    const stepData = await stepResponse.json()
    
    // Load starter code
    try {
      const starterResponse = await fetch(`/src/lessons/${lessonId}/step${stepNumber}.starter.js`)
      if (starterResponse.ok) {
        stepData.starterCode = await starterResponse.text()
      }
    } catch (e) {
      console.warn(`No starter code for step ${stepNumber}`)
    }
    
    // Load solution code
    try {
      const solutionResponse = await fetch(`/src/lessons/${lessonId}/step${stepNumber}.solution.js`)
      if (solutionResponse.ok) {
        stepData.solutionCode = await solutionResponse.text()
      }
    } catch (e) {
      console.warn(`No solution code for step ${stepNumber}`)
    }
    
    // Load hint
    try {
      const hintResponse = await fetch(`/src/lessons/${lessonId}/step${stepNumber}.hint.md`)
      if (hintResponse.ok) {
        stepData.hint = await hintResponse.text()
      }
    } catch (e) {
      console.warn(`No hint for step ${stepNumber}`)
    }
    
    // Load test file
    try {
      const testResponse = await fetch(`/src/lessons/${lessonId}/step${stepNumber}.test.js`)
      if (testResponse.ok) {
        stepData.testCode = await testResponse.text()
      }
    } catch (e) {
      console.warn(`No test code for step ${stepNumber}`)
    }
    
    return stepData
  } catch (error) {
    console.error(`Error loading step ${stepNumber}:`, error)
    throw error
  }
}

export const getAvailableLessons = async () => {
  try {
    const registryResponse = await fetch('/src/lessons/index.js')
    if (!registryResponse.ok) {
      throw new Error('Failed to load lesson registry')
    }
    const registryText = await registryResponse.text()
    // Execute the registry module to get lessons
    // Note: In production, this should be handled differently
    // For now, we'll use a static import approach
    return []
  } catch (error) {
    console.error('Error loading lesson registry:', error)
    return []
  }
}

