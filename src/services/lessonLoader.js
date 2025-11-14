/**
 * Dynamic lesson loading service
 * Loads lesson data from JSON files and associated code/test files
 * Uses Vite's import.meta.glob for proper bundling in production
 */

// Pre-load all lesson files using Vite's glob import
// This ensures files are bundled and available in production
// Using ?raw to import files as raw strings
const lessonModules = import.meta.glob('/src/lessons/**/*.{json,js,md}', { 
  eager: false,
  query: '?raw'
})

// Cache for loaded modules
const moduleCache = new Map()

const getModulePath = (lessonId, filename) => {
  return `/src/lessons/${lessonId}/${filename}`
}

const loadModule = async (path) => {
  // Check cache first
  if (moduleCache.has(path)) {
    return moduleCache.get(path)
  }

  // Normalize path for comparison (handle both / and \)
  const normalizedPath = path.replace(/\\/g, '/')
  
  // Try to find matching module
  const moduleKey = Object.keys(lessonModules).find(key => {
    const normalizedKey = key.replace(/\\/g, '/')
    return normalizedKey === normalizedPath || normalizedKey.endsWith(normalizedPath)
  })

  if (!moduleKey) {
    console.warn(`Module not found: ${path}`)
    return null
  }

  try {
    const moduleLoader = lessonModules[moduleKey]
    if (typeof moduleLoader !== 'function') {
      console.warn(`Module loader is not a function for: ${path}`)
      return null
    }
    
    const content = await moduleLoader()
    // With ?raw query, content should be a string directly
    // Handle both direct string returns and module objects
    let textContent
    if (typeof content === 'string') {
      textContent = content
    } else if (content && typeof content === 'object') {
      // Handle module object - try default export first, then the object itself
      textContent = content.default || content
      if (typeof textContent !== 'string') {
        textContent = JSON.stringify(textContent)
      }
    } else {
      textContent = String(content || '')
    }
    moduleCache.set(path, textContent)
    return textContent
  } catch (error) {
    console.warn(`Failed to load module: ${path}`, error)
    return null
  }
}

export const loadLesson = async (lessonId) => {
  try {
    // Load lesson.json
    const lessonJsonPath = getModulePath(lessonId, 'lesson.json')
    const lessonJsonContent = await loadModule(lessonJsonPath)
    
    if (!lessonJsonContent) {
      throw new Error(`Failed to load lesson: ${lessonId}`)
    }

    const lessonData = JSON.parse(lessonJsonContent)
    
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
    const stepJsonPath = getModulePath(lessonId, `step${stepNumber}.json`)
    const stepJsonContent = await loadModule(stepJsonPath)
    
    if (!stepJsonContent) {
      throw new Error(`Failed to load step ${stepNumber} for lesson ${lessonId}`)
    }

    const stepData = JSON.parse(stepJsonContent)
    
    // Load starter code
    const starterPath = getModulePath(lessonId, `step${stepNumber}.starter.js`)
    const starterCode = await loadModule(starterPath)
    if (starterCode) {
      stepData.starterCode = starterCode
    }
    
    // Load solution code
    const solutionPath = getModulePath(lessonId, `step${stepNumber}.solution.js`)
    const solutionCode = await loadModule(solutionPath)
    if (solutionCode) {
      stepData.solutionCode = solutionCode
    }
    
    // Load hint
    const hintPath = getModulePath(lessonId, `step${stepNumber}.hint.md`)
    const hintContent = await loadModule(hintPath)
    if (hintContent) {
      stepData.hint = hintContent
    }
    
    // Load test file
    const testPath = getModulePath(lessonId, `step${stepNumber}.test.js`)
    const testCode = await loadModule(testPath)
    if (testCode) {
      stepData.testCode = testCode
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

