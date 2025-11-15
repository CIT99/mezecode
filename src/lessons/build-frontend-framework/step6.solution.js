// Step 6: Build a Complete Page
// Solution

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

const container = document.getElementById('root') || document.body;

// Create h1 tag
const heading = createElement('h1', {}, 'Welcome to My Framework!');
render(heading, container);

// Create p tag
const paragraph = createElement('p', {}, 'This is a paragraph created with our custom framework.');
render(paragraph, container);

// Create a tag with href and target="_blank"
const link = createElement('a', { 
  href: 'https://github.com', 
  target: '_blank' 
}, 'Visit GitHub');
render(link, container);

// Button with onClick handler
const button = createElement('button', { 
  onClick: () => alert('Almost there!') 
}, 'Click me');
render(button, container);

exports.createElement = createElement;
exports.render = render;

