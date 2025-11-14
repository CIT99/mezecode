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
      background: #1a1a1a;
      color: #fff;
    }
    #root {
      padding: 20px;
    }
    .error {
      color: #ff6b6b;
      padding: 20px;
      background: #2a1a1a;
      border: 1px solid #ff6b6b;
      border-radius: 4px;
    }
    .success {
      color: #51cf66;
      padding: 20px;
      background: #1a2a1a;
      border: 1px solid #51cf66;
      border-radius: 4px;
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

