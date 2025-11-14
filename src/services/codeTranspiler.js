/**
 * Code transpilation service
 * Uses Vite's esbuild for fast JSX/ES6+ transpilation
 */

export const transpileCode = async (code) => {
  try {
    // For now, we'll use a simple approach with eval in a controlled environment
    // In production, this should use a proper transpiler or iframe sandboxing
    // This is a placeholder - actual implementation will depend on preview strategy
    
    // Remove React imports if present (we'll inject them)
    const cleanedCode = code.replace(/^import\s+.*from\s+['"]react['"];?\s*/gm, '')
    
    return {
      success: true,
      code: cleanedCode,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export const createPreviewCode = (userCode) => {
  // Wrap user code in a function that can be executed
  // This will be used by the preview renderer
  return `
    ${userCode}
  `
}

