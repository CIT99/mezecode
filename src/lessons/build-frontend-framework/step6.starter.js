// Step 6: Build a Complete Page
// ===============================
// You've built the framework! Now let's use it to create a complete page.
//
// Your task: Create an h1 tag, a p tag, and an a tag with href and target="_blank"
// There's a button example below - use it as a reference!

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

// Example: Button with onClick handler
const container = document.getElementById('root') || document.body;
const button = createElement('button', { 
  onClick: () => alert('Almost there!') 
}, 'Click me');
render(button, container);

// TODO: Create an h1 tag with a heading
// TODO: Create a p tag with some text
// TODO: Create an a tag with href and target="_blank"
// Your code here:

// Don't forget to export your functions!
exports.createElement = createElement;
exports.render = render;

