/**
 * Preview renderer service
 * Handles rendering user code in a safe iframe or transpiled environment
 */

export const createPreviewHTML = (code) => {
  // Create an HTML document that will render the user's code
  // For framework-building lessons, we'll create a simple test environment
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
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
      
      ${code}
      
      // Try to render something if createElement and render exist
      if (exports.createElement && exports.render) {
        const container = document.getElementById('root');
        const element = exports.createElement('div', { className: 'success' }, 
          exports.createElement('h1', {}, 'Framework Working!'),
          exports.createElement('p', {}, 'Your createElement and render functions are working correctly.')
        );
        exports.render(element, container);
      } else {
        document.getElementById('root').innerHTML = '<div class="error"><strong>Note:</strong> This preview works best when you have createElement and render functions. Continue building your framework!</div>';
      }
    } catch (error) {
      document.getElementById('root').innerHTML = '<div class="error"><strong>Error:</strong><pre>' + error.toString() + '</pre><pre>' + error.stack + '</pre></div>';
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

