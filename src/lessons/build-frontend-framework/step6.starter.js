// Step 6: Build a Complete Page
// ===============================
// You've built the framework! Now let's use it to create a complete page.
//
// Your task: Create an appTree that contains:
// - An h1 tag with a heading
// - A p tag with some text
// - An a tag with href and target="_blank"
//
// The createElement and render functions are provided for you in the preview.
// You just need to export an appTree using exports.createElement!

// TODO: Create your appTree using exports.createElement
exports.appTree = exports.createElement(
    'div',
    {},
    exports.createElement('div', {style: "background: cyan;text-align:center; padding: 1rem; border-radius:.5rem;"}, 
      exports.createElement("strong", {style:"display:block;"}, 'Congratulations! You are almost done!'),
      exports.createElement("span", {style:"display:block;"}, 'Add some elements on the page!'),
      exports.createElement('button', { onClick: () => alert('You can do it!')}, 'Click me'),
      ),
    // Your code here:
  
    
  );