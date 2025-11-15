// Test for Step 1: Change the Text
// userCode is passed as the first parameter from the test runner
// The framework code is provided in the background by the test runner
// The 'element' variable from the student's code is captured and available as userCode.element

// Test: Student changed the text from "Hello World" to "Hello CIT84"
test('can create elements with custom text', () => {
  // Verify the element was created by the student
  expect(userCode.element).toBeDefined();
  
  // Check that the element's text is "Hello CIT84" (the target text)
  // The student should have changed it from "Hello World" to "Hello CIT84"
  expect(userCode.element.children[0]).toBe('Hello CIT84');
});
