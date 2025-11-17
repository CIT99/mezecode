// Step 6: Build a Complete Page
// Solution

exports.appTree = exports.createElement(
  'div',
  {},
  exports.createElement('h1', {}, 'Welcome!'),
  exports.createElement('p', {}, 'Create your h1, p, a, and button elements!'),
  exports.createElement('a', { href: 'https://example.com', target: '_blank' }, 'Example Link'),
  exports.createElement('button', { onClick: () => alert('Almost there!') }, 'Click me')
);

