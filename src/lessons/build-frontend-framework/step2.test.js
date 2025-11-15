// Test for createElement function
// userCode is passed as the first parameter from the test runner

// Test 1: createElement should exist
test('createElement function exists', () => {
  expect(userCode.createElement).toBeDefined();
  expect(typeof userCode.createElement).toBe('function');
});

// Test 2: createElement should return correct structure
test('createElement returns correct structure', () => {
  const element = userCode.createElement('div', { id: 'test' }, 'Hello');
  expect(element).toBeDefined();
  expect(element.type).toBe('div');
  expect(element.props).toEqual({ id: 'test' });
  expect(element.children).toBeDefined();
});

// Test 3: createElement should handle multiple children
test('createElement handles multiple children', () => {
  const element = userCode.createElement('div', {}, 'Child1', 'Child2', 'Child3');
  expect(element.children.length).toBe(3);
  expect(element.children[0]).toBe('Child1');
  expect(element.children[1]).toBe('Child2');
  expect(element.children[2]).toBe('Child3');
});

// Test 4: createElement should handle no children
test('createElement handles no children', () => {
  const element = userCode.createElement('span', { className: 'test' });
  expect(element.children).toBeDefined();
  expect(element.children.length).toBe(0);
});
