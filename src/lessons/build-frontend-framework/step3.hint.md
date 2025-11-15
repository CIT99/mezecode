## Hint: Building the Render Function

### Understanding the Task

The `render` function converts your virtual DOM element objects (from `createElement`) into real DOM elements that can be displayed in the browser.

### Key DOM APIs You'll Need

1. **Creating Elements:**
   ```javascript
   const div = document.createElement('div');
   ```

2. **Setting Attributes:**
   ```javascript
   element.setAttribute('id', 'my-id');
   // or
   element.id = 'my-id';
   ```

3. **Creating Text Nodes:**
   ```javascript
   const textNode = document.createTextNode('Hello');
   ```

4. **Appending Children:**
   ```javascript
   parentElement.appendChild(childElement);
   ```

### Step-by-Step Implementation

1. **Create the DOM element:**
   ```javascript
   const domElement = document.createElement(element.type);
   ```
   - `element.type` contains the tag name (e.g., 'div', 'span')

2. **Set all props as attributes:**
   ```javascript
   Object.keys(element.props).forEach(key => {
     domElement.setAttribute(key, element.props[key]);
   });
   ```
   - Iterate through all keys in `element.props`
   - Set each as an attribute on the DOM element

3. **Handle children:**
   ```javascript
   element.children.forEach(child => {
     if (typeof child === 'string') {
       // It's text - create a text node
       domElement.appendChild(document.createTextNode(child));
     } else {
       // It's an element object - recursively render it
       render(child, domElement);
     }
   });
   ```

4. **Append to container:**
   ```javascript
   container.appendChild(domElement);
   ```

### Understanding Recursion

When you encounter a nested element object (not a string), you need to call `render` again with that child element. This is recursion - the function calls itself!

Example:
```javascript
const inner = createElement('span', {}, 'Nested');
const outer = createElement('div', {}, inner);
```

When rendering `outer`:
- Create `<div>`
- Process children: find `inner` (an object, not a string)
- Recursively call `render(inner, div)` → creates `<span>Nested</span>`
- Append the span to the div
- Append the div to the container

### Complete Example Structure

```javascript
function render(element, container) {
  // 1. Create DOM element
  const domElement = document.createElement(element.type);
  
  // 2. Set attributes
  Object.keys(element.props).forEach(key => {
    domElement.setAttribute(key, element.props[key]);
  });
  
  // 3. Handle children
  element.children.forEach(child => {
    if (typeof child === 'string') {
      domElement.appendChild(document.createTextNode(child));
    } else {
      render(child, domElement); // Recursive call!
    }
  });
  
  // 4. Append to container
  container.appendChild(domElement);
}
```

### Common Mistakes to Avoid

- Forgetting to check if child is a string before creating text node
- Not recursively calling `render` for nested elements
- Appending to container before setting up the element completely
- Using `textContent` instead of `createTextNode` (both work, but `createTextNode` is more explicit)

