## Hint: Build a Complete Page

### What You Need to Create

You need to create three elements:
1. **h1 tag** - A heading element
2. **p tag** - A paragraph element  
3. **a tag** - A link element with `href` and `target="_blank"`

### Creating Elements

Use `createElement` for each element:

```javascript
// h1 example
const heading = createElement('h1', {}, 'My Heading');

// p example
const paragraph = createElement('p', {}, 'Some text here');

// a tag example (with props)
const link = createElement('a', { 
  href: 'https://example.com', 
  target: '_blank' 
}, 'Click me');
```

### Rendering Elements

After creating each element, render it to the container:

```javascript
const container = document.getElementById('root') || document.body;

render(heading, container);
render(paragraph, container);
render(link, container);
```

### Key Points

1. **h1 tag**: Just needs the tag name and text content
   ```javascript
   createElement('h1', {}, 'Your Heading Text')
   ```

2. **p tag**: Same pattern as h1
   ```javascript
   createElement('p', {}, 'Your paragraph text')
   ```

3. **a tag**: Needs props for `href` and `target`
   ```javascript
   createElement('a', { 
     href: 'https://your-url.com', 
     target: '_blank' 
   }, 'Link Text')
   ```

### Button Example

There's already a button example in the starter code. Notice how it uses `onClick`:
```javascript
const button = createElement('button', { 
  onClick: () => alert('Almost there!') 
}, 'Click me');
```

### Experiment!

Once you've created the required elements, try adding more:
- Images (`img` tag)
- Lists (`ul`, `ol`, `li`)
- Forms (`form`, `input`, `textarea`)
- Styled elements with `className`
- More buttons with different onClick handlers

The framework you built can handle all of these! Have fun exploring!

