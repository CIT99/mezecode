## Hint: Build a Complete Page

### What You Need to Create

The starter file already has a `div` with some example elements. You need to add three more elements to complete the `appTree`:
1. **h1 tag** - A heading element
2. **p tag** - A paragraph element  
3. **a tag** - A link element with `href` and `target="_blank"`

### Building the appTree

You need to export an `appTree` using `exports.createElement`. The `createElement` and `render` functions are provided for you in the preview - you just need to build the tree structure!

Add your elements as siblings to the existing div (after the closing parenthesis of the existing div):

```javascript
exports.appTree = exports.createElement(
  'div',
  {},
  // Existing div with congratulations message
  exports.createElement('div', {style: "..."}, ...),
  // Your code here - add these elements:
  exports.createElement('h1', {}, 'Welcome!'),
  exports.createElement('p', {}, 'Some paragraph text'),
  exports.createElement('a', { 
    href: 'https://example.com', 
    target: '_blank' 
  }, 'Example Link')
);
```

### Key Points

1. **h1 tag**: Just needs the tag name and text content
   ```javascript
   exports.createElement('h1', {}, 'Your Heading Text')
   ```

2. **p tag**: Same pattern as h1
   ```javascript
   exports.createElement('p', {}, 'Your paragraph text')
   ```

3. **a tag**: Needs props for `href` and `target`
   ```javascript
   exports.createElement('a', { 
     href: 'https://your-url.com', 
     target: '_blank' 
   }, 'Link Text')
   ```

### Button Example

There's already a button example in the starter code. Notice how it uses `onClick`:
```javascript
exports.createElement('button', { 
  onClick: () => alert('You can do it!') 
}, 'Click me')
```

### Experiment!

Once you've created the required elements, try adding more:
- Images (`img` tag)
- Lists (`ul`, `ol`, `li`)
- Forms (`form`, `input`, `textarea`)
- Styled elements with `style` or `className`
- More buttons with different onClick handlers

The framework you built can handle all of these! Have fun exploring!

