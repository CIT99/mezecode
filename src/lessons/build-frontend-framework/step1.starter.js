// ============================================================================
// Welcome to "Build a Frontend Framework"!
// ============================================================================
//
// 🎉 Congratulations on starting this lesson! You're about to learn how to
// build a simple frontend framework from scratch - similar to React, but
// simplified so you can understand the core concepts.
//
// 📚 What You'll Learn:
//   - How to create virtual DOM elements (like React's JSX)
//   - How to render components to the real DOM
//   - How to handle props, events, and styling
//   - The fundamentals of how modern frameworks work under the hood
//
// 🚀 This First Step:
//   This is a quick introduction step! The framework code is already complete
//   and working. You'll see it in action before we start building it from scratch.
//
// ✏️ Your Task:
//   Look at the code below. You'll see it creates an element with the text
//   "Hello World". Your job is simple: change "Hello World" to "Hello CIT84"
//
// 💡 What's Happening:
//   - `createElement()` creates a virtual DOM element (an object representation)
//   - `render()` converts that object into a real DOM element
//   - The result appears in the preview panel on the right
//
// 🎯 Ready? Let's get started!

const element = exports.createElement('div', {}, 'Hello World');
