/**
 * Step 1 Preview Renderer
 * Shows the "Hello CIT84" example rendered
 * Framework code is provided in the background
 */

import { escapeJs, sanitizeCode, sanitizeError } from '../../utils/sanitize'

export const createPreviewHTML = (code) => {
  // Sanitize and validate user code before execution
  console.log('code', code);
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

  // Escape for template literal insertion (escape backticks, ${}, and backslashes)
  // But don't escape quotes since we're inserting into JavaScript code, not a string
  const escapedCode = sanitizedCode
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/`/g, '\\`')   // Escape backticks
    .replace(/\${/g, '\\${') // Escape ${ for template literals
  
  // Framework code provided in background
  const frameworkCode = `
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

function render(element, container) {
  const domElement = document.createElement(element.type);
  
  // Handle props
  Object.keys(element.props).forEach(key => {
    if (key === 'className') {
      domElement.setAttribute('class', element.props[key]);
    } else if (key.startsWith('on') && typeof element.props[key] === 'function') {
      const eventName = key.slice(2).toLowerCase();
      domElement.addEventListener(eventName, element.props[key]);
    } else {
      domElement.setAttribute(key, element.props[key]);
    }
  });
  
  // Render children
  element.children.forEach(child => {
    if (typeof child === 'string') {
      domElement.appendChild(document.createTextNode(child));
    } else {
      render(child, domElement);
    }
  });
  
  container.appendChild(domElement);
}

// Exports are set up
const exports = {};
const module = { exports: exports };
exports.createElement = createElement;
exports.render = render;
`
  
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
      font-size: 24px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      ${frameworkCode}
      
      // User's code (just the element creation line)
      ${escapedCode}
      
      // Render the element (element should be accessible here)
      const container = document.getElementById('root');
      if (typeof element !== 'undefined') {
        exports.render(element, container);
      } else {
        // Fallback: create default element if user code didn't create one
        const defaultElement = exports.createElement('div', {}, 'Hello CIT84');
        exports.render(defaultElement, container);
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
