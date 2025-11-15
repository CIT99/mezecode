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
      // Map className to class attribute
      domElement.setAttribute('class', element.props[key]);
    } else if (key.startsWith('on') && typeof element.props[key] === 'function') {
      // Handle event handlers (onClick, onSubmit, etc.)
      const eventName = key.slice(2).toLowerCase(); // onClick -> click
      domElement.addEventListener(eventName, element.props[key]);
    } else {
      // Regular attributes
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

exports.createElement = createElement;
exports.render = render;

