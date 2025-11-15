## Hint: Creating the createElement Function

### Understanding the Requirements

You need to create a function that builds a virtual representation of a DOM element. Think of it as creating a blueprint before building the actual element.

### Key Concepts

1. **Function Parameters:**
   - `tag`: A string like `'div'`, `'span'`, `'button'`
   - `props`: An object with properties (optional, should default to `{}`)
   - `...children`: Rest parameter that collects all remaining arguments into an array

2. **Rest Parameters (`...children`):**
   ```javascript
   function example(...args) {
     console.log(args); // args is an array
   }
   example(1, 2, 3); // args = [1, 2, 3]
   ```

3. **Default Parameters:**
   ```javascript
   function example(param = {}) {
     // param defaults to {} if not provided
   }
   ```

4. **Object Literal Syntax:**
   ```javascript
   return {
     type: tag,
     props: props,
     children: children
   };
   ```

### Step-by-Step Approach

1. Start with the function declaration:
   ```javascript
   function createElement(tag, props = {}, ...children) {
   ```

2. Return an object with the three required properties:
   ```javascript
   return {
     type: tag,        // The tag name passed in
     props: props,     // The props object (or empty object)
     children: children // Array of all children (rest parameter)
   };
   ```

### Example Walkthrough

When you call:
```javascript
createElement('div', { id: 'test' }, 'Hello', 'World')
```

- `tag` = `'div'`
- `props` = `{ id: 'test' }`
- `children` = `['Hello', 'World']` (rest parameter collects these)

The function should return:
```javascript
{
  type: 'div',
  props: { id: 'test' },
  children: ['Hello', 'World']
}
```

### Common Mistakes to Avoid

- Forgetting to use rest parameter syntax (`...children` instead of `children`)
- Not providing a default value for `props`
- Returning the wrong structure (make sure it matches exactly: `type`, `props`, `children`)

