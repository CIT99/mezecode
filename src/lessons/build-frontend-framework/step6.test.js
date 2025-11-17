// Test for Step 6: Build a Complete Page
// userCode is passed as the first parameter from the test runner
// The framework code (createElement and render) is provided in the background

// Helper function to check if appTree contains a tag
function hasTag(appTree, tagName) {
  if (!appTree || !appTree.type) {
    return false;
  }
  
  if (appTree.type.toLowerCase() === tagName.toLowerCase()) {
    return true;
  }
  
  if (appTree.children) {
    for (let child of appTree.children) {
      if (typeof child === 'object' && hasTag(child, tagName)) {
        return true;
      }
    }
  }
  
  return false;
}

// Test 1: appTree is exported
test('appTree is exported', () => {
  expect(userCode.appTree).toBeDefined();
});

// Test 2: appTree contains h1 tag
test('appTree contains h1 tag', () => {
  expect(userCode.appTree).toBeDefined();
  expect(hasTag(userCode.appTree, 'h1')).toBe(true);
});

// Test 3: appTree contains p tag
test('appTree contains p tag', () => {
  expect(userCode.appTree).toBeDefined();
  expect(hasTag(userCode.appTree, 'p')).toBe(true);
});

// Test 4: appTree contains a tag
test('appTree contains a tag', () => {
  expect(userCode.appTree).toBeDefined();
  expect(hasTag(userCode.appTree, 'a')).toBe(true);
});

