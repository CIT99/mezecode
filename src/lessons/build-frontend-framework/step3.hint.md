## Hint: Enhancing Render with Special Props

### Understanding Special Props

Some props need special handling because they don't map directly to HTML attributes:
- `className` → needs to become the `class` attribute (since `class` is a reserved word in JavaScript)
- Event handlers (`onClick`, `onSubmit`, etc.) → need to be attached as event listeners, not attributes

### Handling className

The `className` prop should map to the HTML `class` attribute:

```javascript
if (key === 'className') {
  domElement.setAttribute('class', element.props[key]);
}
```

**Why?** In JSX/React, we use `className` instead of `class` because `class` is a reserved keyword in JavaScript.

### Handling Event Handlers

Event handlers are props that start with `'on'` and have a function as their value:

```javascript
if (key.startsWith('on') && typeof element.props[key] === 'function') {
  // Extract event name: 'onClick' -> 'click'
  const eventName = key.slice(2).toLowerCase();
  // Attach event listener
  domElement.addEventListener(eventName, element.props[key]);
}
```

**Breaking it down:**
- `key.startsWith('on')` - checks if prop name starts with 'on'
- `typeof element.props[key] === 'function'` - ensures it's a function
- `key.slice(2)` - removes first 2 characters ('on' from 'onClick')
- `.toLowerCase()` - converts 'Click' to 'click'
- `addEventListener(eventName, handler)` - attaches the event listener

### Complete Implementation Pattern

You'll need to modify the props handling section in your render function:

```javascript
Object.keys(element.props).forEach(key => {
  const value = element.props[key];
  
  if (key === 'className') {
    // Special case: className → class attribute
    domElement.setAttribute('class', value);
  } else if (key.startsWith('on') && typeof value === 'function') {
    // Special case: event handlers
    const eventName = key.slice(2).toLowerCase();
    domElement.addEventListener(eventName, value);
  } else {
    // Regular attributes
    domElement.setAttribute(key, value);
  }
});
```

### Examples

**Example 1: className**
```javascript
createElement('div', { className: 'container' })
// Should set: domElement.setAttribute('class', 'container')
// Result: <div class="container"></div>
```

**Example 2: onClick**
```javascript
const handleClick = () => console.log('Clicked!');
createElement('button', { onClick: handleClick }, 'Click me')
// Should call: domElement.addEventListener('click', handleClick)
// Result: <button>Click me</button> with click handler attached
```

**Example 3: Multiple special props**
```javascript
const handleSubmit = () => console.log('Submitted!');
createElement('form', { 
  className: 'my-form', 
  onSubmit: handleSubmit,
  id: 'form-1'
})
// Should:
// - setAttribute('class', 'my-form')
// - addEventListener('submit', handleSubmit)
// - setAttribute('id', 'form-1')
```

### Common Event Name Conversions

- `onClick` → `'click'`
- `onSubmit` → `'submit'`
- `onChange` → `'change'`
- `onFocus` → `'focus'`
- `onBlur` → `'blur'`

The pattern is always: remove `'on'` prefix and lowercase the rest.

### Common Mistakes to Avoid

- Forgetting to check `typeof value === 'function'` for event handlers
- Not lowercasing the event name (should be 'click', not 'Click')
- Using `setAttribute` for event handlers instead of `addEventListener`
- Not handling regular props in the else case
- Checking for event handlers before className (order matters - check className first!)

