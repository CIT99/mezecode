// You should have createElement and render from previous steps
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

function render(element, container) {
  const domElement = document.createElement(element.type);
  
  Object.keys(element.props).forEach(key => {
    domElement.setAttribute(key, element.props[key]);
  });
  
  element.children.forEach(child => {
    if (typeof child === 'string') {
      domElement.appendChild(document.createTextNode(child));
    } else {
      render(child, domElement);
    }
  });
  
  container.appendChild(domElement);
}

// Enhance render to handle:
// - className prop (should set 'class' attribute)
// - Event handlers (props starting with 'on' like onClick, onSubmit)

// Your enhanced render function:

