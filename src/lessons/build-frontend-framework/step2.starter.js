// Step 2: Create a Component Function
// =====================================
// Your task: Create a function called `createElement` that builds a virtual DOM element object.
//
// Function signature:
//   createElement(tag, props = {}, ...children)
//
// Parameters:
//   - tag: string (e.g., 'div', 'span', 'button')
//   - props: object (optional, defaults to {}) - properties/attributes for the element
//   - ...children: rest parameter - any number of child elements (strings or element objects)
//
// Returns:
//   An object with three properties:
//   {
//     type: tag,        // The tag name
//     props: props,     // The props object
//     children: children // Array of children
//   }
//
// Example:
//   createElement('div', { id: 'my-div' }, 'Hello', 'World')
//   Returns: { type: 'div', props: { id: 'my-div' }, children: ['Hello', 'World'] }
//
// Hints:
//   - Use default parameter syntax: props = {}
//   - Use rest parameter syntax: ...children
//   - Return a plain object literal

function createElement(tag, props = {}, ...children) {
  // TODO: Return an object with type, props, and children properties
  // Your code here:
  
}

// Don't forget to export your function!
exports.createElement = createElement;

