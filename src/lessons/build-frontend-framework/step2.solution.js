function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

function render(element, container) {
  // Create the DOM element
  const domElement = document.createElement(element.type);
  
  // Set props as attributes
  Object.keys(element.props).forEach(key => {
    if (key === 'className') {
      // className maps to class attribute
      domElement.setAttribute('class', element.props[key]);
    } else {
      domElement.setAttribute(key, element.props[key]);
    }
  });
  
  // Render children
  element.children.forEach(child => {
    if (typeof child === 'string') {
      // Text node
      domElement.appendChild(document.createTextNode(child));
    } else {
      // Recursive render for nested elements
      render(child, domElement);
    }
  });
  
  // Append to container
  container.appendChild(domElement);
}

exports.createElement = createElement;
exports.render = render;

