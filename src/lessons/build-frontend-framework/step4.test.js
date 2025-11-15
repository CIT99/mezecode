// userCode is passed as the first parameter from the test runner

// Test 1: onClick handler is attached
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

// Test 2: Other event handlers work
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

// Test 3: Event handlers work with className
test('event handlers work with className', () => {
  const container = document.createElement('div');
  let clicked = false;
  const handleClick = () => { clicked = true; };
  const element = userCode.createElement('button', { className: 'btn', onClick: handleClick }, 'Click me');
  userCode.render(element, container);
  
  const rendered = container.firstChild;
  expect(rendered.className).toBe('btn');
  expect(rendered.onclick).toBeDefined();
  
  rendered.click();
  expect(clicked).toBe(true);
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

