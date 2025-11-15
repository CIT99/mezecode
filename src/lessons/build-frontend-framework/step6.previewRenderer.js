/**
 * Step 6 Preview Renderer
 * Shows example with h1, p, a, and button elements
 */

import { escapeJs, sanitizeCode, sanitizeError } from '../../utils/sanitize'

export const createPreviewHTML = (code) => {
  // Sanitize and validate user code before execution
  let sanitizedCode = ''
  try {
    sanitizedCode = sanitizeCode(code || '')
  } catch (error) {
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

  const escapedCode = escapeJs(sanitizedCode)
  
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
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #1f2937;
      margin-bottom: 16px;
    }
    p {
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    a {
      color: #2563eb;
      text-decoration: none;
      margin-right: 16px;
    }
    a:hover {
      text-decoration: underline;
    }
    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 16px;
    }
    button:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      const exports = {};
      const module = { exports: exports };
      
      ${escapedCode}
      
      // The code should have already rendered to #root
      // If not, let's render an example
      if (exports.createElement && exports.render) {
        const container = document.getElementById('root');
        // Clear any existing content
        container.innerHTML = '';
        
        // Render example elements if they don't exist
        const h1 = exports.createElement('h1', {}, 'Welcome!');
        const p = exports.createElement('p', {}, 'Create your h1, p, a, and button elements!');
        const link = exports.createElement('a', { 
          href: 'https://example.com', 
          target: '_blank' 
        }, 'Example Link');
        const button = exports.createElement('button', { 
          onClick: () => alert('Almost there!') 
        }, 'Click me');
        
        exports.render(h1, container);
        exports.render(p, container);
        exports.render(link, container);
        exports.render(button, container);
      }
    } catch (error) {
      const root = document.getElementById('root');
      const errorDiv = document.createElement('div');
      errorDiv.style.color = '#dc2626';
      errorDiv.style.padding = '20px';
      errorDiv.style.background = '#fef2f2';
      errorDiv.style.border = '1px solid #fecaca';
      errorDiv.style.borderRadius = '8px';
      errorDiv.textContent = 'Error: ' + error.toString();
      root.appendChild(errorDiv);
      console.error(error);
    }
  </script>
</body>
</html>
  `
}

