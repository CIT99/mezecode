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

  // Escape for template literal insertion (escape backticks, ${}, and backslashes)
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
      // Block dangerous window properties before executing student code
      // This provides runtime protection in addition to static code analysis
      try {
        // Block access to parent window
        Object.defineProperty(window, 'parent', { 
          get: function() { 
            throw new Error('Access to window.parent is not allowed. This is restricted to prevent affecting the main application.'); 
          }, 
          configurable: false 
        });
        Object.defineProperty(window, 'top', { 
          get: function() { 
            throw new Error('Access to window.top is not allowed. This is restricted to prevent affecting the main application.'); 
          }, 
          configurable: false 
        });
        Object.defineProperty(window, 'frameElement', { 
          get: function() { 
            throw new Error('Access to window.frameElement is not allowed.'); 
          }, 
          configurable: false 
        });
        Object.defineProperty(window, 'frames', { 
          get: function() { 
            return []; 
          }, 
          configurable: false 
        });
        Object.defineProperty(window, 'postMessage', { 
          get: function() { 
            return undefined; 
          }, 
          configurable: false 
        });
      } catch(e) {
        // If properties are non-configurable, that's okay - the sanitizer will catch usage
      }
      
      ${frameworkCode}
      
      // User's code (should export appTree)
      // Sanitizer has already validated it doesn't contain dangerous patterns
      ${escapedCode}
      
      // Render the appTree if it exists
      const container = document.getElementById('root');
      if (exports.appTree) {
        exports.render(exports.appTree, container);
      } else {
        // Fallback: show example if appTree not exported
        const defaultTree = exports.createElement(
          'div',
          {},
          exports.createElement('h1', {}, 'Welcome!'),
          exports.createElement('p', {}, 'Create your h1, p, and a elements!'),
          exports.createElement('a', { href: 'https://example.com', target: '_blank' }, 'Example Link'),
          exports.createElement('button', { onClick: () => alert('Almost there!') }, 'Click me')
        );
        exports.render(defaultTree, container);
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

