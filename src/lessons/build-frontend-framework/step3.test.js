// userCode is passed as the first parameter from the test runner

// Test 1: className maps to class attribute
test('className maps to class attribute', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('div', { className: 'my-class' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.className).toBe('my-class');
  expect(rendered.getAttribute('class')).toBe('my-class');
});

// Test 2: Regular props still work
test('regular props still work', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('input', { type: 'text', id: 'my-input' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.type).toBe('text');
  expect(rendered.id).toBe('my-input');
});

// Test 3: className and regular props work together
test('className and regular props work together', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('button', { className: 'btn', id: 'my-button', type: 'submit' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.className).toBe('btn');
  expect(rendered.id).toBe('my-button');
  expect(rendered.type).toBe('submit');
});
