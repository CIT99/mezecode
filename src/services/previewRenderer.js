/**
 * Preview renderer service
 * Handles rendering user code in a safe iframe or transpiled environment
 */

import { escapeJs, sanitizeCode, sanitizeError, sanitizeStack } from '../utils/sanitize'

export const createPreviewHTML = (code) => {
  // Sanitize and validate user code before execution
  let sanitizedCode = ''
  try {
    sanitizedCode = sanitizeCode(code || '')
  } catch (error) {
    // If code validation fails, create error display
    const errorMsg = escapeJs(sanitizeError(error))
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
      color: #333;
    }
    #root {
      padding: 20px;
    }
    .error {
      color: #6b7280;
      padding: 20px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      border-left: 4px solid #9ca3af;
    }
    .error strong {
      color: #4b5563;
      font-weight: 600;
    }
    .error pre {
      color: #6b7280;
      margin-top: 8px;
      font-size: 13px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function() {
      const root = document.getElementById('root');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      const strong = document.createElement('strong');
      strong.textContent = 'Code Validation Error:';
      const pre = document.createElement('pre');
      pre.textContent = '${errorMsg}';
      errorDiv.appendChild(strong);
      errorDiv.appendChild(pre);
      root.appendChild(errorDiv);
    })();
  </script>
</body>
</html>
    `
  }

  // Escape code for safe JavaScript string insertion
  const escapedCode = escapeJs(sanitizedCode)
  
  // Create an HTML document that will render the user's code
  // For framework-building lessons, we'll create a simple test environment
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
      color: #333;
    }
    #root {
      padding: 20px;
    }
    .error {
      color: #6b7280;
      padding: 20px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      border-left: 4px solid #9ca3af;
    }
    .success {
      color: #059669;
      padding: 20px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    .error strong {
      color: #4b5563;
      font-weight: 600;
    }
    .error pre {
      color: #6b7280;
      margin-top: 8px;
      font-size: 13px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      // Execute user code in a module-like context
      const exports = {};
      const module = { exports: exports };
      
      ${escapedCode}
      
      // Try to render something if createElement and render exist
      if (exports.createElement && exports.render) {
        const container = document.getElementById('root');
        const element = exports.createElement('div', { className: 'success' }, 
          exports.createElement('h1', {}, 'Framework Working!'),
          exports.createElement('p', {}, 'Your createElement and render functions are working correctly.')
        );
        exports.render(element, container);
      } else {
        // Use textContent instead of innerHTML for security
        const root = document.getElementById('root');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        const strong = document.createElement('strong');
        strong.textContent = 'Note:';
        const text = document.createTextNode(' This preview works best when you have createElement and render functions. Continue building your framework!');
        errorDiv.appendChild(strong);
        errorDiv.appendChild(text);
        root.appendChild(errorDiv);
      }
    } catch (error) {
      // Use textContent instead of innerHTML to prevent XSS
      const root = document.getElementById('root');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      
      const strong = document.createElement('strong');
      strong.textContent = 'Error:';
      errorDiv.appendChild(strong);
      
      const errorPre = document.createElement('pre');
      errorPre.textContent = error.toString();
      errorDiv.appendChild(errorPre);
      
      if (error.stack) {
        const stackPre = document.createElement('pre');
        stackPre.textContent = error.stack;
        errorDiv.appendChild(stackPre);
      }
      
      root.appendChild(errorDiv);
      console.error(error);
    }
  </script>
</body>
</html>
  `
}

export const createBlobURL = (html) => {
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

