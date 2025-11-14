// userCode is passed as the first parameter from the test runner

// Test 1: render function exists
test('render function exists', () => {
  expect(userCode.render).toBeDefined();
  expect(typeof userCode.render).toBe('function');
});

// Test 2: render creates DOM element
test('render creates DOM element', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('div', { id: 'test' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered).toBeDefined();
  expect(rendered.tagName.toLowerCase()).toBe('div');
  expect(rendered.id).toBe('test');
});

// Test 3: render sets text content for text children
test('render sets text content', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('p', {}, 'Hello World');
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.textContent).toBe('Hello World');
});

// Test 4: render handles nested elements
test('render handles nested elements', () => {
  const container = document.createElement('div');
  const inner = userCode.createElement('span', {}, 'Nested');
  const outer = userCode.createElement('div', { className: 'outer' }, inner);
  userCode.render(outer, container);
  
  const rendered = container.firstChild;
  expect(rendered.className).toBe('outer');
  expect(rendered.firstChild.tagName.toLowerCase()).toBe('span');
  expect(rendered.firstChild.textContent).toBe('Nested');
});

