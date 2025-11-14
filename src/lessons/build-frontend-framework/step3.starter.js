// Step 3: Add Props Support
// ===========================
// You should have createElement and render from previous steps
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

// Current render function (needs enhancement)
function render(element, container) {
  const domElement = document.createElement(element.type);
  
  // TODO: Enhance this section to handle special props
  // Currently, this sets all props as attributes, but we need special handling for:
  // 1. className → should map to 'class' attribute
  // 2. Event handlers (onClick, onSubmit, etc.) → should use addEventListener
  
  Object.keys(element.props).forEach(key => {
    // TODO: Add special handling here
    // Check if key === 'className' → use setAttribute('class', value)
    // Check if key.startsWith('on') and value is a function → use addEventListener
    // Otherwise → use setAttribute(key, value) as before
    
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

// Your task: Enhance the render function above to handle:
//
// 1. className prop:
//    - When you see props.className, use setAttribute('class', value) instead
//    - Example: { className: 'btn' } → setAttribute('class', 'btn')
//
// 2. Event handlers (props starting with 'on'):
//    - Check if key.startsWith('on') AND typeof value === 'function'
//    - Extract event name: remove 'on' prefix and lowercase (onClick → 'click')
//    - Use addEventListener(eventName, handler) instead of setAttribute
//    - Example: { onClick: handleClick } → addEventListener('click', handleClick)
//
// 3. Regular props:
//    - Keep working as before for other attributes
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
//   - Use if/else or if/else if to check prop types
//   - For event name: key.slice(2).toLowerCase() converts 'onClick' to 'click'
//   - Make sure to handle className BEFORE checking for event handlers
//   - Don't forget to handle regular props in the else case

// Your enhanced render function (modify the one above):

// Don't forget to export both functions!
exports.createElement = createElement;
exports.render = render;
