const userCode = exports;

// Test 1: className maps to class attribute
test('className maps to class attribute', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('div', { className: 'my-class' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.className).toBe('my-class');
  expect(rendered.getAttribute('class')).toBe('my-class');
});

// Test 2: onClick handler is attached
test('onClick handler is attached', () => {
  const container = document.createElement('div');
  let clicked = false;
  const handleClick = () => { clicked = true; };
  const element = userCode.createElement('button', { onClick: handleClick }, 'Click me');
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.onclick).toBeDefined();
  
  // Simulate click
  rendered.click();
  expect(clicked).toBe(true);
});

// Test 3: Other event handlers work
test('onSubmit handler is attached', () => {
  const container = document.createElement('div');
  let submitted = false;
  const handleSubmit = () => { submitted = true; };
  const element = userCode.createElement('form', { onSubmit: handleSubmit });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.onsubmit).toBeDefined();
  
  // Simulate submit
  const event = new Event('submit');
  rendered.dispatchEvent(event);
  expect(submitted).toBe(true);
});

// Test 4: Regular props still work
test('regular props still work', () => {
  const container = document.createElement('div');
  const element = userCode.createElement('input', { type: 'text', id: 'my-input' });
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.type).toBe('text');
  expect(rendered.id).toBe('my-input');
});

