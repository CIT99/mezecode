// Step 5: Add Event Listeners
// ============================
// You should have createElement and render from previous steps
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

// Current render function (needs enhancement for event handlers)
function render(element, container) {
  const domElement = document.createElement(element.type);
  
  // TODO: Enhance this section to handle event handlers
  // Currently, this handles className, but we need special handling for:
  // Event handlers (onClick, onSubmit, etc.) → should use addEventListener
  
  Object.keys(element.props).forEach(key => {
    if (key === 'className') {
      domElement.setAttribute('class', element.props[key]);
    } else {
      // TODO: Add special handling here for event handlers
      // Check if key.startsWith('on') and value is a function → use addEventListener
      // Otherwise → use setAttribute(key, value) as before
      
      domElement.setAttribute(key, element.props[key]);
    }
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

// Your task: Enhance the render function above to handle event handlers
//
// 1. Event handlers (props starting with 'on'):
//    - Check if key.startsWith('on') AND typeof value === 'function'
//    - Extract event name: remove 'on' prefix and lowercase (onClick → 'click')
//    - Use addEventListener(eventName, handler) instead of setAttribute
//    - Example: { onClick: handleClick } → addEventListener('click', handleClick)
//
// 2. className and regular props:
//    - Keep working as before
//
// Example usage:
//   const handleClick = () => console.log('Clicked!');
//   const element = createElement('button', { 
//     className: 'btn', 
//     onClick: handleClick,
//     id: 'my-button'
//   }, 'Click me');
//   render(element, container);
//   Result: <button class="btn" id="my-button">Click me</button> with click handler
//
// Hints:
//   - Use if/else if/else to check prop types
//   - For event name: key.slice(2).toLowerCase() converts 'onClick' to 'click'
//   - Make sure to check typeof value === 'function' before adding event listener
//   - Don't forget to handle className and regular props in their respective cases

// Your enhanced render function (modify the one above):

// Don't forget to export both functions!
exports.createElement = createElement;
exports.render = render;

