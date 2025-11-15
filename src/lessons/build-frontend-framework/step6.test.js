// Test for Step 6: Build a Complete Page
// userCode is passed as the first parameter from the test runner

// Test 1: h1 tag exists
test('h1 tag is created', () => {
  const container = document.createElement('div');
  const h1 = userCode.createElement('h1', {}, 'My Heading');
  userCode.render(h1, container);
  
  const rendered = container.querySelector('h1');
  expect(rendered).toBeDefined();
  expect(rendered.tagName.toLowerCase()).toBe('h1');
  expect(rendered.textContent).toBe('My Heading');
});

// Test 2: p tag exists
test('p tag is created', () => {
  const container = document.createElement('div');
  const p = userCode.createElement('p', {}, 'Some paragraph text');
  userCode.render(p, container);
  
  const rendered = container.querySelector('p');
  expect(rendered).toBeDefined();
  expect(rendered.tagName.toLowerCase()).toBe('p');
  expect(rendered.textContent).toBe('Some paragraph text');
});

// Test 3: a tag with href and target="_blank"
test('a tag has href and target attributes', () => {
  const container = document.createElement('div');
  const link = userCode.createElement('a', { 
    href: 'https://example.com', 
    target: '_blank' 
  }, 'Click me');
  userCode.render(link, container);
  
  const rendered = container.querySelector('a');
  expect(rendered).toBeDefined();
  expect(rendered.tagName.toLowerCase()).toBe('a');
  expect(rendered.getAttribute('href')).toBe('https://example.com');
  expect(rendered.getAttribute('target')).toBe('_blank');
  expect(rendered.textContent).toBe('Click me');
});

// Test 4: Button with onClick works
test('button with onClick handler works', () => {
  const container = document.createElement('div');
  let clicked = false;
  const handleClick = () => { clicked = true; };
  const button = userCode.createElement('button', { onClick: handleClick }, 'Click me');
  userCode.render(button, container);
  
  const rendered = container.querySelector('button');
  expect(rendered).toBeDefined();
  
  rendered.click();
  expect(clicked).toBe(true);
});

// Test 5: All elements can be rendered together
test('all elements can be rendered together', () => {
  const container = document.createElement('div');
  
  const h1 = userCode.createElement('h1', {}, 'Heading');
  const p = userCode.createElement('p', {}, 'Paragraph');
  const link = userCode.createElement('a', { href: 'https://test.com', target: '_blank' }, 'Link');
  const button = userCode.createElement('button', { onClick: () => {} }, 'Button');
  
  userCode.render(h1, container);
  userCode.render(p, container);
  userCode.render(link, container);
  userCode.render(button, container);
  
  expect(container.querySelector('h1')).toBeDefined();
  expect(container.querySelector('p')).toBeDefined();
  expect(container.querySelector('a')).toBeDefined();
  expect(container.querySelector('button')).toBeDefined();
});

