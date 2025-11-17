// Step 3: Build a Render Function
// =================================
// You should already have createElement from step 1
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

// Now create a render function that converts element objects into real DOM elements
//
// Function signature:
//   render(element, container)
//
// Parameters:
//   - element: object (from createElement) - the virtual DOM element to render
//   - container: DOM element - where to append the rendered element
//
// What it should do:
//   1. Create a real DOM element using document.createElement(element.type)
//   2. Set all props as attributes on the DOM element (use setAttribute)
//   3. Handle children:
//      - If child is a string: create a text node and append it
//      - If child is an object: recursively call render(child, domElement)
//   4. Append the created DOM element to the container
//
// Example:
//   const element = createElement('div', { id: 'test' }, 'Hello');
//   const container = document.getElementById('app');
//   render(element, container);
//   Result: <div id="test">Hello</div> is added to the container
//
// Hints:
//   - Use document.createElement(tagName) to create DOM elements
//   - Use element.setAttribute(key, value) to set attributes
//   - Use document.createTextNode(text) for text content
//   - Use element.appendChild(child) to add children
//   - Check typeof child === 'string' to distinguish text from element objects
//   - Remember to recursively call render() for nested elements!

function render(element, container) {
  // TODO: Step 1 - Create the DOM element
  // const domElement = document.createElement(???);
  
  // TODO: Step 2 - Set props as attributes
  // Object.keys(element.props).forEach(key => {
  //   domElement.setAttribute(???);
  // });
  
  // TODO: Step 3 - Handle children
  // element.children.forEach(child => {
  //   if (typeof child === 'string') {
  //     // Create text node and append
  //   } else {
  //     // Recursively render nested elements
  //   }
  // });
  
  // TODO: Step 4 - Append to container
  // container.appendChild(???);
  
  // Your code here:
  
}

// Don't forget to export both functions!
exports.createElement = createElement;
exports.render = render;

