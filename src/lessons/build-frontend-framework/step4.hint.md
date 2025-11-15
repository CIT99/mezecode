## Hint: Adding Event Handler Support

### Understanding Event Handlers

Event handlers are special props that start with `'on'` followed by an event name (like `onClick`, `onSubmit`, `onChange`). Unlike regular attributes, these need to be attached as event listeners, not set as HTML attributes.

### Key Concept: Detecting Event Handlers

An event handler prop has two characteristics:
1. The key starts with `'on'` (e.g., `onClick`, `onSubmit`)
2. The value is a function

```javascript
// Event handler example
{ onClick: () => console.log('clicked') }
//   ^^^^^ starts with 'on'
//         ^^^^^^^^^^^^^^^^^^^^ value is a function
```

### Implementation Pattern

You need to add a check in your props handling loop:

```javascript
Object.keys(element.props).forEach(key => {
  const value = element.props[key];
  
  if (key === 'className') {
    // Handle className (from step 3)
    domElement.setAttribute('class', value);
  } else if (key.startsWith('on') && typeof value === 'function') {
    // NEW: Handle event handlers
    const eventName = key.slice(2).toLowerCase();
    domElement.addEventListener(eventName, value);
  } else {
    // Regular attributes
    domElement.setAttribute(key, value);
  }
});
```

### Breaking Down the Event Handler Code

1. **Check if it's an event handler:**
   ```javascript
   key.startsWith('on') && typeof value === 'function'
   ```
   - `key.startsWith('on')` - checks if prop name starts with 'on'
   - `typeof value === 'function'` - ensures the value is actually a function

2. **Extract the event name:**
   ```javascript
   const eventName = key.slice(2).toLowerCase();
   ```
   - `key.slice(2)` - removes first 2 characters ('on' from 'onClick')
   - `.toLowerCase()` - converts 'Click' to 'click' (DOM events are lowercase)

3. **Attach the event listener:**
   ```javascript
   domElement.addEventListener(eventName, value);
   ```
   - `addEventListener` - the standard DOM method for attaching event handlers
   - `eventName` - the event type (e.g., 'click', 'submit')
   - `value` - the function to call when the event fires

### Examples

**Example 1: onClick**
```javascript
const handleClick = () => console.log('Button clicked!');
createElement('button', { onClick: handleClick }, 'Click me')
// When rendered:
// - Checks: 'onClick'.startsWith('on') → true
// - Checks: typeof handleClick === 'function' → true
// - Extracts: 'onClick'.slice(2).toLowerCase() → 'click'
// - Calls: domElement.addEventListener('click', handleClick)
```

**Example 2: onSubmit**
```javascript
const handleSubmit = (e) => { e.preventDefault(); console.log('Form submitted'); };
createElement('form', { onSubmit: handleSubmit })
// Extracts: 'onSubmit'.slice(2).toLowerCase() → 'submit'
// Calls: domElement.addEventListener('submit', handleSubmit)
```

**Example 3: Multiple Props Together**
```javascript
const handleClick = () => console.log('Clicked');
createElement('button', { 
  className: 'btn-primary',
  id: 'my-button',
  onClick: handleClick
}, 'Click me')
// Handles:
// - className → setAttribute('class', 'btn-primary')
// - id → setAttribute('id', 'my-button')
// - onClick → addEventListener('click', handleClick)
```

### Common Event Name Conversions

- `onClick` → `'click'`
- `onSubmit` → `'submit'`
- `onChange` → `'change'`
- `onFocus` → `'focus'`
- `onBlur` → `'blur'`
- `onMouseEnter` → `'mouseenter'`
- `onMouseLeave` → `'mouseleave'`

The pattern is always: remove the `'on'` prefix and lowercase the rest.

### Why Not Use setAttribute?

You might wonder why we can't just do:
```javascript
domElement.setAttribute('onclick', handler) // ❌ This won't work!
```

The reason is that `setAttribute` sets a string attribute, but event handlers need to be actual JavaScript functions. The `addEventListener` method properly attaches the function so it can be called when the event occurs.

### Order Matters!

Make sure to check for event handlers **after** checking for `className`, but **before** the else case for regular attributes:

```javascript
if (key === 'className') {
  // Check this first
} else if (key.startsWith('on') && typeof value === 'function') {
  // Check this second
} else {
  // Regular attributes last
}
```

### Common Mistakes to Avoid

- Forgetting to check `typeof value === 'function'` (not all props starting with 'on' are event handlers)
- Not lowercasing the event name (should be 'click', not 'Click')
- Using `setAttribute` instead of `addEventListener` for event handlers
- Checking for event handlers before className (order matters!)
- Forgetting to handle regular props in the else case

### Testing Your Implementation

After implementing, test with:
```javascript
let clicked = false;
const handleClick = () => { clicked = true; };
const element = createElement('button', { onClick: handleClick }, 'Test');
const container = document.createElement('div');
render(element, container);
container.querySelector('button').click();
console.log(clicked); // Should be true
```

